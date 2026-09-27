import { randomUUID } from "node:crypto";
import type { HealthResponse } from "@thinker/contracts";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./infrastructure/logging/logger";
import { authRouter } from "./modules/auth/auth.routes";
import { catalogRouter } from "./modules/catalog/catalog.routes";
import { NotFoundError } from "./shared/errors/app-error";
import { errorHandler } from "./shared/http/error-handler";
import "./shared/http/request-context";

const safeRequestIdPattern = /^[A-Za-z0-9._:-]{1,128}$/;

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    pinoHttp({
      logger,
      // OAuth callbacks carry authorization codes in the query string.
      serializers: {
        req: (request) => ({
          id: request.id,
          method: request.method,
          url: request.url?.split("?")[0],
        }),
      },
      genReqId: (request, response) => {
        const incomingRequestId = request.headers["x-request-id"];
        const requestId =
          typeof incomingRequestId === "string" && safeRequestIdPattern.test(incomingRequestId)
            ? incomingRequestId
            : randomUUID();
        response.setHeader("X-Request-ID", requestId);
        return requestId;
      },
    }),
  );
  // Better Auth must receive the unconsumed request body.
  app.use(authRouter);
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/v1/health", (_request, response) => {
    const body = {
      data: {
        service: "thinker-api",
        status: "ok",
      },
    } satisfies HealthResponse;
    response.json(body);
  });

  app.use("/api/v1", catalogRouter);
  app.use("/api/v1", (_request, _response, next) => {
    next(new NotFoundError("ROUTE_NOT_FOUND", "The requested API route could not be found."));
  });
  app.use(errorHandler);

  return app;
}
