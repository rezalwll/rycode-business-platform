#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# shellcheck source=_common.sh
. "$SCRIPT_DIR/_common.sh"

require_runtime_tools
BACKUP_DIR=$(prepare_backup_dir "${1:-}")
FINAL_PATH="$BACKUP_DIR/private-storage.tar.gz"
assert_backup_target_available "$FINAL_PATH"
TEMP_PATH=$(mktemp "$BACKUP_DIR/.private-storage.tar.gz.XXXXXX")

cleanup() {
  rm -f -- "$TEMP_PATH"
}
trap cleanup EXIT HUP INT TERM

compose run --rm --no-deps -T storage-init \
  /bin/sh -ec 'exec tar -C /storage/private -czf - .' \
  >"$TEMP_PATH"

if [ ! -s "$TEMP_PATH" ]; then
  printf >&2 'Private storage produced an empty archive; refusing to publish it.\n'
  exit 1
fi

mv -- "$TEMP_PATH" "$FINAL_PATH"
write_checksum "$FINAL_PATH"

printf 'Private-storage backup written to %s\n' "$FINAL_PATH"
