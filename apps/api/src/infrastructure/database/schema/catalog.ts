import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const projectSourceType = pgEnum("project_source_type", ["thinker", "github"]);
export const publicationStatus = pgEnum("publication_status", ["draft", "active", "archived"]);
export const scenarioDifficulty = pgEnum("scenario_difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const learningStageType = pgEnum("learning_stage_type", [
  "observe",
  "question",
  "hypothesis",
  "design",
  "implement",
  "measure",
  "break",
  "tradeoff",
  "reflect",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sourceType: projectSourceType("source_type").notNull(),
  status: publicationStatus("status").notNull(),
  ...timestamps,
});

export const projectVersions = pgTable(
  "project_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    repositoryUrl: text("repository_url").notNull(),
    commitSha: text("commit_sha").notNull(),
    runtime: text("runtime").notNull(),
    runtimeVersion: text("runtime_version").notNull(),
    configuration: jsonb("configuration").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("project_versions_project_version_uidx").on(table.projectId, table.version),
  ],
);

export const scenarios = pgTable(
  "scenarios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "restrict" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    difficulty: scenarioDifficulty("difficulty").notNull(),
    status: publicationStatus("status").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("scenarios_project_slug_uidx").on(table.projectId, table.slug)],
);

export const scenarioVersions = pgTable(
  "scenario_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scenarioId: uuid("scenario_id")
      .notNull()
      .references(() => scenarios.id, { onDelete: "restrict" }),
    projectVersionId: uuid("project_version_id")
      .notNull()
      .references(() => projectVersions.id, { onDelete: "restrict" }),
    version: integer("version").notNull(),
    baselineConfig: jsonb("baseline_config").notNull().default(sql`'{}'::jsonb`),
    workloadConfig: jsonb("workload_config").notNull().default(sql`'{}'::jsonb`),
    learningObjectives: jsonb("learning_objectives").notNull().default(sql`'[]'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("scenario_versions_scenario_version_uidx").on(table.scenarioId, table.version),
  ],
);

export const scenarioStages = pgTable(
  "scenario_stages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scenarioVersionId: uuid("scenario_version_id")
      .notNull()
      .references(() => scenarioVersions.id, { onDelete: "restrict" }),
    stageType: learningStageType("stage_type").notNull(),
    title: text("title").notNull(),
    position: integer("position").notNull(),
    configuration: jsonb("configuration").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("scenario_stages_version_position_uidx").on(
      table.scenarioVersionId,
      table.position,
    ),
  ],
);
