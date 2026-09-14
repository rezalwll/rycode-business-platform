# Environment checklist

## Workstation / CI

- [ ] `node --version` is the exact approved Node 24.20.0 runtime.
- [ ] `pnpm --version` is 11.19.0.
- [ ] Install uses the committed `pnpm-lock.yaml` with `--frozen-lockfile`.
- [ ] Git hooks/CI do not print environment variables or generated secrets.
- [ ] `.env`, `.env.production`, private storage, backups, reports, and logs are
      ignored and absent from the Git index/history of the new stack.
- [ ] Legacy tracked `.env` has been untracked; any non-public value previously
      committed was rotated.

## Production host

- [ ] Host OS and Docker are supported and patched.
- [ ] Clock synchronization is healthy.
- [ ] Firewall exposes only required SSH and HTTP(S); PostgreSQL is not public.
- [ ] DNS is correct before requesting certificates.
- [ ] Data and backup filesystems are encrypted and have monitored free space.
- [ ] `.env.production` is outside source control, owned by the deployment user,
      and mode 0600.
- [ ] Database password and Better Auth secret are independent, random,
      environment-unique, and stored in an approved secret manager/location.
- [ ] `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` use the exact canonical HTTPS
      origin with no trailing slash.
- [ ] `RYCODE_DOMAIN` is the canonical hostname and `CADDYFILE_PATH` selects
      `./Caddyfile.prod`.
- [ ] Bootstrap administrator variables are absent except during the single
      reviewed seed run.
- [ ] Email delivery variables are configured if recovery/notification email is
      part of the release; otherwise those UI actions are not advertised.

## Data lifecycle

- [ ] Production begins with an empty, migrated database—no Supabase import.
- [ ] Private storage root is writable by UID/GID 1001 and not web-addressable.
- [ ] Analytics consent and retention values match the approved privacy notice.
- [ ] Log, audit, database, file, and backup retention owners are named.
- [ ] Off-host backup credentials cannot alter production data.
