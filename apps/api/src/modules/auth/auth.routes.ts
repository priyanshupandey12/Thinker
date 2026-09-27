import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { Router } from "express";
import { AppError } from "../../shared/errors/app-error";
import { auth } from "./auth";

export const authRouter = Router();

authRouter.get("/api/v1/auth/status", (_request, response) => {
  response.json({ data: { githubEnabled: auth !== null } });
});

authRouter.get("/api/v1/me", async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  const result = auth
    ? await auth.api.getSession({ headers: fromNodeHeaders(request.headers) })
    : null;
  if (!result) {
    throw new AppError("UNAUTHENTICATED", "Sign in to continue.", 401);
  }
  const { id, name, email, image } = result.user;
  // Do not expose account tokens or the session token to the dashboard.
  response.json({ data: { id, name, email, image: image ?? null } });
});

authRouter.all("/api/auth/{*path}", (request, response, next) => {
  if (!auth) {
    next(new AppError("AUTH_UNAVAILABLE", "GitHub sign-in is not configured yet.", 503));
    return;
  }
  return toNodeHandler(auth)(request, response);
});
