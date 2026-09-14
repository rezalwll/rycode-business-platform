# RYCODE

Clean reimplementation of the RYCODE website and business platform. The former
Lovable/Supabase project is retained only as a design, route, and product
reference: no production users or business data are migrated.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Prisma, PostgreSQL,
Better Auth, private local-object storage, ClamAV, Docker Compose, and Caddy.
Persian is the default RTL locale; English lives under `/en`.

## Local development

Requirements: Node 24.20.0, pnpm 11.19.0, and PostgreSQL 18.

```sh
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

The default development email mode logs verification and password-reset links
to the server terminal. Production refuses to start without SMTP and ClamAV.
Private uploads remain quarantined until ClamAV returns a clean verdict.

To create the first administrator on an empty database, set both
`BOOTSTRAP_ADMIN_EMAIL` and a strong `BOOTSTRAP_ADMIN_PASSWORD`, run
`pnpm db:seed` once, then remove those variables from the environment.

## Verification

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration   # only against a disposable DB ending in _validation
pnpm test:e2e
pnpm build
```

The `dev`, `typecheck`, `test`, and `build` scripts regenerate the ignored
Prisma Client automatically. Running `pnpm db:generate` explicitly after a
fresh install keeps database setup and editor types ready before the first
command.

Deployment and operational gates are documented in [docs](docs/README.md).
The current evidence and remaining release blockers are recorded in
[FINAL_ENGINEERING_REPORT.md](docs/FINAL_ENGINEERING_REPORT.md).
