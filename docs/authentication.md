# Authentication and authorization

## Scope

Better Auth replaces Supabase Auth. There are no legacy users, sessions, password
hashes, or reset tokens to import. New accounts begin in the clean PostgreSQL
schema.

The authentication library proves who a request belongs to. RYCODE's server-side
policy layer decides what that actor may do. A valid session alone must never
grant access to arbitrary projects, files, invoices, tickets, CMS records, or
administration screens.

## Target authentication contract

- Email/password is the initial login mechanism.
- Session cookies are `HttpOnly`, `Secure` in production, same-site restricted,
  scoped to the canonical host, and rotated/revoked according to Better Auth's
  supported configuration.
- Login and reset endpoints are rate-limited without revealing whether an email
  exists.
- State-changing requests use same-origin checks and framework/library CSRF
  defenses.
- Session lookup occurs on the server. Client state is presentation only.
- Password requirements and bootstrap credentials are validated server-side.
- Security-sensitive account changes revoke other sessions and produce an
  audit event.

## Authorization model

Authorization is deny-by-default and uses two inputs:

1. global role permissions for administrative capabilities; and
2. client/project membership for tenant-scoped resources.

Examples of resource decisions:

| Operation         | Required decision                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------- |
| View project      | Active session and matching project/client membership, or explicit administrative permission |
| Download file     | Active session, visibility check, owning resource access, acceptable scan state              |
| Update milestone  | Assigned project role with the relevant permission                                           |
| Approve milestone | Customer member designated for that project; cannot approve an unrelated project             |
| Read invoice      | Matching client membership or finance permission                                             |
| Edit CMS          | Explicit content permission; publication is a separate capability                            |
| Manage roles      | Dedicated role-management permission; never inferred from navigation visibility              |

Do not spread string role comparisons across components. Route handlers and
server actions call central policy functions; repositories include tenant keys
in database filters. Sensitive mutations write an audit log in the same
transaction.

## Bootstrap

`BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` are optional seed-only
inputs. For a new environment:

1. Generate a unique high-entropy Better Auth secret.
2. Supply a one-time administrator email and strong generated password only to
   the seed process.
3. Run the reviewed seed command once.
4. Log in, change/rotate the password, and remove both bootstrap variables from
   the deployment environment.
5. Confirm the resulting role assignment in the database and audit log.

Never bake bootstrap credentials or the auth secret into an image, source file,
build argument, or client-visible `NEXT_PUBLIC_*` variable.

## Status and release evidence

The Better Auth and Prisma integration is implemented. On 2026-09-09 a live
PostgreSQL/HTTP rehearsal proved registration, automatic customer-role
assignment, denial before email verification, verified customer login,
bootstrap-administrator login, and the customer-to-admin redirect boundary.
Unit tests cover rate limiting and policy defaults. Production still requires a
real SMTP delivery test, cookie inspection over canonical HTTPS, and owner
acceptance; see the final engineering report.
