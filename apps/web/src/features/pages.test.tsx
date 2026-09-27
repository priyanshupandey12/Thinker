import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthPage } from "./auth/auth-page";
import { DashboardPage } from "./dashboard/dashboard-page";
import { HomePage } from "./home/home-page";

const learner = {
  id: "test-user",
  name: "Test Learner",
  email: "learner@example.test",
  image: null,
};

describe("entry screens", () => {
  it("links to sign-up and identifies the scenario preview accessibly", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(html).toContain('href="/sign-up"');
    expect(html).toContain('aria-label="Illustrative scenario evidence"');
    expect(html).toContain("Learning sessions are in development.");
  });

  it.each(["sign-in", "sign-up"] as const)(
    "keeps %s unavailable until GitHub is configured",
    (mode) => {
      const client = new QueryClient();
      client.setQueryData(["current-user"], null);
      client.setQueryData(["auth-status"], { data: { githubEnabled: false } });
      const html = renderToStaticMarkup(
        <QueryClientProvider client={client}>
          <MemoryRouter>
            <AuthPage mode={mode} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(html).toContain("GitHub sign-in is being set up");
      expect(html).toMatch(/<button[^>]*disabled/);
      expect(html).toContain(mode === "sign-up" ? "Sign up with GitHub" : "Sign in with GitHub");
      expect(html).toContain(mode === "sign-up" ? "Create your account" : "Welcome back");
      expect(html).toContain('aria-current="page"');
      expect(html).toContain("Think clearly.");
      expect(html).toContain("Build deliberately.");
      expect(html).toContain("No repository access");
      client.clear();
    },
  );

  it.each(["overview", "projects", "journal", "account"] as const)(
    "renders the %s dashboard with session identity and honest empty states",
    (section) => {
      const client = new QueryClient();
      client.setQueryData(["projects"], {
        data: [
          { id: "project-1", name: "Thinker Product API", description: "Controlled product API" },
        ],
      });
      const html = renderToStaticMarkup(
        <QueryClientProvider client={client}>
          <MemoryRouter initialEntries={["/app"]}>
            <Routes>
              <Route path="/app" element={<Outlet context={learner} />}>
                <Route index element={<DashboardPage section={section} />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(html).toContain("Test Learner");
      if (section === "overview" || section === "projects")
        expect(html).toContain("Thinker Product API");
      if (section === "journal") expect(html).toContain("Journal capture is in development.");
      if (section === "account") {
        expect(html).toContain("learner@example.test");
        expect(html).toContain("Sign out");
      }
      client.clear();
    },
  );
});
