import { useQuery } from "@tanstack/react-query";
import { healthResponseSchema } from "@thinker/contracts";
import { apiRequest } from "../../lib/api-client";

export function HomePage() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => apiRequest("/api/v1/health", healthResponseSchema),
  });

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <span className="eyebrow">Engineering reasoning, practiced</span>
        <h1 id="page-title">Think before the tool.</h1>
        <p>
          Observe real evidence, form a hypothesis, implement a change, and learn from what breaks.
        </p>
        <div className="status" aria-live="polite">
          <span className={health.isSuccess ? "status-dot is-online" : "status-dot"} />
          {health.isPending && "Connecting to the Thinker API…"}
          {health.isSuccess && "Scaffold is connected and ready."}
          {health.isError && "The web app is ready; start the API to connect."}
        </div>
      </section>
    </main>
  );
}
