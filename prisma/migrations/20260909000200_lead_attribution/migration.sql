ALTER TABLE "leads" ADD COLUMN "analytics_session_id" UUID;

CREATE INDEX "leads_analytics_session_id_idx" ON "leads"("analytics_session_id");

ALTER TABLE "leads"
ADD CONSTRAINT "leads_analytics_session_id_fkey"
FOREIGN KEY ("analytics_session_id") REFERENCES "analytics_sessions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
