# Legacy reference audit

There is no production data to migrate. The Lovable/Supabase implementation is
a visual, route, product-behavior, and domain-model reference only. The approved
appearance, bilingual content strategy, route families, lead forms, customer
workspace, operations dashboard, finance, support, and CMS concepts are kept.

Supabase data, Auth users and hashes, sessions, analytics history, Storage
objects, RLS compatibility, and demo business rows are intentionally not
migrated. The replacement uses a clean PostgreSQL schema and server-side
authorization. The `lovable-final-ui` Git tag preserves the reference snapshot;
legacy runtime files stay available until owner parity review and are excluded
from the new runtime.

The detailed initial inventory remains in [../legacy-audit.md](../legacy-audit.md).
