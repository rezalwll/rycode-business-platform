# Backup and restore

RYCODE has two durable business stores: PostgreSQL and private file storage.
Caddy data is operational state and may be backed up at the host/volume layer,
but it is not a substitute for the two application backups.

## Backup artifacts

`scripts/backup/all.sh` creates a timestamped directory under ignored
`backups/` containing:

```text
postgres.dump
postgres.dump.sha256
private-storage.tar.gz
private-storage.tar.gz.sha256
manifest.txt
manifest.txt.sha256
```

The database uses PostgreSQL's custom dump format without ownership/ACL entries.
Private storage is archived from the named volume. Files are written to a
temporary path, checked for non-zero size, then atomically renamed. SHA-256
checksums detect accidental corruption; they are not signatures.

Run from the repository root on the deployment host:

```sh
sh scripts/backup/all.sh
sh scripts/backup/all.sh /encrypted/mount/rycode/2026-09-07
```

PostgreSQL must be running. The storage archive can be captured while the app is
down. For a strict consistent recovery point across database rows and file
bytes, enter maintenance mode or stop write traffic for the duration of both
captures.

After each backup:

1. Verify all three checksum files.
2. Copy the set to encrypted off-host storage.
3. Enforce a documented retention policy (for example daily, weekly, monthly).
4. Alert on missing/stale/undersized artifacts.
5. Periodically restore into an isolated, non-production Compose project and
   perform application-level checks.

## PostgreSQL restore

Restore is destructive and requires the exact uppercase confirmation variable.
The script validates the custom archive, creates a fresh safety backup, stops a
running app, performs `pg_restore --clean --if-exists --exit-on-error`, and then
restarts the app if it was previously running.

```sh
CONFIRM_RESTORE=YES sh scripts/restore/postgres.sh \
  /absolute/path/to/backup/postgres.dump
```

Run pending forward migrations after restoring an older schema, then verify row
relationships and application behavior. A restore into a different Compose
project needs reviewed volume/project adaptations; the supplied scripts target
the explicit `rycode` Compose project.

## Private-storage restore

The script verifies a companion checksum when present, validates the archive,
rejects absolute/parent-traversal paths and link/device entries, captures a
safety archive, stops a running app, replaces the exact private volume contents,
and restores ownership to UID/GID 1001.

```sh
CONFIRM_RESTORE=YES sh scripts/restore/private-storage.sh \
  /absolute/path/to/backup/private-storage.tar.gz
```

Restore PostgreSQL and storage from the same directory. Then reconcile database
file records to storage keys and sample authorized/unauthorized downloads.

## Recovery drill acceptance

- Restore occurs on an isolated network with production secrets replaced.
- Checksums pass and archive provenance is known.
- The database server accepts the dump without ignored errors.
- Schema migrations reach the expected release.
- Required rows, memberships, invoices, tickets, and CMS records are sampled.
- Every database file reference either resolves to a byte object or is in a
  documented quarantine state; unexpected objects are reported.
- Authentication uses test accounts and production sessions remain invalid.
- Measured recovery time and recovery point meet the owner's objectives.
- The drill date, operator, artifact IDs, outcome, and remediation are recorded.

## Known limitations

- The scripts currently create logical backups, not PostgreSQL point-in-time
  recovery. Add WAL archiving only after defining RPO/RTO and testing recovery.
- Local SHA-256 files do not protect against a malicious party altering both the
  artifact and checksum; use signed manifests or immutable backup storage.
- The supplied scripts do not upload, rotate, encrypt, or delete backups. Those
  operations are environment-specific and must be implemented outside the repo
  with narrow credentials.
