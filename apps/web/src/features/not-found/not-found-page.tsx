import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">404</span>
        <h1>This path has no scenario yet.</h1>
        <Link to="/">Return home</Link>
      </section>
    </main>
  );
}
