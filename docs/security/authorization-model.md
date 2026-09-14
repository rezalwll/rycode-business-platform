# Authorization model

## Security boundary

RYCODE uses Better Auth for identity proof and session lifecycle, then applies application authorization in server-side policy/domain services. Prisma and the PostgreSQL application credential are server-only. Client components may request an operation, but they never decide the actor, role, owner, client, project, price, status transition, object key, publication state, or audit fields.

Every protected operation follows the same order:

1. Read and validate the Better Auth session on the server.
2. Load the user, global permissions, and required client/project membership in one trusted query path.
3. Normalize and validate input with an operation-specific schema.
4. Authorize the action against permission, scope, record state, and field-level rules.
5. Perform the mutation and append the required audit/activity records in one transaction.
6. Return a purpose-built DTO that omits internal and secret fields.

The default is deny. Missing roles, missing memberships, disabled clients, archived records, ambiguous ownership, and unknown enum values deny access.

## Roles and permissions

Roles are bundles of permissions, not shortcuts embedded throughout UI code. `prisma/seed.ts` installs five system roles:

| Role          | Intended scope                                                                                       | Explicit exclusions                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `customer`    | Own client/project memberships, visible files, own finance and tickets, assigned milestone approvals | No staff data, internal notes/messages, role or CMS administration                       |
| `support`     | Client/project context, files, ticket assignment and replies                                         | No finance writes, CMS publishing, roles, settings, or unrestricted audit                |
| `editor`      | CMS drafts/review and CMS media                                                                      | No publishing, business administration, roles, or secrets                                |
| `admin`       | Leads, clients, projects, support, finance, publishing, users, analytics, audit                      | No role-permission or private/secret setting administration                              |
| `super_admin` | All seeded permissions                                                                               | Still subject to authentication, transition validation, audit, and last-admin safeguards |

The UI may hide unauthorized controls for usability, but every server action and route handler repeats the policy check. A role name alone is never accepted from request input.

### Scope evaluation

Global permissions answer whether the operation type is available. A scope predicate then restricts rows:

- **Own lead:** `submitted_by_id = session.user.id`, or the lead's `client_id` is an active client membership when the product intentionally exposes it.
- **Client record:** an active `client_members` row exists, or the actor has the corresponding staff permission.
- **Project record:** an active project membership exists, the project's client membership permits it, or the actor has the corresponding staff permission. Customer finance access additionally requires `project_members.can_view_finance` where project-level finance is being shown.
- **Ticket:** customer actors must belong to `tickets.client_id`; if linked to a project, they must also be allowed to view that project. `INTERNAL` messages require staff ticket permission.
- **File:** access is derived from an explicit domain join and its visibility plus access to the parent. Knowing a file UUID or object key grants nothing.
- **Notification:** `notifications.user_id` must equal the session user unless a privileged service is creating a notification for another user.
- **Analytics/audit:** staff permissions are mandatory; these tables have no customer ownership path.

List queries include the scope predicate in the database query. They do not fetch all rows and filter them in memory. Detail/update/delete paths authorize a uniquely loaded row and return the same not-found response for absent and inaccessible identifiers where disclosure would be harmful.

## High-risk operation rules

### Identity, roles, and memberships

- User creation, password reset, email verification, account linking, session revocation, and credential hashing go through Better Auth APIs or supported primitives.
- Only `roles.manage` may assign global roles. Role changes are audited with actor, target, previous roles, new roles, and request ID.
- The service prevents removing or disabling the last active `super_admin`, including self-demotion.
- `clients.manage` manages client membership; `projects.manage` manages project membership. Each validates that referenced users exist and that customer roles are compatible with the target client/project.
- A changed password, revoked account, suspension, or privilege reduction revokes relevant sessions.

### Leads and public forms

The public lead endpoint is intentionally unauthenticated but narrowly capable. It accepts only public contact fields, validates size and format, attaches server-derived source metadata, and always creates `status = NEW` with no owner/client. Apply per-IP and per-identity rate limits, CSRF/origin controls appropriate to the submission channel, honeypot or challenge escalation, duplicate suppression, and payload/body-size limits. Never expose a generic table insert endpoint.

Only `leads.manage` can assign, change status, archive, or convert a lead. Conversion is idempotent and transactional.

### Milestone approvals

An approval requires one of:

- an active `CLIENT_APPROVER` project membership plus client membership; or
- staff `milestones.approve` within staff scope.

The milestone must require approval and be in `AWAITING_APPROVAL` or `CHANGES_REQUESTED`. The client cannot modify deliverables or fabricate actor/timestamp fields. The approval row and resulting milestone/project activity are committed together.

### Tickets and messages

Customers may create tickets only for a client they belong to and may reference only a visible project. They can read `PUBLIC` messages and add public replies while the ticket state allows it. Only staff with `tickets.manage` can assign tickets, write `INTERNAL` messages, or resolve/close outside the customer transition set. DTOs for customer routes never select internal message bodies.

### Finance

Customers with scoped read access receive immutable invoice/payment views and approved documents only. `finance.manage` is required to issue/void invoices, record/refund payments, or change allocations. Provider callbacks authenticate with a dedicated signature secret and use an idempotency key; they do not run under a browser session.

All amount, currency, balance, installment-parent, and legal state-transition checks run inside the allocation transaction. Client-supplied totals are recomputed from validated line items. Financial records are not hard-deleted.

### CMS, redirects, and settings

`cms.manage` edits drafts and translations; `cms.publish` is separately required for scheduling, publishing, archiving, redirects, and public media exposure. Publishing validates locale readiness, route uniqueness, relation integrity, media scan status, and redirect loops.

`settings.manage` is intentionally reserved for `super_admin` by the seeded policy. `SECRET` setting values are never returned to browser code, logs, analytics, audit snapshots, or client DTOs. Prefer environment/runtime secrets over database storage.

## File authorization and delivery

Uploads are two-phase:

1. The server authorizes the target record, chooses a random object key, constrains MIME type/size, and creates an `UPLOADING` record.
2. The completed object is quarantined and scanned. Only `READY` files can be downloaded or published.

The storage bucket denies anonymous listing and reads. Download routes authorize the session and parent record before streaming or issuing a short-lived, single-object signed URL. Responses use safe content-disposition names, `nosniff`, a conservative content type, and cache controls appropriate to sensitivity. Inline rendering is allowlisted; HTML/SVG and other active content default to attachment or sanitization. Range requests and thumbnails enforce the same authorization.

Deleting a link does not immediately delete shared bytes. A retention job deletes only unreferenced, logically deleted objects and records the outcome. Antivirus failure is fail-closed.

## Session and request protections

- Use secure, HTTP-only, same-site cookies in production and allow only configured trusted origins.
- Rotate secrets outside source control; use separate database roles for application, migration, backup, and read-only operations.
- Apply CSRF protection to cookie-authenticated mutations, validate `Origin`/`Host`, and do not enable permissive CORS.
- Rate-limit sign-in, password reset, verification, lead submission, analytics ingestion, uploads, ticket creation, and payment callbacks independently.
- Enforce request-body and upload limits before expensive parsing or storage.
- Use opaque public errors and structured internal logs. Never log passwords, session tokens, OAuth tokens, signed file URLs, payment payload secrets, or raw private content.
- Treat Server Actions as public endpoints: authenticate, authorize, and validate inside every action.

## Audit requirements

At minimum, append an `audit_logs` record for:

- role, permission, client membership, and project membership changes;
- security/account administration and forced session revocation;
- lead assignment/conversion and project or milestone state transitions;
- private-file visibility, scan override, download-policy, and deletion changes;
- invoice issue/void, payment success/refund, and every allocation change;
- CMS publish/unpublish, redirect changes, and setting changes.

Audit writes share the business transaction wherever possible. Audit rows are append-only to the application role. A restricted retention/export job handles lifecycle requirements; ordinary administrators cannot update or delete history.

## Database and test defenses

The normal application database role receives CRUD only on required tables/sequences and no schema-owner, role-management, extension, or unrestricted database privileges. Migrations run with a separate credential. PostgreSQL is not reachable from the public internet, and backups are encrypted and restore-tested.

Authorization tests must include a deny matrix, not just happy paths:

- unauthenticated, expired, and revoked sessions;
- a user in another client/project;
- a customer guessing record and file identifiers;
- client members without finance or approver flags;
- support/editor privilege crossover;
- internal ticket-message leakage through list, detail, search, and attachment routes;
- self-demotion and removal of the last super administrator;
- concurrent payment callbacks and over-allocation attempts;
- quarantined, infected, deleted, and cross-tenant files;
- draft/unapproved locale and CMS media publication;
- mass-assignment attempts against owner, status, amount, role, and audit fields.

This server-side model replaces legacy Supabase RLS rather than reproducing it. Database RLS may be added later as defense in depth, but it cannot substitute for the service policies, transition validation, and field-level DTOs defined here.
