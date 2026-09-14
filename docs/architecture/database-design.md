# Database design

## Decision and scope

RYCODE uses a new PostgreSQL database as the source of truth. The Lovable/Supabase project is a design and product reference only: no production users, sessions, files, analytics, or business records are migrated. The initial migration must create an empty schema, then `prisma/seed.ts` installs system permissions and roles and may create the first administrator.

The application connects through Prisma's PostgreSQL driver adapter. Only server components, server actions, route handlers, jobs, and domain services may import `src/db/client.ts`; browser code never receives a database connection or privileged credential.

## Naming and storage conventions

- Prisma models and fields use TypeScript-friendly names; `@@map` and `@map` keep PostgreSQL tables and columns in `snake_case`.
- Better Auth owns the `User`, `Account`, `Session`, and `Verification` records. Their primary keys remain strings because Better Auth generates them. Application-domain records use UUID primary keys; append-only analytics and audit records use `bigint` identity keys.
- All timestamps that describe an instant use `timestamptz(3)`. Calendar-only values use `date`.
- Money is stored in integer minor units (`bigint`) plus a three-letter uppercase currency code. Floating point is never used for money. Quantities and analytics values use explicit `decimal` precision.
- Email addresses are trimmed and lowercased before persistence. URL paths are canonicalized before uniqueness checks.
- Structured editor documents and extensible metadata use `jsonb`. Values that must be filtered, joined, authorized, or constrained remain first-class columns.
- File bytes never live in PostgreSQL. `files.storage_provider`, `bucket`, and `object_key` address an object in private local or S3-compatible storage; the database stores metadata, quarantine/scan state, and explicit joins to authorized records.

## Aggregate boundaries

| Aggregate           | Tables                                                                                                                 | Important boundary                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Identity and access | `users`, `accounts`, `sessions`, `verifications`, `profiles`, `roles`, `permissions`, `user_roles`, `role_permissions` | Better Auth authenticates; the RYCODE service layer authorizes.                                          |
| Clients             | `clients`, `client_members`                                                                                            | A membership is the source of client-level ownership, billing, and support scope.                        |
| Leads               | `leads`, `lead_activities`, `lead_files`                                                                               | Status changes append an activity in the same transaction. A lead converts to at most one project.       |
| Projects            | `projects`, `project_members`, `milestones`, `milestone_approvals`, `project_activities`, `project_files`              | Project membership and client membership are evaluated together. Approval rows are immutable evidence.   |
| Files               | `files` and domain join tables                                                                                         | Objects remain private and quarantined until scanning succeeds. A join grants context, not a public URL. |
| Support             | `tickets`, `ticket_messages`, `ticket_message_files`                                                                   | Internal messages are never returned to client members.                                                  |
| Finance             | `invoices`, `invoice_items`, `installments`, `payments`, `payment_allocations`, `invoice_files`, `payment_receipts`    | Issued finance records are corrected through explicit state changes, not destructive edits.              |
| Notifications       | `notifications`                                                                                                        | Each record belongs to one recipient; read state is per user.                                            |
| CMS                 | `content_items`, translation and subtype tables, taxonomies, authors, relations, FAQs, media, redirects, settings      | A shared content identity owns route state; locale-specific copy is separate.                            |
| Analytics           | `analytics_sessions`, `analytics_events`                                                                               | First-party, consent-aware events store hashes rather than raw IP or stable browser identifiers.         |
| Audit               | `audit_logs`                                                                                                           | Append-only record of security-sensitive and business-critical mutations.                                |

## Domain decisions

### Identity and tenancy

Global roles answer what a user may do. `client_members` and `project_members` answer where they may do it. A permission never grants every row by itself: domain services combine permission checks with membership, assignment, ownership, record state, and field-level rules.

A user may belong to several clients and projects. `client_members.role` expresses customer-side responsibility; `project_members.role` expresses project responsibility and approval authority. Staff roles do not manufacture client membership and customer membership does not manufacture staff permissions.

### Leads and conversion

Public forms create only a validated lead envelope. Arbitrary browser JSON is not persisted without an allowlist, and public requests cannot set status, owner, client, or audit fields. `projects.origin_lead_id` is unique, so conversion is idempotent. Conversion creates the client/project/memberships and the `CONVERTED` activity atomically.

### Projects and approvals

Milestone ordering is unique within a project. Approval records are append-only; the latest valid decision drives the milestone transition. A client approver must be both an active client member and a project member with `CLIENT_APPROVER`, unless a staff permission explicitly authorizes the action.

Progress is cached for display but remains constrained to 0–100. Services update cached progress together with milestone changes and append a project activity in the same transaction.

### Private files

An upload follows `UPLOADING -> QUARANTINED -> READY`; infected or invalid objects become `REJECTED`. Download authorization walks an explicit join such as `project_files`, `ticket_message_files`, or `invoice_files`, then rechecks the caller's access to the parent record. `files.object_key` is never accepted from a client and is never used as a public URL.

CMS media also references a private file. A public media route may stream a `READY` asset only when it is connected to published content (or another explicit public publication record). Original objects stay private; signed URLs are short-lived and scoped to one object.

Logical deletion marks `files.deleted_at` and schedules object deletion after the retention window. A row must not be physically deleted while a restrictive join still references it.

### Finance

Invoices and payments are separate aggregates connected by allocations. This supports partial payments, one payment across invoices, and installment-level allocation. Services serialize allocation changes and enforce all cross-row invariants:

- allocation currency equals both payment and invoice currency;
- an allocation's installment belongs to the same invoice;
- successful allocations do not exceed the payment amount, invoice balance, or installment balance;
- invoice/installment status is recomputed from successful allocations;
- an issued invoice's item and amount snapshot is not silently rewritten;
- provider callbacks are idempotent through `idempotency_key` and/or `provider_reference`.

Money-changing transactions append an audit record before commit. Financial deletion is disabled; use `VOID` or `REFUNDED` transitions with a reason in audit metadata.

### CMS and localization

`content_items` contains route, publication, and lifecycle data shared by all locales. `content_translations` contains localized copy and SEO metadata. Exactly one subtype row should match `content_items.kind` (`articles`, `services`, `solutions`, `problems`, `industries`, `integrations`, or `case_studies`). This invariant is enforced by the content service in the same transaction as creation or kind changes.

Relations are directional and typed, allowing solutions-to-problems, services-to-integrations, industry targeting, and related-content lists without hard-coded arrays. Categories, tags, authors, and FAQs use explicit join tables. FAQs can be attached either to a content item or a canonical route.

Only published/scheduled content with an approved translation is visible publicly. Publication checks required locale, slug collision, canonical/redirect loops, referenced media readiness, and SEO requirements.

`site_settings.visibility = SECRET` is for secret references or encrypted envelopes, not plaintext application secrets. Deployment secrets remain environment/runtime secrets.

### Analytics and audit

Analytics collection is first-party and consent-aware. A server-issued random identifier is HMAC-hashed into `session_key_hash`; IP and user-agent values, if needed for abuse prevention, are separately salted hashes with short retention. No raw IP, fingerprint, access token, password, message body, or file URL belongs in analytics metadata.

Audit records are append-only and written by domain services for authentication administration, role/membership changes, lead conversion, project approval, file access policy changes, finance transitions, CMS publication, redirects, and private setting updates. Sensitive payload fields are redacted before `before_data`, `after_data`, or `metadata` is stored.

## Constraints and indexes

The Prisma schema declares foreign keys, required fields, enums, composite primary keys, uniqueness, and query indexes. PostgreSQL `CHECK`, partial, expression, and cross-row constraints are not fully represented by Prisma Schema Language. Generate the initial migration with `--create-only`, then add the following database-native rules to that migration before applying it.

```sql
ALTER TABLE projects
  ADD CONSTRAINT projects_progress_check CHECK (progress BETWEEN 0 AND 100),
  ADD CONSTRAINT projects_date_order_check
    CHECK (expected_end_date IS NULL OR start_date IS NULL OR expected_end_date >= start_date);

ALTER TABLE milestones
  ADD CONSTRAINT milestones_progress_check CHECK (progress BETWEEN 0 AND 100),
  ADD CONSTRAINT milestones_position_check CHECK (position >= 0),
  ADD CONSTRAINT milestones_date_order_check
    CHECK (expected_end_date IS NULL OR start_date IS NULL OR expected_end_date >= start_date);

ALTER TABLE files
  ADD CONSTRAINT files_size_check CHECK (size_bytes >= 0),
  ADD CONSTRAINT files_sha256_check
    CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$');

ALTER TABLE invoices
  ADD CONSTRAINT invoices_amounts_check CHECK (
    subtotal_amount >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0
    AND total_amount = subtotal_amount - discount_amount + tax_amount
  ),
  ADD CONSTRAINT invoices_currency_check CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE invoice_items
  ADD CONSTRAINT invoice_items_values_check CHECK (
    quantity > 0 AND unit_amount >= 0 AND total_amount >= 0 AND position >= 0
  );

ALTER TABLE installments
  ADD CONSTRAINT installments_values_check CHECK (amount > 0 AND position >= 0);

ALTER TABLE payments
  ADD CONSTRAINT payments_amount_check CHECK (amount > 0),
  ADD CONSTRAINT payments_currency_check CHECK (currency ~ '^[A-Z]{3}$');

ALTER TABLE payment_allocations
  ADD CONSTRAINT payment_allocations_amount_check CHECK (amount > 0);

ALTER TABLE services
  ADD CONSTRAINT services_price_check CHECK (starting_price_amount IS NULL OR starting_price_amount >= 0),
  ADD CONSTRAINT services_currency_check CHECK (currency IS NULL OR currency ~ '^[A-Z]{3}$');

ALTER TABLE articles
  ADD CONSTRAINT articles_reading_minutes_check CHECK (reading_minutes IS NULL OR reading_minutes > 0);

ALTER TABLE media
  ADD CONSTRAINT media_focal_x_check CHECK (focal_point_x IS NULL OR focal_point_x BETWEEN 0 AND 1),
  ADD CONSTRAINT media_focal_y_check CHECK (focal_point_y IS NULL OR focal_point_y BETWEEN 0 AND 1);

ALTER TABLE redirects
  ADD CONSTRAINT redirects_status_check CHECK (status_code IN (301, 302, 307, 308)),
  ADD CONSTRAINT redirects_source_check CHECK (source_path LIKE '/%');

ALTER TABLE analytics_events
  ADD CONSTRAINT analytics_custom_name_check CHECK (
    name <> 'custom' OR length(trim(custom_name)) > 0
  );

CREATE UNIQUE INDEX users_email_normalized_uq ON users (lower(email));
CREATE UNIQUE INDEX client_members_one_primary_uq
  ON client_members (client_id) WHERE is_primary;
CREATE UNIQUE INDEX payment_allocations_invoice_level_uq
  ON payment_allocations (payment_id, invoice_id) WHERE installment_id IS NULL;
```

Keep these statements in version-controlled migration SQL. Do not apply them manually to only one environment. Cross-row finance rules and content subtype matching still belong in serializable service transactions; optional database triggers can later provide defense in depth.

## Transaction and concurrency rules

- Lead conversion, role assignment, project/milestone transitions, payment allocation, content publication, and file state transitions run in transactions.
- Payment allocation uses `Serializable` isolation or explicit row locks with bounded retry on serialization failure.
- Public lead and analytics ingestion use idempotency/rate-limit keys before insert.
- Outbound notifications, email, object deletion, and analytics exports use an outbox/job boundary; they do not hold a database transaction open during network I/O.
- UI counters and statuses are derived in the same transaction as their source records or rebuilt by an idempotent reconciliation job.

## Migration and bootstrap workflow

1. Provision an empty PostgreSQL database and a least-privileged application role.
2. Set `DATABASE_URL`; never point it at the legacy Supabase database.
3. Run `pnpm db:generate`.
4. Run `pnpm exec prisma migrate dev --create-only --name init`.
5. Add and review the database-native SQL above in the generated migration.
6. Apply the migration in development, run `pnpm db:seed`, and exercise authorization integration tests.
7. Promote the exact migration with `pnpm db:migrate:deploy` in later environments.

The seed is deterministic for system roles and permissions. If both bootstrap admin variables are present, it creates a Better Auth credential account using Better Auth's password hasher and grants `super_admin`; it never replaces an existing credential hash. Remove those variables from the runtime environment immediately after bootstrap. Subsequent administrators should be created through the authenticated administration flow.

No Supabase export/import, password-hash transfer, session preservation, storage copy, row-count reconciliation, or legacy RLS compatibility work is part of this plan.
