#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
# shellcheck source=../backup/_common.sh
. "$PROJECT_ROOT/scripts/backup/_common.sh"

if [ "$#" -ne 1 ]; then
  printf >&2 'Usage: CONFIRM_RESTORE=YES sh scripts/restore/postgres.sh /absolute/path/postgres.dump\n'
  exit 2
fi

if [ "${CONFIRM_RESTORE:-}" != "YES" ]; then
  printf >&2 'Restore is destructive. Re-run with CONFIRM_RESTORE=YES after verifying the target and backup.\n'
  exit 2
fi

require_runtime_tools
ARCHIVE=$1
if [ ! -f "$ARCHIVE" ] || [ ! -s "$ARCHIVE" ]; then
  printf >&2 'Backup file does not exist or is empty: %s\n' "$ARCHIVE"
  exit 1
fi
ARCHIVE_DIR=$(CDPATH= cd -- "$(dirname -- "$ARCHIVE")" && pwd)
ARCHIVE="$ARCHIVE_DIR/$(basename -- "$ARCHIVE")"

verify_checksum_if_present "$ARCHIVE"

if ! compose ps --status running --services | grep -Fx postgres >/dev/null 2>&1; then
  printf >&2 'The postgres Compose service is not running.\n'
  exit 1
fi

compose exec -T postgres sh -ec \
  'exec pg_restore --list' <"$ARCHIVE" >/dev/null

SAFETY_DIR="$PROJECT_ROOT/backups/pre-restore-$(utc_timestamp)"
"$PROJECT_ROOT/scripts/backup/postgres.sh" "$SAFETY_DIR"

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

compose exec -T postgres sh -ec \
  'exec pg_restore --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --clean --if-exists --exit-on-error --no-owner --no-acl' \
  <"$ARCHIVE"

printf 'PostgreSQL restore completed. Safety backup: %s\n' "$SAFETY_DIR/postgres.dump"
