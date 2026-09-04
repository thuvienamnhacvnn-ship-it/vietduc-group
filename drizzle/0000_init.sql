CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"description" jsonb,
	"kind" text DEFAULT 'culture' NOT NULL,
	"cover_path" text,
	"happened_on" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer,
	"page_number" integer,
	"heading" text,
	"body" text NOT NULL,
	"category" text DEFAULT 'other' NOT NULL,
	"language" text DEFAULT 'vi' NOT NULL,
	"assigned_to" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"injection_flag" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_at" timestamp with time zone DEFAULT now() NOT NULL,
	"lead_id" integer,
	"handoff_requested" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"page_number" integer NOT NULL,
	"text" text DEFAULT '' NOT NULL,
	"text_source" text DEFAULT 'empty' NOT NULL,
	"ocr_confidence" real,
	"preview_path" text
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"original_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"public_path" text,
	"bytes" integer DEFAULT 0 NOT NULL,
	"page_count" integer DEFAULT 0 NOT NULL,
	"language" text DEFAULT 'vi' NOT NULL,
	"document_date" text,
	"processing_state" text DEFAULT 'queued' NOT NULL,
	"processing_error" text,
	"ocr_used" boolean DEFAULT false NOT NULL,
	"downloadable" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"sha256" text,
	"uploaded_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" jsonb NOT NULL,
	"answer" jsonb NOT NULL,
	"topic" text DEFAULT 'general' NOT NULL,
	"program_id" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb
);
--> statement-breakpoint
CREATE TABLE "kb_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_ref" text NOT NULL,
	"source_kind" text NOT NULL,
	"document_id" integer,
	"page_number" integer,
	"citation" jsonb NOT NULL,
	"href" text,
	"language" text DEFAULT 'vi' NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"normalized" text DEFAULT '' NOT NULL,
	"token_count" integer DEFAULT 0 NOT NULL,
	"embedding" jsonb,
	"embedding_model" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"email" text,
	"whatsapp" text,
	"zalo" text,
	"interest_category" text,
	"program_id" integer,
	"current_level" text,
	"goal" text,
	"preferred_mode" text,
	"start_window" text,
	"question" text,
	"source" text DEFAULT 'website_form' NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"state" text DEFAULT 'new' NOT NULL,
	"assigned_to" integer,
	"note" text,
	"consent_at" timestamp with time zone NOT NULL,
	"consent_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"width" integer,
	"height" integer,
	"bytes" integer,
	"alt" jsonb,
	"caption" jsonb,
	"provenance" jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"citations" jsonb,
	"outcome" text,
	"confidence" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"confirm_token" text,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"consent_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"body" jsonb,
	"seo_title" jsonb,
	"seo_description" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"kind" text DEFAULT 'enterprise' NOT NULL,
	"country" text,
	"region" text,
	"note" jsonb,
	"logo_path" text,
	"website" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"role" jsonb,
	"kind" text DEFAULT 'leadership' NOT NULL,
	"bio" jsonb,
	"photo_path" text,
	"school_id" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"excerpt" jsonb,
	"body" jsonb,
	"cover_path" text,
	"published_at" timestamp with time zone,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_media" (
	"program_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "program_media_program_id_media_id_pk" PRIMARY KEY("program_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb NOT NULL,
	"school_id" integer,
	"category_id" integer,
	"official_code" text,
	"level" text NOT NULL,
	"intake_quota" integer,
	"overview" jsonb,
	"audience" jsonb,
	"objectives" jsonb,
	"outcomes" jsonb,
	"modules" jsonb,
	"roadmap" jsonb,
	"careers" jsonb,
	"admission_file" jsonb,
	"duration_months" integer,
	"duration_label" jsonb,
	"mode" text,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location_city" jsonb,
	"intake_schedule" jsonb,
	"tuition" jsonb,
	"certificate" jsonb,
	"cover_path" text,
	"brochure_document_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb,
	"editor_note" text,
	"views" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"name" jsonb NOT NULL,
	"short_name" jsonb,
	"tagline" jsonb,
	"summary" jsonb,
	"legal_name_en" text,
	"city" jsonb,
	"country" text DEFAULT 'VN' NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"website" text,
	"logo_path" text,
	"cover_path" text,
	"highlights" jsonb,
	"legal_refs" jsonb,
	"stats" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"provenance" jsonb,
	"editor_note" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"results" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "unanswered_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"conversation_id" text,
	"top_score" real,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'content_editor' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_pages" ADD CONSTRAINT "document_pages_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kb_chunks" ADD CONSTRAINT "kb_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_media" ADD CONSTRAINT "program_media_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_media" ADD CONSTRAINT "program_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "activities_slug_idx" ON "activities" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_blocks_doc_idx" ON "content_blocks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "content_blocks_status_idx" ON "content_blocks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_blocks_category_idx" ON "content_blocks" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "document_pages_idx" ON "document_pages" USING btree ("document_id","page_number");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_slug_idx" ON "documents" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "documents_state_idx" ON "documents" USING btree ("processing_state");--> statement-breakpoint
CREATE INDEX "faqs_topic_idx" ON "faqs" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "kb_source_idx" ON "kb_chunks" USING btree ("source_ref");--> statement-breakpoint
CREATE INDEX "kb_status_idx" ON "kb_chunks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "kb_lang_idx" ON "kb_chunks" USING btree ("language");--> statement-breakpoint
CREATE INDEX "leads_state_idx" ON "leads" USING btree ("state");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "media_path_idx" ON "media" USING btree ("path");--> statement-breakpoint
CREATE INDEX "messages_conv_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "people_slug_idx" ON "people" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "programs_school_idx" ON "programs" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "programs_level_idx" ON "programs" USING btree ("level");--> statement-breakpoint
CREATE INDEX "programs_status_idx" ON "programs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "schools_slug_idx" ON "schools" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");