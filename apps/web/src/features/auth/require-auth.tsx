import { Navigate, Outlet } from "react-router-dom";
import { Brand } from "../../components/brand";
import { useCurrentUser } from "../../lib/auth";

export function RequireAuth() {
  const user = useCurrentUser();
  if (user.isPending)
    return (
      <main className="state-page">
        <Brand />
        <p role="status">Opening your workspace…</p>
      </main>
    );
  if (user.isError)
    return (
      <main className="state-page">
        <Brand />
        <h1>Let's try that again.</h1>
        <p role="alert">We couldn't check your session.</p>
        <button className="button" type="button" onClick={() => void user.refetch()}>
          Retry connection
        </button>
      </main>
    );
  if (!user.data) return <Navigate to="/sign-in" replace />;
  return <Outlet context={user.data} />;
}
