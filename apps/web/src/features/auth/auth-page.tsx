import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Brand, GithubIcon } from "../../components/brand";
import { signInWithGithub, useAuthStatus, useCurrentUser } from "../../lib/auth";

export function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignup = mode === "sign-up";
  const user = useCurrentUser();
  const status = useAuthStatus();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  if (user.data) return <Navigate to="/app" replace />;

  async function handleSignIn() {
    setPending(true);
    setError(null);
    try {
      await signInWithGithub(mode);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Please try again.");
      setPending(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-entry" aria-label={isSignup ? "Sign up" : "Sign in"}>
        <Brand />

        <div className="auth-form">
          <div className="auth-form-heading">
            <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
            <p>
              {isSignup
                ? "Begin your engineering practice with GitHub."
                : "Sign in to continue your engineering practice."}
            </p>
          </div>

          <nav className="auth-toggle" aria-label="Choose authentication mode">
            <Link to="/sign-in" aria-current={isSignup ? undefined : "page"}>
              Sign in
            </Link>
            <Link to="/sign-up" aria-current={isSignup ? "page" : undefined}>
              Sign up
            </Link>
          </nav>

          <button
            className="button github-button"
            type="button"
            disabled={pending || !status.data?.data.githubEnabled}
            onClick={() => void handleSignIn()}
          >
            <GithubIcon />
            {pending ? "Connecting…" : isSignup ? "Sign up with GitHub" : "Sign in with GitHub"}
          </button>

          {status.isPending && (
            <p className="form-message" role="status">
              Checking availability…
            </p>
          )}
          {status.isError && (
            <div className="form-message error-message" role="alert">
              We couldn't connect.{" "}
              <button className="inline-button" type="button" onClick={() => void status.refetch()}>
                Try again
              </button>
            </div>
          )}
          {status.data && !status.data.data.githubEnabled && (
            <p className="form-message" role="status">
              GitHub sign-in is being set up. Please check back soon.
            </p>
          )}
          {(error || params.has("error")) && (
            <p className="form-message error-message" role="alert">
              {error ?? "GitHub sign-in wasn't completed. Please try again."}
            </p>
          )}

          <p className="auth-trust">Basic profile and email only. No repository access.</p>
        </div>
      </section>

      <aside className="auth-visual">
        <div>
          <span className="eyebrow">ENGINEERING PRACTICE, REIMAGINED</span>
          <h2>
            Think clearly.
            <br />
            Build deliberately.
          </h2>
        </div>
      </aside>
    </main>
  );
}
