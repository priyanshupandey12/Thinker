import { z } from "zod";

export const healthResponseSchema = z.object({
  data: z.object({
    service: z.literal("thinker-api"),
    status: z.literal("ok"),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
