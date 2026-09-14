#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# shellcheck source=_common.sh
. "$SCRIPT_DIR/_common.sh"

require_runtime_tools
BACKUP_DIR=$(prepare_backup_dir "${1:-}")
MANIFEST_PATH="$BACKUP_DIR/manifest.txt"
assert_backup_target_available "$BACKUP_DIR/postgres.dump"
assert_backup_target_available "$BACKUP_DIR/private-storage.tar.gz"
assert_backup_target_available "$MANIFEST_PATH"

"$SCRIPT_DIR/postgres.sh" "$BACKUP_DIR"
"$SCRIPT_DIR/private-storage.sh" "$BACKUP_DIR"

TEMP_MANIFEST=$(mktemp "$BACKUP_DIR/.manifest.txt.XXXXXX")
cleanup() {
  rm -f -- "$TEMP_MANIFEST"
}
trap cleanup EXIT HUP INT TERM

{
  printf 'created_at_utc=%s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf 'compose_project=rycode\n'
  printf 'database_artifact=postgres.dump\n'
  printf 'storage_artifact=private-storage.tar.gz\n'
} >"$TEMP_MANIFEST"
mv -- "$TEMP_MANIFEST" "$MANIFEST_PATH"
write_checksum "$MANIFEST_PATH"

printf 'Complete backup set written to %s\n' "$BACKUP_DIR"
