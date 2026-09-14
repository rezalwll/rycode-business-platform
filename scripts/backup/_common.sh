#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf >&2 'Required command is not installed: %s\n' "$1"
    exit 1
  fi
}

compose() {
  docker compose --project-directory "$PROJECT_ROOT" -f "$COMPOSE_FILE" "$@"
}

utc_timestamp() {
  date -u '+%Y%m%dT%H%M%SZ'
}

prepare_backup_dir() {
  destination=${1:-"$PROJECT_ROOT/backups/$(utc_timestamp)"}
  mkdir -p -- "$destination"
  CDPATH= cd -- "$destination" && pwd
}

assert_backup_target_available() {
  artifact=$1
  if [ -e "$artifact" ] || [ -L "$artifact" ] || [ -e "$artifact.sha256" ]; then
    printf >&2 'Refusing to overwrite an existing backup artifact: %s\n' "$artifact"
    exit 1
  fi
}

write_checksum() {
  artifact=$1
  artifact_dir=$(dirname -- "$artifact")
  artifact_name=$(basename -- "$artifact")
  (
    CDPATH= cd -- "$artifact_dir"
    sha256sum -- "$artifact_name" >"$artifact_name.sha256"
  )
}

verify_checksum_if_present() {
  artifact=$1
  checksum_file="$artifact.sha256"

  if [ -f "$checksum_file" ]; then
    expected=$(awk 'NR == 1 { print $1 } NR > 1 { exit 1 }' "$checksum_file") || {
      printf >&2 'Checksum file has an invalid format: %s\n' "$checksum_file"
      exit 1
    }
    case "$expected" in
      '' | *[!0-9A-Fa-f]*)
        printf >&2 'Checksum file has an invalid digest: %s\n' "$checksum_file"
        exit 1
        ;;
    esac
    if [ "${#expected}" -ne 64 ]; then
      printf >&2 'Checksum file has an invalid digest length: %s\n' "$checksum_file"
      exit 1
    fi

    actual=$(sha256sum -- "$artifact" | awk '{ print $1 }')
    if [ "$actual" != "$expected" ]; then
      printf >&2 'Checksum verification failed: %s\n' "$artifact"
      exit 1
    fi
    printf 'Checksum verified: %s\n' "$artifact"
  fi
}

require_runtime_tools() {
  require_command docker
  require_command date
  require_command awk
  require_command grep
  require_command mktemp
  require_command sha256sum
  if ! docker compose version >/dev/null 2>&1; then
    printf >&2 'Docker Compose is installed but unavailable in this shell.\n'
    exit 1
  fi
}
