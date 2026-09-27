import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CurrentUser,
  projectListResponseSchema,
  scenarioListResponseSchema,
} from "@thinker/contracts";
import { useState } from "react";
import { Link, NavLink, useNavigate, useOutletContext } from "react-router-dom";
import { Brand } from "../../components/brand";
import { apiRequest } from "../../lib/api-client";
import { signOut } from "../../lib/auth";

type Section = "overview" | "projects" | "journal" | "account";

function ProjectScenarios({ projectId }: { projectId: string }) {
  const scenarios = useQuery({
    queryKey: ["scenarios", projectId],
    queryFn: () =>
      apiRequest(`/api/v1/projects/${projectId}/scenarios`, scenarioListResponseSchema),
  });
  if (scenarios.isPending) return <p role="status">Loading scenarios…</p>;
  if (scenarios.isError)
    return (
      <p role="alert">
        Couldn't load scenarios.{" "}
        <button className="inline-button" type="button" onClick={() => void scenarios.refetch()}>
          Try again
        </button>
      </p>
    );
  return (
    <div className="scenario-list">
      {scenarios.data.data.length === 0 ? (
        <p>No scenarios have been published yet.</p>
      ) : (
        scenarios.data.data.map((scenario) => (
          <div className="scenario-row" key={scenario.id}>
            <div>
              <span className="eyebrow">{scenario.difficulty}</span>
              <h4>{scenario.title}</h4>
              <p>{scenario.description}</p>
            </div>
            <span className="status-tag">Sessions coming soon</span>
          </div>
        ))
      )}
    </div>
  );
}

function ProjectCatalog() {
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiRequest("/api/v1/projects", projectListResponseSchema),
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  if (projects.isPending)
    return (
      <div className="empty-panel" role="status">
        Loading your practice ground…
      </div>
    );
  if (projects.isError)
    return (
      <div className="empty-panel" role="alert">
        <h3>We couldn't load the projects.</h3>
        <p>Check your connection and try again.</p>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => void projects.refetch()}
        >
          Retry
        </button>
      </div>
    );
  if (projects.data.data.length === 0)
    return (
      <div className="empty-panel">
        <h3>The practice ground is taking shape.</h3>
        <p>Published projects will appear here.</p>
      </div>
    );
  return (
    <div className="project-list">
      {projects.data.data.map((project) => (
        <article className="project-card" key={project.id}>
          <div className="project-card-top">
            <span className="project-glyph" aria-hidden="true">
              {"{ }"}
            </span>
            <span className="status-tag">Thinker project</span>
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button
            className="inline-button project-toggle"
            type="button"
            aria-expanded={expanded === project.id}
            aria-controls={`scenarios-${project.id}`}
            onClick={() => setExpanded(expanded === project.id ? null : project.id)}
          >
            {expanded === project.id ? "Hide scenarios" : "Explore scenarios"}
            <span aria-hidden="true">{expanded === project.id ? "−" : "↗"}</span>
          </button>
          <div id={`scenarios-${project.id}`}>
            {expanded === project.id && <ProjectScenarios projectId={project.id} />}
          </div>
        </article>
      ))}
    </div>
  );
}

export function DashboardPage({ section = "overview" }: { section?: Section }) {
  const user = useOutletContext<CurrentUser>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
      queryClient.clear();
      navigate("/", { replace: true });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Please try again.");
      setSigningOut(false);
    }
  }

  const titles = {
    overview: "Your workspace",
    projects: "Practice ground",
    journal: "Engineering journal",
    account: "Your account",
  };
  return (
    <div className="app-layout">
      <a className="skip-link" href="#workspace">
        Skip to content
      </a>
      <aside className="app-sidebar">
        <Brand to="/app" />
        <span className="sidebar-label mono">YOUR PRACTICE</span>
        <nav aria-label="Workspace navigation">
          <NavLink to="/app" end>
            <span aria-hidden="true">◫</span>Overview
          </NavLink>
          <NavLink to="/app/projects">
            <span aria-hidden="true">◇</span>Projects
          </NavLink>
          <NavLink to="/app/journal">
            <span aria-hidden="true">▤</span>Journal
          </NavLink>
        </nav>
        <div className="sidebar-note">
          <span aria-hidden="true">✳</span>
          <p>The goal isn't to know the tool. It's to know when to use it.</p>
        </div>
        <NavLink className="account-link" to="/app/account">
          <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
          <span>
            {user.name}
            <small>Personal workspace</small>
          </span>
          <span aria-hidden="true">↗</span>
        </NavLink>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <span>{titles[section]}</span>
          <Link to="/" className="text-link">
            Back to site ↗
          </Link>
        </header>
        <main id="workspace" className="workspace-content">
          {section === "overview" && (
            <>
              <span className="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</span>
              <h1>
                Welcome, {user.name.split(" ")[0]}
                <span className="accent">.</span>
              </h1>
              <p className="page-intro">Your next step toward thinking like a systems engineer.</p>
              <section className="welcome-banner">
                <div>
                  <span className="eyebrow">START WITH A QUESTION</span>
                  <h2>
                    What could this
                    <br />
                    <em>system do better?</em>
                  </h2>
                  <p>Explore a project, inspect the evidence, and make your case.</p>
                  <Link className="button" to="/app/projects">
                    Explore projects <span aria-hidden="true">↗</span>
                  </Link>
                </div>
                <div className="banner-symbol" aria-hidden="true">
                  ?
                </div>
              </section>
              <div className="dashboard-section-heading">
                <h2>Your practice ground</h2>
                <Link className="text-link" to="/app/projects">
                  View projects ↗
                </Link>
              </div>
              <ProjectCatalog />
              <section className="journal-teaser">
                <span aria-hidden="true">▤</span>
                <div>
                  <h3>Your reasoning has a home.</h3>
                  <p>
                    As learning sessions become available, your hypotheses, designs, and reflections
                    will build your engineering journal.
                  </p>
                </div>
                <Link className="inline-link" to="/app/journal">
                  Open journal ↗
                </Link>
              </section>
            </>
          )}
          {section === "projects" && (
            <>
              <span className="eyebrow">LEARN THROUGH REAL SYSTEMS</span>
              <h1>Choose your next question.</h1>
              <p className="page-intro">
                Controlled projects with engineering problems worth investigating.
              </p>
              <ProjectCatalog />
            </>
          )}
          {section === "journal" && (
            <>
              <span className="eyebrow">MAKE YOUR THINKING VISIBLE</span>
              <h1>Engineering journal.</h1>
              <p className="page-intro">A record of your reasoning and how it changes.</p>
              <div className="empty-panel journal-empty">
                <span className="empty-symbol" aria-hidden="true">
                  ▤
                </span>
                <h2>Your first entry is ahead of you.</h2>
                <p>
                  Hypotheses, architecture decisions, and reflections will appear here when learning
                  sessions launch.
                </p>
                <Link className="button button-secondary" to="/app/projects">
                  Explore the projects ↗
                </Link>
                <span className="availability-note">Journal capture is in development.</span>
              </div>
            </>
          )}
          {section === "account" && (
            <>
              <span className="eyebrow">YOUR SPACE</span>
              <h1>Your account.</h1>
              <p className="page-intro">Connected through GitHub.</p>
              <section className="account-card">
                <div className="account-profile">
                  <span className="avatar avatar-large">{user.name.slice(0, 1).toUpperCase()}</span>
                  <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="account-permissions">
                  <h3>Identity, connected.</h3>
                  <p>
                    GitHub is used to sign you in. Connecting a project repository is a separate
                    step.
                  </p>
                </div>
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={signingOut}
                  onClick={() => void handleSignOut()}
                >
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
                {error && (
                  <p className="error-message" role="alert">
                    {error}
                  </p>
                )}
              </section>
            </>
          )}
        </main>
        <footer className="app-footer">
          Think before the tool.<span>Thinker · Early development</span>
        </footer>
      </div>
    </div>
  );
}
