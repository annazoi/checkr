import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  smallint,
  real,
  timestamp,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------

export const accountStatusEnum = pgEnum("account_status", [
  "active",
  "suspended",
  "banned",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "moderator", "admin"]);

export const sourceTypeEnum = pgEnum("source_type", [
  "official_store",
  "reseller",
  "third_party",
  "unknown",
]);

export const reportTypeEnum = pgEnum("report_type", [
  "no_issue",
  "suspicious",
  "malware",
  "suspicious_installer",
  "fake_content",
  "dangerous_redirect",
  "unexpected_software",
  "antivirus_warning",
  "other",
]);

export const confidenceEnum = pgEnum("confidence", ["low", "medium", "high"]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "trusted",
  "published",
  "under_review",
  "removed",
  "removed_silent",
  "hidden",
  "appealed",
]);

export const evidenceStatusEnum = pgEnum("evidence_status", [
  "pending_review",
  "approved",
  "rejected",
]);

export const moderationActionEnum = pgEnum("moderation_action", [
  "approve",
  "reject",
  "hide",
  "escalate",
]);

// ---------- Tables ----------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 30 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatarPreset: varchar("avatar_preset", { length: 50 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  role: userRoleEnum("role").default("user").notNull(),
  trustScore: integer("trust_score").default(0),
  xp: integer("xp").default(0),
  level: smallint("level").default(1),
  reportCount: integer("report_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  status: accountStatusEnum("status").default("active"),
  ageVerified: boolean("age_verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastActive: timestamp("last_active", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const platforms = pgTable("platforms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    igdbId: integer("igdb_id").unique(),
    rawgId: integer("rawg_id").unique(),
    coverUrl: varchar("cover_url", { length: 500 }),
    description: text("description"),
    developer: varchar("developer", { length: 255 }),
    publisher: varchar("publisher", { length: 255 }),
    releaseYear: smallint("release_year"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("games_slug_idx").on(table.slug),
    igdbIdIdx: index("games_igdb_id_idx").on(table.igdbId),
  }),
);

export const gamePlatforms = pgTable(
  "game_platforms",
  {
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    platformId: uuid("platform_id")
      .notNull()
      .references(() => platforms.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.gameId, table.platformId] }),
  }),
);

export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domain: varchar("domain", { length: 255 }).unique().notNull(),
    sourceType: sourceTypeEnum("source_type").default("unknown").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    domainIdx: uniqueIndex("sources_domain_idx").on(table.domain),
  }),
);

export const gameSources = pgTable(
  "game_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    addedByUserId: uuid("added_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    gameIdx: index("game_sources_game_id_idx").on(table.gameId),
    gameSourceUnique: uniqueIndex("game_sources_game_source_idx").on(
      table.gameId,
      table.sourceId,
    ),
  }),
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameSourceId: uuid("game_source_id")
      .notNull()
      .references(() => gameSources.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reportType: reportTypeEnum("report_type").notNull(),
    confidenceLevel: confidenceEnum("confidence_level").default("medium"),
    description: text("description"),
    evidenceId: uuid("evidence_id"),
    status: reportStatusEnum("status").default("pending").notNull(),
    weight: real("weight").default(1.0),
    helpfulCount: integer("helpful_count").default(0),
    anomalyDetected: boolean("anomaly_detected").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    gameSourceStatusIdx: index("reports_game_source_id_status_idx").on(
      table.gameSourceId,
      table.status,
    ),
    userIdx: index("reports_user_id_idx").on(table.userId),
    createdAtIdx: index("reports_created_at_idx").on(table.createdAt),
  }),
);

export const reportEvidence = pgTable(
  "report_evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    r2Key: varchar("r2_key", { length: 500 }).notNull(),
    status: evidenceStatusEnum("status").default("pending_review").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    reportIdx: index("report_evidence_report_id_idx").on(table.reportId),
  }),
);

// moderation_actions is append-only: a DB trigger (see lib/db/migrations)
// rejects UPDATE and DELETE against this table.
export const moderationActions = pgTable(
  "moderation_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    action: moderationActionEnum("action").notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    reportIdx: index("moderation_actions_report_id_idx").on(table.reportId),
  }),
);

export const userBadges = pgTable(
  "user_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeSlug: varchar("badge_slug", { length: 50 }).notNull(),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userBadgeUnique: uniqueIndex("user_badges_user_id_badge_slug_idx").on(
      table.userId,
      table.badgeSlug,
    ),
  }),
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdx: index("notifications_user_id_idx").on(table.userId),
  }),
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: varchar("target_id", { length: 100 }).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    actorIdx: index("audit_logs_actor_id_idx").on(table.actorId),
    targetIdx: index("audit_logs_target_type_target_id_idx").on(
      table.targetType,
      table.targetId,
    ),
  }),
);

// ---------- Relations ----------

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  badges: many(userBadges),
  notifications: many(notifications),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  gamePlatforms: many(gamePlatforms),
  gameSources: many(gameSources),
}));

export const gameSourcesRelations = relations(gameSources, ({ one, many }) => ({
  game: one(games, { fields: [gameSources.gameId], references: [games.id] }),
  source: one(sources, { fields: [gameSources.sourceId], references: [sources.id] }),
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  gameSource: one(gameSources, {
    fields: [reports.gameSourceId],
    references: [gameSources.id],
  }),
  user: one(users, { fields: [reports.userId], references: [users.id] }),
  evidence: one(reportEvidence, {
    fields: [reports.evidenceId],
    references: [reportEvidence.id],
  }),
  moderationActions: many(moderationActions),
}));
