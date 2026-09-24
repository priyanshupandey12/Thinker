import { z } from "zod";

export const learningStageSchema = z.enum([
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

export const sessionStatusSchema = z.enum(["in_progress", "completed", "abandoned"]);

export const startSessionRequestSchema = z.object({
  projectId: z.string().uuid(),
  scenarioId: z.string().uuid(),
  learningIntent: z.string().trim().min(1).max(100).optional(),
});

export type LearningStage = z.infer<typeof learningStageSchema>;
export type SessionStatus = z.infer<typeof sessionStatusSchema>;
export type StartSessionRequest = z.infer<typeof startSessionRequestSchema>;
