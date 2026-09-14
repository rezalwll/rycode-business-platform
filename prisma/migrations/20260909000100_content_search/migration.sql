-- PostgreSQL-native public CMS search. The extension and indexes are safe on an empty database
-- and avoid loading the complete content corpus into the application process.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "content_translations_search_trgm_idx"
ON "content_translations"
USING GIN (("title" || ' ' || COALESCE("summary", '') || ' ' || COALESCE("body_text", '')) gin_trgm_ops);

CREATE INDEX "content_translations_search_fts_idx"
ON "content_translations"
USING GIN (to_tsvector('simple', "title" || ' ' || COALESCE("summary", '') || ' ' || COALESCE("body_text", '')));
