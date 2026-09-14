# System architecture

## Decision

RYCODE is a clean engineering reimplementation. The legacy Lovable application
is retained temporarily as a visual and behavior reference. No production rows,
users, sessions, password hashes, objects, or analytics history are migrated
from Supabase.

```text
Browser
  -> Caddy (TLS, compression, request limit)
    -> Next.js 16
       - Server Components for reads
       - Server Actions for same-origin mutations
       - Route Handlers for protocol/file/event endpoints
         -> authentication + authorization policies
           -> domain services
             -> Prisma
               -> PostgreSQL 18
         -> private filesystem adapter
               -> encrypted host/volume storage
```

The browser never receives database credentials and never talks directly to
PostgreSQL. Authentication establishes identity; authorization is a separate,
mandatory decision at every protected read and mutation.

## Runtime boundaries

| Boundary                   | Responsibility                                                                             | Must not do                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Caddy                      | TLS, HTTP/2 and HTTP/3, compression, canonical host, coarse request-size limit, proxy logs | Contain application secrets or authorize business actions               |
| Next.js UI                 | Rendering, accessibility, progressive enhancement, localized interaction                   | Import Prisma into client components or trust client-provided ownership |
| Route/action layer         | Parse input, rate-limit, authenticate, invoke one use case, map known errors               | Encode business rules in JSX                                            |
| Domain/service layer       | Enforce invariants, permissions, state transitions, transactions, audit writes             | Depend on HTTP or browser state                                         |
| Prisma repository boundary | Parameterized persistence and transaction scope                                            | Return unrestricted tenant data                                         |
| PostgreSQL                 | Relational integrity, indexes, durable state                                               | Be reachable from the public network                                    |
| Private storage adapter    | Opaque object keys, atomic write/read/delete, metadata checks                              | Place customer files below `public/` or expose filesystem paths         |

## Route partitions

- Public, localized marketing and content: `/` or `/fa/...`, and `/en/...`.
- Authentication protocol endpoints: `/api/auth/...`.
- Customer workspace: localized `/dashboard/...`; requires a session plus
  membership in the requested client/project.
- Administration: localized `/admin/...`; requires explicit permission checks.
- File transfer and first-party telemetry: narrow route handlers with their own
  validation, authorization, and limits.

Public navigation must not wrap administration or customer workspace pages.
Persian uses RTL layout; English uses LTR. Locale is part of URLs and metadata,
not an untrusted authorization input.

## Request rules

1. Validate URL params and payloads with a shared schema at the boundary.
2. Resolve the authenticated actor on the server. Never accept `userId`, role,
   organization, or ownership from form data as proof.
3. Call a domain use case that filters by tenant/membership and checks the exact
   permission.
4. Perform related writes and audit records in one database transaction.
5. Return a minimal view model. Do not serialize Prisma records wholesale.
6. Redact secrets, tokens, file paths, and sensitive form fields from logs.

## Deployment topology

The provided Compose topology has an internet-facing `edge` network and an
internal `backend` network. Caddy can reach only the application. The application
bridges edge and backend. PostgreSQL is only on backend and has no published
port. Named volumes preserve PostgreSQL state, private files, and Caddy state.

## Failure and recovery

- A failed migration blocks the application service from starting.
- Health checks gate Caddy startup on an HTTP-ready application.
- Database and private-file backups form one logical backup set. There is not
  yet a cross-resource snapshot transaction, so write traffic should be paused
  for strict point-in-time consistency.
- Restore scripts create an additional safety backup and require the literal
  `CONFIRM_RESTORE=YES` guard before destructive work.

## Current evidence

The application, authentication, authorization services, protected file
handlers, first-party analytics, customer/admin workflows, and three migrations
are implemented. Prisma validation, lint, TypeScript, 104 unit tests, 5 live
PostgreSQL integration tests, and the production build pass. The complete
Compose topology has not been rehearsed because the workstation Docker daemon is
unavailable; this remains a target-host release gate. See
[progress.md](../reimplementation/progress.md).
