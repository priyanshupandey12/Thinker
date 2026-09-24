import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  sourceType: z.enum(["thinker", "github"]),
  status: z.enum(["draft", "active", "archived"]),
});

export const projectListResponseSchema = z.object({
  data: z.array(projectSchema),
});

export const scenarioSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["draft", "active", "archived"]),
});

export const scenarioListResponseSchema = z.object({
  data: z.array(scenarioSchema),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type ScenarioListResponse = z.infer<typeof scenarioListResponseSchema>;
