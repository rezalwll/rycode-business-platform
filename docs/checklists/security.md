# Security release checklist

## Identity and sessions

- [ ] Better Auth secret is at least 32 random characters, server-only, and
      unique to the environment.
- [ ] Production cookies are Secure, HttpOnly, same-site restricted, and scoped
      to the canonical host/path.
- [ ] Login/reset responses resist email enumeration and are rate-limited.
- [ ] Password change/reset and account disable revoke appropriate sessions.
- [ ] Bootstrap credentials were removed and rotated after first use.

## Authorization / tenancy

- [ ] Every dashboard/admin loader, action, and route handler authenticates on
      the server.
- [ ] Central policies default deny and check the exact action/resource.
- [ ] Database reads and writes include client/project ownership constraints.
- [ ] Tests prove anonymous, wrong-role, and cross-client access is denied for
      projects, files, tickets, invoices, payments, and administration.
- [ ] Role management and publication have separate privileged permissions.
- [ ] Critical mutations write actor, action, target, and outcome to audit logs.

## Inputs, browser, and HTTP

- [ ] All params/forms/JSON are schema-validated; unknown keys are rejected or
      deliberately stripped.
- [ ] CSRF and same-origin defenses cover every cookie-authenticated mutation.
- [ ] Rate limits cover auth, lead/contact, search, upload, and analytics routes.
- [ ] CSP has no production `unsafe-eval`; inline policy is nonce/hash based or
      has a documented temporary exception.
- [ ] HSTS is enabled only on the production HTTPS host after certificate tests.
- [ ] Redirect targets cannot form open redirects.
- [ ] Errors and logs do not leak stack traces, SQL, tokens, PII, or file paths.

## Files

- [ ] Upload limits exist at Caddy and application layers.
- [ ] Extension, MIME, and magic signature are allow-listed; filenames are only
      display metadata.
- [ ] Object keys are random and path containment is enforced.
- [ ] Downloads repeat resource authorization and use private/no-sniff headers.
- [ ] Malware/quarantine policy and quota/cleanup behavior are tested.

## Data and supply chain

- [ ] PostgreSQL has no published host port and uses a unique password.
- [ ] Migrations are reviewed, reversible by forward repair, and tested on empty
      plus representative databases.
- [ ] Dependency and image scans have no unaccepted critical/high findings.
- [ ] Production images use pinned versions/digests, non-root runtime, read-only
      root filesystem, dropped capabilities, and no embedded secrets.
- [ ] Database and storage backups are encrypted off-host and a restore drill
      passed.
- [ ] The committed tree and built image were scanned for secrets.
