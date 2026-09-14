# Deployment runbook

This runbook targets one Linux host running Docker Engine and Docker Compose.
Caddy is the only public service. PostgreSQL and private files remain inside
Docker networks/volumes; no external SaaS is required.

## Host prerequisites

- Supported 64-bit Linux host with current security patches
- Docker Engine 28+ and Compose 2.40+ (or newer validated patch releases)
- DNS A/AAAA records for the canonical domain and optional `www` alias
- Inbound TCP 80/443 and UDP 443; no public PostgreSQL port
- Enough encrypted disk for the database, files, two releases, and multiple
  backup generations
- Off-host encrypted backup destination and a restore-test schedule
- Time synchronization and a log retention/alerting plan

## Prepare production configuration

Copy `docs/examples/production.env.example` to a secret deployment location
named `.env.production`, fill every `CHANGE_ME` value, set permissions to 0600,
and never commit it. Generate the auth secret with a cryptographically secure
tool such as `openssl rand -base64 48`.

Important: `NEXT_PUBLIC_APP_URL` is both a build argument and runtime value.
Changing it requires rebuilding the app image.

Validate interpolation without printing the rendered environment into shared
logs:

```sh
docker compose --env-file .env.production config --quiet
```

## First deployment

From a reviewed immutable release checkout:

```sh
docker compose --env-file .env.production build --pull
docker compose --env-file .env.production up -d postgres storage-init clamav
docker compose --env-file .env.production run --rm migrate
docker compose --env-file .env.production up -d app caddy
docker compose --env-file .env.production ps
```

The Compose dependency graph also runs the migration service before `app`; the
explicit first-deployment sequence makes the gate observable. Configure
`CADDYFILE_PATH=./Caddyfile.prod` for public automatic HTTPS. The development
`Caddyfile` serves plain HTTP and is not a production TLS configuration.

Do not seed demonstration business records. If administrator bootstrap is
needed, use the reviewed one-time seed procedure and remove its credentials
immediately afterward.

## Release deployment

1. Pass the environment and security checklists.
2. Create and copy off-host a complete pre-deploy backup set.
3. Pull the reviewed commit/tag and inspect dependency/container changes.
4. Build images and run automated tests before altering the running services.
5. Run backward-compatible database migrations.
6. Start the app, wait for healthy status, then let Caddy route traffic.
7. Perform the smoke tests below and observe error/latency logs.
8. Record commit, image digests, migration names, operator, and timestamps.

Example commands:

```sh
sh scripts/backup/all.sh
docker compose --env-file .env.production build --pull
docker compose --env-file .env.production up -d
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --since 10m app caddy postgres clamav
```

## Smoke tests

- Canonical HTTPS domain and `www` redirect
- Persian home plus representative Persian detail/form page
- English home plus representative English detail/form page
- 404 page, sitemap, robots, favicon, and share metadata
- Login failure and success without account enumeration
- Customer cannot reach `/admin`; one customer cannot read another customer's
  project, file, invoice, or ticket
- Authorized upload and download; unauthenticated and cross-tenant denial
- Clean upload reaches `READY`; EICAR is rejected; scanner outage fails closed
- Lead/contact submission, duplicate/rate-limit behavior, and audit entry
- Database-backed CMS/redirect behavior if included in the release
- Backup command after deploy

## Rollback

Application rollback means redeploying the last known-good immutable image. Do
not automatically reverse a database migration. Schema changes must be designed
for expand/migrate/contract releases so the previous app can run during rollback.

If data restoration is required, stop writes, follow
[backup-restore.md](backup-restore.md), capture the failed state first, and obtain
explicit owner authorization. A database restore and private-storage restore
must use artifacts from the same logical backup set.

## Observability and maintenance

- Caddy emits JSON access logs to stdout. The app must emit structured,
  redacted logs with request correlation, not secret-bearing payloads.
- Alert on unhealthy containers, repeated restarts, disk pressure, backup
  failure/staleness, certificate renewal, elevated 5xx, and authentication abuse.
- Apply OS and container security patches on a defined cadence. Rebuild images;
  do not mutate running containers manually.
- Review PostgreSQL vacuum/analyze health, connection use, slow queries, and
  storage growth.
- Test full restore in an isolated environment at least quarterly and after
  material schema/storage changes.
