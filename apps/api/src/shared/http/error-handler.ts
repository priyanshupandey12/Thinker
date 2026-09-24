import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../../infrastructure/logging/logger";
import { AppError } from "../errors/app-error";

type JsonParseError = SyntaxError & {
  status?: number;
  type?: string;
};

function isJsonParseError(error: unknown): error is JsonParseError {
  return (
    error instanceof SyntaxError &&
    "type" in error &&
    (error as JsonParseError).type === "entity.parse.failed"
  );
}

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  if (isJsonParseError(error)) {
    response.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON.",
        details: null,
        requestId: request.id,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request contains invalid data.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
        requestId: request.id,
      },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId: request.id,
      },
    });
    return;
  }

  logger.error({ error, requestId: request.id }, "Unhandled request error");
  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
      details: null,
      requestId: request.id,
    },
  });
};
