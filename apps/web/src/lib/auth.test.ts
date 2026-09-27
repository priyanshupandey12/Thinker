import { describe, expect, it } from "vitest";
import { createGithubSignInPayload } from "./auth";

describe("GitHub sign-in payload", () => {
  it.each(["sign-in", "sign-up"] as const)(
    "returns OAuth failures to the initiating %s route",
    (mode) => {
      expect(createGithubSignInPayload(mode, "https://thinker.example")).toMatchObject({
        callbackURL: "https://thinker.example/app",
        errorCallbackURL: `https://thinker.example/${mode}?error=github`,
      });
    },
  );
});
