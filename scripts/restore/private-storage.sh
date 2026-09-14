#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
# shellcheck source=../backup/_common.sh
. "$PROJECT_ROOT/scripts/backup/_common.sh"

if [ "$#" -ne 1 ]; then
  printf >&2 'Usage: CONFIRM_RESTORE=YES sh scripts/restore/private-storage.sh /absolute/path/private-storage.tar.gz\n'
  exit 2
fi

if [ "${CONFIRM_RESTORE:-}" != "YES" ]; then
  printf >&2 'Restore is destructive. Re-run with CONFIRM_RESTORE=YES after verifying the target and backup.\n'
  exit 2
fi

require_runtime_tools
ARCHIVE=$1
if [ ! -f "$ARCHIVE" ] || [ ! -s "$ARCHIVE" ]; then
  printf >&2 'Archive does not exist or is empty: %s\n' "$ARCHIVE"
  exit 1
fi
ARCHIVE_DIR=$(CDPATH= cd -- "$(dirname -- "$ARCHIVE")" && pwd)
ARCHIVE="$ARCHIVE_DIR/$(basename -- "$ARCHIVE")"

verify_checksum_if_present "$ARCHIVE"
require_command tar

# Validate before touching the volume. Only relative directories and regular
# files are accepted; links and device entries could escape the restore root.
tar -tzf "$ARCHIVE" >/dev/null
if tar -tzf "$ARCHIVE" | awk '
  /^\// || /^[[:alpha:]]:/ || /(^|\/)\.\.($|\/)/ { bad = 1 }
  END { exit bad }
'; then
  :
else
  printf >&2 'Archive contains an absolute or parent-traversal path.\n'
  exit 1
fi

if tar -tvzf "$ARCHIVE" | awk '
  substr($0, 1, 1) != "-" && substr($0, 1, 1) != "d" { bad = 1 }
  END { exit bad }
'; then
  :
else
  printf >&2 'Archive contains links or non-file entries and is not safe to restore.\n'
  exit 1
fi

SAFETY_DIR="$PROJECT_ROOT/backups/pre-restore-$(utc_timestamp)"
"$PROJECT_ROOT/scripts/backup/private-storage.sh" "$SAFETY_DIR"

APP_WAS_RUNNING=false
if compose ps --status running --services | grep -Fx app >/dev/null 2>&1; then
  APP_WAS_RUNNING=true
  compose stop app
fi

restart_app() {
  if [ "$APP_WAS_RUNNING" = true ]; then
    compose start app >/dev/null 2>&1 || true
  fi
}
trap restart_app EXIT HUP INT TERM

compose run --rm --no-deps -T storage-init /bin/sh -ec '
  find /storage/private -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
  tar -C /storage/private -xzf -
  chown -R 1001:1001 /storage/private
  chmod 0750 /storage/private
' <"$ARCHIVE"

printf 'Private-storage restore completed. Safety backup: %s\n' "$SAFETY_DIR/private-storage.tar.gz"
