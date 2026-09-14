# Technology baseline

Verified baseline date: **2026-09-09**. Versions are exact-pinned in the
manifest and container definitions.

| Layer                  | Pinned version | Role                                  |
| ---------------------- | -------------: | ------------------------------------- |
| Node.js                |        24.20.0 | Production and CI runtime             |
| pnpm                   |        11.19.0 | Frozen dependency installation        |
| Next.js                |         16.3.4 | App Router and standalone server      |
| React / React DOM      |         19.2.8 | Server and client UI                  |
| TypeScript             |          6.0.3 | Strict static checking                |
| Tailwind CSS           |          4.3.3 | Design system styling                 |
| Prisma / Prisma Client |          7.8.0 | Schema, migrations, PostgreSQL access |
| PostgreSQL             |           18.6 | Source-of-truth database              |
| Better Auth            |          1.7.3 | Email/password auth and sessions      |
| Nodemailer             |         10.0.1 | SMTP delivery                         |
| Vitest                 |         4.1.11 | Unit and integration tests            |
| Playwright             |         1.63.0 | Browser acceptance tests              |
| ClamAV                 |          1.5.4 | Quarantined upload scanning           |
| Caddy                  |         2.11.4 | TLS and reverse proxy                 |

Locale routing is implemented directly in the Next.js proxy/navigation layer;
`next-intl` is intentionally not part of the runtime. PostgreSQL 18 volumes are
mounted at `/var/lib/postgresql`, matching the official image layout.

Upgrade one layer at a time, keep exact versions, and repeat the complete
validation and restore matrix. Tagged releases must additionally record image
digests for the deployment CPU architecture.
