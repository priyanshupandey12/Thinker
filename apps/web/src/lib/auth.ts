import { useQuery } from "@tanstack/react-query";
import { authStatusResponseSchema, currentUserResponseSchema } from "@thinker/contracts";
import { z } from "zod";
import { apiRequest } from "./api-client";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch("/api/v1/me", { credentials: "include", cache: "no-store" });
      if (response.status === 401) return null;
      if (!response.ok) throw new Error("We couldn't check your session. Please try again.");
      return currentUserResponseSchema.parse(await response.json()).data;
    },
    retry: false,
    staleTime: 0,
  });
}

export function useAuthStatus() {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: () => apiRequest("/api/v1/auth/status", authStatusResponseSchema),
  });
}

export function createGithubSignInPayload(mode: "sign-in" | "sign-up", origin: string) {
  return {
    provider: "github",
    callbackURL: `${origin}/app`,
    errorCallbackURL: `${origin}/${mode}?error=github`,
    disableRedirect: true,
  } as const;
}

export async function signInWithGithub(mode: "sign-in" | "sign-up") {
  const response = await fetch("/api/auth/sign-in/social", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createGithubSignInPayload(mode, window.location.origin)),
  });
  if (!response.ok) throw new Error("GitHub sign-in couldn't start. Please try again.");
  const result = z.object({ url: z.string().url() }).parse(await response.json());
  window.location.assign(result.url);
}

export async function signOut() {
  const response = await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (!response.ok) throw new Error("We couldn't sign you out. Please try again.");
}
