import { type ApiErrorResponse, apiErrorSchema } from "@thinker/contracts";
import type { ZodType } from "zod";

export class ApiClientError extends Error {
  constructor(public readonly response: ApiErrorResponse) {
    super(response.error.message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(path: string, schema: ZodType<T>, init?: RequestInit) {
  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    throw new ApiClientError(apiErrorSchema.parse(body));
  }

  return schema.parse(body);
}
