# Private file storage

File bytes never live under `public/`. The local adapter stores them below an
ignored private root or named Docker volume using random opaque keys. Metadata
and resource links live in PostgreSQL.

Uploads are authorized against the current active client/project/ticket or a
staff permission, limited to 20 MiB, checked against an explicit extension,
declared MIME, and magic-byte allowlist, and written with restrictive modes and
an atomic rename. Newly stored files are `QUARANTINED/PENDING` and cannot be
downloaded, including by staff.

An authorized operator starts a ClamAV `INSTREAM` scan. Only an explicit `OK`
verdict changes the record to `READY/CLEAN`; `FOUND` changes it to
`REJECTED/INFECTED`; timeout, protocol, and daemon errors change scan status to
`FAILED` while the object remains quarantined. Manual review can reject a file
but cannot mark it clean. Every verdict is audited.

Downloads resolve an opaque database id, re-check current active memberships
and resource visibility, verify stored size, and stream with a safe content
disposition, `nosniff`, and private no-store caching. Missing and unauthorized
objects share the same response. Revoked memberships do not retain access just
because that user uploaded the object.

Production Compose supplies ClamAV 1.5.4 on the internal backend network and
persists its signature database. The application refuses production startup
without `CLAMAV_HOST`.
