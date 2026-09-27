import { z } from "zod";

export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
});
export const currentUserResponseSchema = z.object({ data: currentUserSchema });
export const authStatusResponseSchema = z.object({
  data: z.object({ githubEnabled: z.boolean() }),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;
