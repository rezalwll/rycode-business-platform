-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "client_kind" AS ENUM ('individual', 'organization');

-- CreateEnum
CREATE TYPE "client_member_role" AS ENUM ('owner', 'admin', 'member', 'billing', 'viewer');

-- CreateEnum
CREATE TYPE "lead_type" AS ENUM ('contact', 'consultation', 'quote', 'audit', 'support');

-- CreateEnum
CREATE TYPE "lead_status" AS ENUM ('new', 'qualified', 'contacted', 'proposal', 'won', 'lost', 'spam', 'archived');

-- CreateEnum
CREATE TYPE "lead_activity_type" AS ENUM ('created', 'status_changed', 'note_added', 'contact_attempt', 'assigned', 'converted', 'file_attached');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('draft', 'planned', 'active', 'on_hold', 'completed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "project_member_role" AS ENUM ('owner', 'manager', 'contributor', 'client_approver', 'client_viewer');

-- CreateEnum
CREATE TYPE "milestone_kind" AS ENUM ('discovery', 'design', 'development', 'review', 'delivery', 'custom');

-- CreateEnum
CREATE TYPE "milestone_status" AS ENUM ('pending', 'in_progress', 'awaiting_approval', 'changes_requested', 'approved', 'completed', 'blocked', 'cancelled');

-- CreateEnum
CREATE TYPE "milestone_approval_decision" AS ENUM ('approved', 'rejected', 'changes_requested');

-- CreateEnum
CREATE TYPE "activity_visibility" AS ENUM ('internal', 'client');

-- CreateEnum
CREATE TYPE "file_storage_provider" AS ENUM ('local', 's3');

-- CreateEnum
CREATE TYPE "file_category" AS ENUM ('general', 'lead_attachment', 'project_asset', 'ticket_attachment', 'invoice_document', 'payment_receipt', 'cms_media');

-- CreateEnum
CREATE TYPE "file_status" AS ENUM ('uploading', 'quarantined', 'ready', 'rejected', 'deleted');

-- CreateEnum
CREATE TYPE "file_scan_status" AS ENUM ('pending', 'clean', 'infected', 'failed');

-- CreateEnum
CREATE TYPE "file_visibility" AS ENUM ('internal', 'project_members', 'client_members');

-- CreateEnum
CREATE TYPE "ticket_status" AS ENUM ('open', 'waiting_on_staff', 'waiting_on_client', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "ticket_category" AS ENUM ('general', 'technical', 'billing', 'project');

-- CreateEnum
CREATE TYPE "ticket_priority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "ticket_message_visibility" AS ENUM ('public', 'internal');

-- CreateEnum
CREATE TYPE "invoice_status" AS ENUM ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'void');

-- CreateEnum
CREATE TYPE "installment_status" AS ENUM ('pending', 'partially_paid', 'paid', 'overdue', 'waived');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'void');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('bank_transfer', 'card', 'cash', 'cheque', 'gateway', 'other');

-- CreateEnum
CREATE TYPE "notification_kind" AS ENUM ('system', 'project', 'milestone', 'ticket', 'invoice', 'payment', 'content');

-- CreateEnum
CREATE TYPE "content_kind" AS ENUM ('article', 'service', 'solution', 'problem', 'industry', 'integration', 'case_study');

-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('draft', 'review', 'scheduled', 'published', 'archived');

-- CreateEnum
CREATE TYPE "translation_state" AS ENUM ('draft', 'reviewed', 'approved');

-- CreateEnum
CREATE TYPE "content_relation_kind" AS ENUM ('related', 'solves', 'uses', 'for_industry', 'case_study_of');

-- CreateEnum
CREATE TYPE "author_role" AS ENUM ('primary', 'coauthor', 'contributor', 'reviewer');

-- CreateEnum
CREATE TYPE "site_setting_visibility" AS ENUM ('public', 'private', 'secret');

-- CreateEnum
CREATE TYPE "consent_state" AS ENUM ('unknown', 'granted', 'denied');

-- CreateEnum
CREATE TYPE "analytics_event_name" AS ENUM ('page_view', 'cta_click', 'form_started', 'form_submitted', 'search', 'download', 'login', 'custom');

-- CreateEnum
CREATE TYPE "analytics_page_type" AS ENUM ('marketing', 'article', 'service', 'portal', 'admin', 'other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ(3),
    "refresh_token_expires_at" TIMESTAMPTZ(3),
    "scope" TEXT,
    "id_token" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "ip_address" VARCHAR(64),
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "display_name" VARCHAR(160),
    "phone" VARCHAR(32),
    "company" VARCHAR(200),
    "locale" VARCHAR(10) NOT NULL DEFAULT 'fa',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Tehran',
    "bio" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_by_id" TEXT,
    "assigned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "kind" "client_kind" NOT NULL DEFAULT 'organization',
    "display_name" VARCHAR(200) NOT NULL,
    "legal_name" VARCHAR(240),
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "tax_id" VARCHAR(64),
    "billing_address" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "archived_at" TIMESTAMPTZ(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_members" (
    "client_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "client_member_role" NOT NULL DEFAULT 'member',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "client_members_pkey" PRIMARY KEY ("client_id","user_id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "submitted_by_id" TEXT,
    "owner_id" TEXT,
    "type" "lead_type" NOT NULL DEFAULT 'contact',
    "status" "lead_status" NOT NULL DEFAULT 'new',
    "name" VARCHAR(160) NOT NULL,
    "company" VARCHAR(200),
    "email" VARCHAR(320),
    "phone" VARCHAR(32),
    "source" VARCHAR(120),
    "landing_path" TEXT,
    "service" VARCHAR(160),
    "problem" VARCHAR(160),
    "industry" VARCHAR(160),
    "budget" VARCHAR(120),
    "summary" TEXT,
    "form_payload" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "archived_at" TIMESTAMPTZ(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "actor_id" TEXT,
    "type" "lead_activity_type" NOT NULL,
    "from_status" "lead_status",
    "to_status" "lead_status",
    "note" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "origin_lead_id" UUID,
    "number" VARCHAR(48) NOT NULL,
    "slug" VARCHAR(180),
    "name" VARCHAR(220) NOT NULL,
    "scope" TEXT,
    "status" "project_status" NOT NULL DEFAULT 'draft',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "expected_end_date" DATE,
    "completed_at" TIMESTAMPTZ(3),
    "latest_update" TEXT,
    "client_action" TEXT,
    "internal_note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "archived_at" TIMESTAMPTZ(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "project_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "project_member_role" NOT NULL DEFAULT 'contributor',
    "can_view_finance" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "kind" "milestone_kind" NOT NULL DEFAULT 'custom',
    "title" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "status" "milestone_status" NOT NULL DEFAULT 'pending',
    "position" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "expected_end_date" DATE,
    "completed_at" TIMESTAMPTZ(3),
    "deliverables" JSONB,
    "approval_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_approvals" (
    "id" UUID NOT NULL,
    "milestone_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "decision" "milestone_approval_decision" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_activities" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "actor_id" TEXT,
    "type" VARCHAR(80) NOT NULL,
    "description" TEXT NOT NULL,
    "visibility" "activity_visibility" NOT NULL DEFAULT 'client',
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "storage_provider" "file_storage_provider" NOT NULL DEFAULT 'local',
    "bucket" VARCHAR(100) NOT NULL DEFAULT 'private',
    "object_key" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "checksum_sha256" CHAR(64),
    "category" "file_category" NOT NULL DEFAULT 'general',
    "status" "file_status" NOT NULL DEFAULT 'uploading',
    "scan_status" "file_scan_status" NOT NULL DEFAULT 'pending',
    "uploaded_by_id" TEXT,
    "ready_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_files" (
    "project_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "visibility" "file_visibility" NOT NULL DEFAULT 'project_members',
    "label" VARCHAR(200),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_files_pkey" PRIMARY KEY ("project_id","file_id")
);

-- CreateTable
CREATE TABLE "lead_files" (
    "lead_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "visibility" "file_visibility" NOT NULL DEFAULT 'internal',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_files_pkey" PRIMARY KEY ("lead_id","file_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "project_id" UUID,
    "opened_by_id" TEXT NOT NULL,
    "assigned_to_id" TEXT,
    "number" VARCHAR(48) NOT NULL,
    "subject" VARCHAR(240) NOT NULL,
    "category" "ticket_category" NOT NULL DEFAULT 'general',
    "priority" "ticket_priority" NOT NULL DEFAULT 'normal',
    "status" "ticket_status" NOT NULL DEFAULT 'open',
    "last_reply_at" TIMESTAMPTZ(3),
    "closed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "author_id" TEXT,
    "visibility" "ticket_message_visibility" NOT NULL DEFAULT 'public',
    "body" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMPTZ(3),

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_message_files" (
    "message_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_message_files_pkey" PRIMARY KEY ("message_id","file_id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "project_id" UUID,
    "number" VARCHAR(64) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "subtotal_amount" BIGINT NOT NULL DEFAULT 0,
    "discount_amount" BIGINT NOT NULL DEFAULT 0,
    "tax_amount" BIGINT NOT NULL DEFAULT 0,
    "total_amount" BIGINT NOT NULL,
    "status" "invoice_status" NOT NULL DEFAULT 'draft',
    "issued_at" TIMESTAMPTZ(3),
    "due_date" DATE,
    "voided_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unit_amount" BIGINT NOT NULL,
    "total_amount" BIGINT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "amount" BIGINT NOT NULL,
    "due_date" DATE,
    "status" "installment_status" NOT NULL DEFAULT 'pending',
    "position" INTEGER NOT NULL,
    "paid_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "recorded_by_id" TEXT,
    "status" "payment_status" NOT NULL DEFAULT 'pending',
    "method" "payment_method" NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "provider" VARCHAR(120),
    "provider_reference" VARCHAR(255),
    "idempotency_key" VARCHAR(180),
    "paid_at" TIMESTAMPTZ(3),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "installment_id" UUID,
    "amount" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_files" (
    "invoice_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "label" VARCHAR(200),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_files_pkey" PRIMARY KEY ("invoice_id","file_id")
);

-- CreateTable
CREATE TABLE "payment_receipts" (
    "payment_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_receipts_pkey" PRIMARY KEY ("payment_id","file_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" "notification_kind" NOT NULL DEFAULT 'system',
    "title" VARCHAR(220) NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "read_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" UUID NOT NULL,
    "kind" "content_kind" NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "scheduled_at" TIMESTAMPTZ(3),
    "published_at" TIMESTAMPTZ(3),
    "archived_at" TIMESTAMPTZ(3),
    "featured_media_id" UUID,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_translations" (
    "content_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "summary" TEXT,
    "body" JSONB,
    "body_text" TEXT,
    "state" "translation_state" NOT NULL DEFAULT 'draft',
    "seo_title" VARCHAR(240),
    "seo_description" TEXT,
    "canonical_url" TEXT,
    "og_title" VARCHAR(240),
    "og_description" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "content_translations_pkey" PRIMARY KEY ("content_id","locale")
);

-- CreateTable
CREATE TABLE "articles" (
    "content_id" UUID NOT NULL,
    "reading_minutes" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "source_url" TEXT,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "services" (
    "content_id" UUID NOT NULL,
    "service_code" VARCHAR(80),
    "starting_price_amount" BIGINT,
    "currency" VARCHAR(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "content_id" UUID NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "problems" (
    "content_id" UUID NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "industries" (
    "content_id" UUID NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "content_id" UUID NOT NULL,
    "vendor" VARCHAR(180),
    "documentation_url" TEXT,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "case_studies" (
    "content_id" UUID NOT NULL,
    "client_name" VARCHAR(200),
    "completed_at" DATE,
    "result_metrics" JSONB,

    CONSTRAINT "case_studies_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "category_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("category_id","locale")
);

-- CreateTable
CREATE TABLE "content_categories" (
    "content_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("content_id","category_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_translations" (
    "tag_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(180) NOT NULL,

    CONSTRAINT "tag_translations_pkey" PRIMARY KEY ("tag_id","locale")
);

-- CreateTable
CREATE TABLE "content_tags" (
    "content_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "content_tags_pkey" PRIMARY KEY ("content_id","tag_id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "user_id" TEXT,
    "slug" VARCHAR(160) NOT NULL,
    "avatar_media_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "author_translations" (
    "author_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "bio" TEXT,

    CONSTRAINT "author_translations_pkey" PRIMARY KEY ("author_id","locale")
);

-- CreateTable
CREATE TABLE "content_authors" (
    "content_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "role" "author_role" NOT NULL DEFAULT 'primary',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_authors_pkey" PRIMARY KEY ("content_id","author_id")
);

-- CreateTable
CREATE TABLE "content_relations" (
    "from_content_id" UUID NOT NULL,
    "to_content_id" UUID NOT NULL,
    "kind" "content_relation_kind" NOT NULL DEFAULT 'related',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_relations_pkey" PRIMARY KEY ("from_content_id","to_content_id","kind")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_translations" (
    "faq_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" JSONB NOT NULL,

    CONSTRAINT "faq_translations_pkey" PRIMARY KEY ("faq_id","locale")
);

-- CreateTable
CREATE TABLE "content_faqs" (
    "content_id" UUID NOT NULL,
    "faq_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_faqs_pkey" PRIMARY KEY ("content_id","faq_id")
);

-- CreateTable
CREATE TABLE "page_faqs" (
    "path" VARCHAR(500) NOT NULL,
    "faq_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "page_faqs_pkey" PRIMARY KEY ("path","faq_id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "key" VARCHAR(180) NOT NULL,
    "focal_point_x" DECIMAL(5,4),
    "focal_point_y" DECIMAL(5,4),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_translations" (
    "media_id" UUID NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "alt_text" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "media_translations_pkey" PRIMARY KEY ("media_id","locale")
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" UUID NOT NULL,
    "source_path" VARCHAR(500) NOT NULL,
    "destination" VARCHAR(1000) NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "preserve_query" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "key" VARCHAR(120) NOT NULL,
    "value" JSONB NOT NULL,
    "visibility" "site_setting_visibility" NOT NULL DEFAULT 'private',
    "updated_by_id" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "analytics_sessions" (
    "id" UUID NOT NULL,
    "user_id" TEXT,
    "session_key_hash" CHAR(64) NOT NULL,
    "anonymous_id_hash" CHAR(64) NOT NULL,
    "consent" "consent_state" NOT NULL DEFAULT 'unknown',
    "locale" VARCHAR(10),
    "landing_path" TEXT,
    "referrer" TEXT,
    "utm_source" VARCHAR(255),
    "utm_medium" VARCHAR(255),
    "utm_campaign" VARCHAR(255),
    "ip_hash" CHAR(64),
    "user_agent_hash" CHAR(64),
    "first_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" BIGSERIAL NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" TEXT,
    "name" "analytics_event_name" NOT NULL,
    "custom_name" VARCHAR(120),
    "path" TEXT,
    "page_type" "analytics_page_type",
    "entity_type" VARCHAR(80),
    "entity_id" VARCHAR(128),
    "label" VARCHAR(240),
    "value" DECIMAL(18,4),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_user_id" TEXT,
    "action" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" VARCHAR(128),
    "request_id" UUID,
    "before_data" JSONB,
    "after_data" JSONB,
    "metadata" JSONB,
    "ip_hash" CHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_id_account_id_key" ON "accounts"("provider_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "verifications_expires_at_idx" ON "verifications"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE INDEX "user_roles_assigned_by_id_idx" ON "user_roles"("assigned_by_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "clients_display_name_idx" ON "clients"("display_name");

-- CreateIndex
CREATE INDEX "clients_is_active_archived_at_idx" ON "clients"("is_active", "archived_at");

-- CreateIndex
CREATE INDEX "client_members_user_id_idx" ON "client_members"("user_id");

-- CreateIndex
CREATE INDEX "client_members_client_id_role_idx" ON "client_members"("client_id", "role");

-- CreateIndex
CREATE INDEX "leads_status_created_at_idx" ON "leads"("status", "created_at");

-- CreateIndex
CREATE INDEX "leads_type_created_at_idx" ON "leads"("type", "created_at");

-- CreateIndex
CREATE INDEX "leads_client_id_idx" ON "leads"("client_id");

-- CreateIndex
CREATE INDEX "leads_owner_id_status_idx" ON "leads"("owner_id", "status");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "lead_activities_lead_id_created_at_idx" ON "lead_activities"("lead_id", "created_at");

-- CreateIndex
CREATE INDEX "lead_activities_actor_id_created_at_idx" ON "lead_activities"("actor_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_origin_lead_id_key" ON "projects"("origin_lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_number_key" ON "projects"("number");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_client_id_status_idx" ON "projects"("client_id", "status");

-- CreateIndex
CREATE INDEX "projects_status_updated_at_idx" ON "projects"("status", "updated_at");

-- CreateIndex
CREATE INDEX "projects_archived_at_idx" ON "projects"("archived_at");

-- CreateIndex
CREATE INDEX "project_members_user_id_idx" ON "project_members"("user_id");

-- CreateIndex
CREATE INDEX "project_members_project_id_role_idx" ON "project_members"("project_id", "role");

-- CreateIndex
CREATE INDEX "milestones_project_id_status_idx" ON "milestones"("project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "milestones_project_id_position_key" ON "milestones"("project_id", "position");

-- CreateIndex
CREATE INDEX "milestone_approvals_milestone_id_created_at_idx" ON "milestone_approvals"("milestone_id", "created_at");

-- CreateIndex
CREATE INDEX "milestone_approvals_user_id_created_at_idx" ON "milestone_approvals"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "project_activities_project_id_visibility_created_at_idx" ON "project_activities"("project_id", "visibility", "created_at");

-- CreateIndex
CREATE INDEX "project_activities_actor_id_created_at_idx" ON "project_activities"("actor_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "files_object_key_key" ON "files"("object_key");

-- CreateIndex
CREATE INDEX "files_uploaded_by_id_created_at_idx" ON "files"("uploaded_by_id", "created_at");

-- CreateIndex
CREATE INDEX "files_status_scan_status_idx" ON "files"("status", "scan_status");

-- CreateIndex
CREATE INDEX "files_category_created_at_idx" ON "files"("category", "created_at");

-- CreateIndex
CREATE INDEX "project_files_file_id_idx" ON "project_files"("file_id");

-- CreateIndex
CREATE INDEX "project_files_project_id_visibility_idx" ON "project_files"("project_id", "visibility");

-- CreateIndex
CREATE INDEX "lead_files_file_id_idx" ON "lead_files"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_number_key" ON "tickets"("number");

-- CreateIndex
CREATE INDEX "tickets_client_id_status_updated_at_idx" ON "tickets"("client_id", "status", "updated_at");

-- CreateIndex
CREATE INDEX "tickets_project_id_status_idx" ON "tickets"("project_id", "status");

-- CreateIndex
CREATE INDEX "tickets_opened_by_id_created_at_idx" ON "tickets"("opened_by_id", "created_at");

-- CreateIndex
CREATE INDEX "tickets_assigned_to_id_status_idx" ON "tickets"("assigned_to_id", "status");

-- CreateIndex
CREATE INDEX "ticket_messages_ticket_id_created_at_idx" ON "ticket_messages"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "ticket_messages_author_id_created_at_idx" ON "ticket_messages"("author_id", "created_at");

-- CreateIndex
CREATE INDEX "ticket_message_files_file_id_idx" ON "ticket_message_files"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_number_key" ON "invoices"("number");

-- CreateIndex
CREATE INDEX "invoices_client_id_status_due_date_idx" ON "invoices"("client_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "invoices_project_id_status_idx" ON "invoices"("project_id", "status");

-- CreateIndex
CREATE INDEX "invoices_status_issued_at_idx" ON "invoices"("status", "issued_at");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_items_invoice_id_position_key" ON "invoice_items"("invoice_id", "position");

-- CreateIndex
CREATE INDEX "installments_status_due_date_idx" ON "installments"("status", "due_date");

-- CreateIndex
CREATE UNIQUE INDEX "installments_invoice_id_position_key" ON "installments"("invoice_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_reference_key" ON "payments"("provider_reference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");

-- CreateIndex
CREATE INDEX "payments_client_id_status_created_at_idx" ON "payments"("client_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "payments_recorded_by_id_created_at_idx" ON "payments"("recorded_by_id", "created_at");

-- CreateIndex
CREATE INDEX "payments_paid_at_idx" ON "payments"("paid_at");

-- CreateIndex
CREATE INDEX "payment_allocations_invoice_id_idx" ON "payment_allocations"("invoice_id");

-- CreateIndex
CREATE INDEX "payment_allocations_installment_id_idx" ON "payment_allocations"("installment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_allocations_payment_id_invoice_id_installment_id_key" ON "payment_allocations"("payment_id", "invoice_id", "installment_id");

-- CreateIndex
CREATE INDEX "invoice_files_file_id_idx" ON "invoice_files"("file_id");

-- CreateIndex
CREATE INDEX "payment_receipts_file_id_idx" ON "payment_receipts"("file_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_created_at_idx" ON "notifications"("user_id", "read_at", "created_at");

-- CreateIndex
CREATE INDEX "content_items_status_published_at_idx" ON "content_items"("status", "published_at");

-- CreateIndex
CREATE INDEX "content_items_kind_status_position_idx" ON "content_items"("kind", "status", "position");

-- CreateIndex
CREATE INDEX "content_items_featured_media_id_idx" ON "content_items"("featured_media_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_kind_slug_key" ON "content_items"("kind", "slug");

-- CreateIndex
CREATE INDEX "content_translations_locale_state_idx" ON "content_translations"("locale", "state");

-- CreateIndex
CREATE UNIQUE INDEX "services_service_code_key" ON "services"("service_code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "category_translations_locale_name_idx" ON "category_translations"("locale", "name");

-- CreateIndex
CREATE INDEX "content_categories_category_id_position_idx" ON "content_categories"("category_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tag_translations_locale_name_idx" ON "tag_translations"("locale", "name");

-- CreateIndex
CREATE INDEX "content_tags_tag_id_idx" ON "content_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_user_id_key" ON "authors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "authors"("slug");

-- CreateIndex
CREATE INDEX "authors_avatar_media_id_idx" ON "authors"("avatar_media_id");

-- CreateIndex
CREATE INDEX "content_authors_author_id_idx" ON "content_authors"("author_id");

-- CreateIndex
CREATE INDEX "content_authors_content_id_position_idx" ON "content_authors"("content_id", "position");

-- CreateIndex
CREATE INDEX "content_relations_to_content_id_kind_idx" ON "content_relations"("to_content_id", "kind");

-- CreateIndex
CREATE INDEX "content_relations_from_content_id_kind_position_idx" ON "content_relations"("from_content_id", "kind", "position");

-- CreateIndex
CREATE INDEX "faqs_status_updated_at_idx" ON "faqs"("status", "updated_at");

-- CreateIndex
CREATE INDEX "content_faqs_faq_id_idx" ON "content_faqs"("faq_id");

-- CreateIndex
CREATE INDEX "content_faqs_content_id_position_idx" ON "content_faqs"("content_id", "position");

-- CreateIndex
CREATE INDEX "page_faqs_faq_id_idx" ON "page_faqs"("faq_id");

-- CreateIndex
CREATE INDEX "page_faqs_path_position_idx" ON "page_faqs"("path", "position");

-- CreateIndex
CREATE UNIQUE INDEX "media_file_id_key" ON "media"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_key_key" ON "media"("key");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_source_path_key" ON "redirects"("source_path");

-- CreateIndex
CREATE INDEX "redirects_is_active_source_path_idx" ON "redirects"("is_active", "source_path");

-- CreateIndex
CREATE INDEX "site_settings_visibility_idx" ON "site_settings"("visibility");

-- CreateIndex
CREATE INDEX "site_settings_updated_by_id_idx" ON "site_settings"("updated_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_sessions_session_key_hash_key" ON "analytics_sessions"("session_key_hash");

-- CreateIndex
CREATE INDEX "analytics_sessions_anonymous_id_hash_first_seen_at_idx" ON "analytics_sessions"("anonymous_id_hash", "first_seen_at");

-- CreateIndex
CREATE INDEX "analytics_sessions_user_id_first_seen_at_idx" ON "analytics_sessions"("user_id", "first_seen_at");

-- CreateIndex
CREATE INDEX "analytics_sessions_last_seen_at_idx" ON "analytics_sessions"("last_seen_at");

-- CreateIndex
CREATE INDEX "analytics_events_session_id_created_at_idx" ON "analytics_events"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "analytics_events_name_created_at_idx" ON "analytics_events"("name", "created_at");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_created_at_idx" ON "analytics_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "analytics_events_path_created_at_idx" ON "analytics_events"("path", "created_at");

-- CreateIndex
CREATE INDEX "analytics_events_entity_type_entity_id_created_at_idx" ON "analytics_events"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_user_id_created_at_idx" ON "audit_logs"("actor_user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_created_at_idx" ON "audit_logs"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_request_id_idx" ON "audit_logs"("request_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_members" ADD CONSTRAINT "client_members_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_members" ADD CONSTRAINT "client_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_origin_lead_id_fkey" FOREIGN KEY ("origin_lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_approvals" ADD CONSTRAINT "milestone_approvals_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_approvals" ADD CONSTRAINT "milestone_approvals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_activities" ADD CONSTRAINT "project_activities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_activities" ADD CONSTRAINT "project_activities_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_opened_by_id_fkey" FOREIGN KEY ("opened_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_message_files" ADD CONSTRAINT "ticket_message_files_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "ticket_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_message_files" ADD CONSTRAINT "ticket_message_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "installments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_files" ADD CONSTRAINT "invoice_files_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_files" ADD CONSTRAINT "invoice_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_featured_media_id_fkey" FOREIGN KEY ("featured_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_translations" ADD CONSTRAINT "content_translations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industries" ADD CONSTRAINT "industries_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_translations" ADD CONSTRAINT "tag_translations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_media_id_fkey" FOREIGN KEY ("avatar_media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "author_translations" ADD CONSTRAINT "author_translations_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_authors" ADD CONSTRAINT "content_authors_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_authors" ADD CONSTRAINT "content_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_from_content_id_fkey" FOREIGN KEY ("from_content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_to_content_id_fkey" FOREIGN KEY ("to_content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_translations" ADD CONSTRAINT "faq_translations_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_faqs" ADD CONSTRAINT "content_faqs_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_faqs" ADD CONSTRAINT "content_faqs_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_faqs" ADD CONSTRAINT "page_faqs_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_translations" ADD CONSTRAINT "media_translations_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_sessions" ADD CONSTRAINT "analytics_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "analytics_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain invariants that Prisma does not express in the schema language.
ALTER TABLE "projects" ADD CONSTRAINT "projects_progress_range_check" CHECK ("progress" BETWEEN 0 AND 100);
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_progress_range_check" CHECK ("progress" BETWEEN 0 AND 100);
ALTER TABLE "files" ADD CONSTRAINT "files_size_nonnegative_check" CHECK ("size_bytes" >= 0);
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_amounts_nonnegative_check" CHECK (
  "subtotal_amount" >= 0 AND "discount_amount" >= 0 AND "tax_amount" >= 0 AND "total_amount" >= 0
);
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_total_consistency_check" CHECK (
  "total_amount" = "subtotal_amount" - "discount_amount" + "tax_amount"
);
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_amounts_check" CHECK (
  "quantity" > 0 AND "unit_amount" >= 0 AND "total_amount" >= 0
);
ALTER TABLE "installments" ADD CONSTRAINT "installments_amount_positive_check" CHECK ("amount" > 0);
ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_positive_check" CHECK ("amount" > 0);
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_amount_positive_check" CHECK ("amount" > 0);
ALTER TABLE "services" ADD CONSTRAINT "services_starting_price_nonnegative_check" CHECK (
  "starting_price_amount" IS NULL OR "starting_price_amount" >= 0
);
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_not_self_check" CHECK (
  "from_content_id" <> "to_content_id"
);

-- PostgreSQL treats NULL values as distinct in a normal unique index. This
-- partial index closes the duplicate invoice-level allocation case.
CREATE UNIQUE INDEX "payment_allocations_payment_invoice_without_installment_key"
  ON "payment_allocations"("payment_id", "invoice_id")
  WHERE "installment_id" IS NULL;

-- An allocation that names an installment must name that installment's invoice.
CREATE UNIQUE INDEX "installments_id_invoice_id_key" ON "installments"("id", "invoice_id");
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_installment_invoice_fkey"
  FOREIGN KEY ("installment_id", "invoice_id")
  REFERENCES "installments"("id", "invoice_id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
