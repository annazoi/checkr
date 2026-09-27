CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended', 'banned');--> statement-breakpoint
CREATE TYPE "public"."confidence" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."evidence_status" AS ENUM('pending_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."moderation_action" AS ENUM('approve', 'reject', 'hide', 'escalate');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'trusted', 'published', 'under_review', 'removed', 'removed_silent', 'hidden', 'appealed');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('no_issue', 'suspicious', 'malware', 'suspicious_installer', 'fake_content', 'dangerous_redirect', 'unexpected_software', 'antivirus_warning', 'other');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('official_store', 'reseller', 'third_party', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'moderator', 'admin');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" varchar(100) NOT NULL,
	"target_type" varchar(50) NOT NULL,
	"target_id" varchar(100) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_platforms" (
	"game_id" uuid NOT NULL,
	"platform_id" uuid NOT NULL,
	CONSTRAINT "game_platforms_game_id_platform_id_pk" PRIMARY KEY("game_id","platform_id")
);
--> statement-breakpoint
CREATE TABLE "game_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"added_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"igdb_id" integer,
	"rawg_id" integer,
	"cover_url" varchar(500),
	"description" text,
	"developer" varchar(255),
	"publisher" varchar(255),
	"release_year" smallint,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "games_slug_unique" UNIQUE("slug"),
	CONSTRAINT "games_igdb_id_unique" UNIQUE("igdb_id"),
	CONSTRAINT "games_rawg_id_unique" UNIQUE("rawg_id")
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"moderator_id" uuid NOT NULL,
	"action" "moderation_action" NOT NULL,
	"reason" varchar(255) NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "platforms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "report_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid,
	"user_id" uuid NOT NULL,
	"r2_key" varchar(500) NOT NULL,
	"status" "evidence_status" DEFAULT 'pending_review' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_source_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"report_type" "report_type" NOT NULL,
	"confidence_level" "confidence" DEFAULT 'medium',
	"description" text,
	"evidence_id" uuid,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"weight" real DEFAULT 1,
	"helpful_count" integer DEFAULT 0,
	"anomaly_detected" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" varchar(255) NOT NULL,
	"source_type" "source_type" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "sources_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_slug" varchar(50) NOT NULL,
	"awarded_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(30) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"password_hash" varchar(255) NOT NULL,
	"avatar_preset" varchar(50),
	"avatar_url" varchar(500),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"trust_score" integer DEFAULT 0,
	"xp" integer DEFAULT 0,
	"level" smallint DEFAULT 1,
	"report_count" integer DEFAULT 0,
	"helpful_count" integer DEFAULT 0,
	"status" "account_status" DEFAULT 'active',
	"age_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_active" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_platforms" ADD CONSTRAINT "game_platforms_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sources" ADD CONSTRAINT "game_sources_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sources" ADD CONSTRAINT "game_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sources" ADD CONSTRAINT "game_sources_added_by_user_id_users_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_evidence" ADD CONSTRAINT "report_evidence_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_evidence" ADD CONSTRAINT "report_evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_game_source_id_game_sources_id_fk" FOREIGN KEY ("game_source_id") REFERENCES "public"."game_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_target_type_target_id_idx" ON "audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "game_sources_game_id_idx" ON "game_sources" USING btree ("game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "game_sources_game_source_idx" ON "game_sources" USING btree ("game_id","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "games_igdb_id_idx" ON "games" USING btree ("igdb_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_report_id_idx" ON "moderation_actions" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "report_evidence_report_id_idx" ON "report_evidence" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "reports_game_source_id_status_idx" ON "reports" USING btree ("game_source_id","status");--> statement-breakpoint
CREATE INDEX "reports_user_id_idx" ON "reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_domain_idx" ON "sources" USING btree ("domain");--> statement-breakpoint
CREATE UNIQUE INDEX "user_badges_user_id_badge_slug_idx" ON "user_badges" USING btree ("user_id","badge_slug");