import { z } from "zod";

export const requestIdSchema = z.string().min(1);

export const apiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(apiErrorDetailSchema).nullable(),
    requestId: requestIdSchema,
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;

export const pageMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
