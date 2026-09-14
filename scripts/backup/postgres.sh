#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# shellcheck source=_common.sh
. "$SCRIPT_DIR/_common.sh"

require_runtime_tools
BACKUP_DIR=$(prepare_backup_dir "${1:-}")
FINAL_PATH="$BACKUP_DIR/postgres.dump"
assert_backup_target_available "$FINAL_PATH"
TEMP_PATH=$(mktemp "$BACKUP_DIR/.postgres.dump.XXXXXX")

cleanup() {
  rm -f -- "$TEMP_PATH"
}
trap cleanup EXIT HUP INT TERM

if ! compose ps --status running --services | grep -Fx postgres >/dev/null 2>&1; then
  printf >&2 'The postgres Compose service is not running.\n'
  exit 1
fi

compose exec -T postgres sh -ec \
  'exec pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --format=custom --compress=9 --no-owner --no-acl' \
  >"$TEMP_PATH"

if [ ! -s "$TEMP_PATH" ]; then
  printf >&2 'PostgreSQL produced an empty backup; refusing to publish it.\n'
  exit 1
fi

mv -- "$TEMP_PATH" "$FINAL_PATH"
write_checksum "$FINAL_PATH"

printf 'PostgreSQL backup written to %s\n' "$FINAL_PATH"
