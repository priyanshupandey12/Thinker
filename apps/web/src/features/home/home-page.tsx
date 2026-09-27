import { Link } from "react-router-dom";
import { Brand } from "../../components/brand";

const stages = [
  "Observe",
  "Question",
  "Hypothesize",
  "Design",
  "Implement",
  "Measure",
  "Break",
  "Reflect",
];

export function HomePage() {
  return (
    <div className="site-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="floating-navbar">
        <Brand />
        <nav className="floating-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#first-scenario">Explore scenarios</a>
        </nav>
        <div className="floating-nav-actions">
          <Link className="nav-sign-in" to="/sign-in">
            Sign in
          </Link>
          <Link className="button nav-get-started" to="/sign-up">
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="landing-hero page-width">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-dot" /> A practice ground for engineering minds
            </span>
            <h1>
              You can build it.
              <br />
              Now understand
              <br />
              <em>why it works.</em>
            </h1>
            <p>
              Go beyond CRUD. Investigate real systems, make architectural decisions, and learn from
              the consequences.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/sign-up">
                Start thinking <span aria-hidden="true">↗</span>
              </Link>
              <a className="inline-link" href="#how-it-works">
                Explore the approach <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <section className="evidence-scene" aria-label="Illustrative scenario evidence">
            <div className="evidence-window">
              <div className="window-bar">
                <span className="window-dots" aria-hidden="true">
                  ● ● ●
                </span>
                <span>product-api / observation</span>
              </div>
              <div className="evidence-body">
                <div className="mono muted">
                  GET /products/:id <span className="pill">200 OK</span>
                </div>
                <h2>
                  Same products.
                  <br />
                  Same work. Every time.
                </h2>
                <div className="metric-grid">
                  <div>
                    <strong>1,000</strong>
                    <span>requests</span>
                  </div>
                  <div>
                    <strong>43</strong>
                    <span>unique products</span>
                  </div>
                  <div className="metric-highlight">
                    <strong>998</strong>
                    <span>database reads</span>
                  </div>
                </div>
                <div className="chart" aria-hidden="true">
                  {[38, 55, 45, 72, 58, 84, 69, 92, 80, 97, 87, 99, 90, 96, 85, 98, 91, 100].map(
                    (height) => (
                      <i key={height} style={{ height: `${height}%` }} />
                    ),
                  )}
                </div>
                <div className="chart-caption mono">
                  <span>DATABASE ACTIVITY</span>
                  <span>REPEATED WORK ↑</span>
                </div>
              </div>
            </div>
            <div className="question-note">
              <span className="note-symbol" aria-hidden="true">
                ?
              </span>
              <div>
                <span className="mono">YOUR FIRST QUESTION</span>
                <p>What work could this system avoid?</p>
              </div>
            </div>
          </section>
        </section>
        <section className="how-section page-width" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">THE APPROACH</span>
            <h2>
              Learn by making
              <br />
              <em>the decisions.</em>
            </h2>
            <p>
              Every scenario starts with a working system and a question. You find the problem,
              defend an idea, and see what happens.
            </p>
          </div>
          <div className="approach-grid">
            <article>
              <h3>Follow the evidence</h3>
              <p>
                Inspect requests, queries, and latency. Build a hypothesis from what the system
                actually does.
              </p>
            </article>
            <article>
              <h3>Make your case</h3>
              <p>
                Map the architecture. Explain your choices and predict the trade-offs before you
                write the code.
              </p>
            </article>
            <article>
              <h3>Put it to the test</h3>
              <p>
                Implement locally. Measure the change, explore a failure, and revisit what you
                thought you knew.
              </p>
            </article>
          </div>
          <div className="learning-loop">
            {stages.map((stage, index) => (
              <span key={stage}>
                {stage}
                {index < stages.length - 1 && <b aria-hidden="true">→</b>}
              </span>
            ))}
          </div>
        </section>
        <section className="scenario-section page-width" id="first-scenario">
          <div className="scenario-illustration" aria-hidden="true">
            <div className="diagram-node">API</div>
            <span>↓</span>
            <div className="diagram-question">What belongs here?</div>
            <span>↓</span>
            <div className="diagram-node">PostgreSQL</div>
            <span className="diagram-caption mono">A SMALL CHANGE. A BIG QUESTION.</span>
          </div>
          <div className="scenario-copy">
            <span className="eyebrow">THE FIRST SCENARIO</span>
            <h2>
              One API.
              <br />
              <em>A lot to uncover.</em>
            </h2>
            <p>
              A product endpoint keeps reading the same data. Investigate the bottleneck, explore
              caching, and discover what an optimization can break.
            </p>
            <div className="tags">
              <span>Node.js</span>
              <span>PostgreSQL</span>
              <span>Caching</span>
            </div>
            <Link className="inline-link" to="/sign-up">
              Find your starting point <span aria-hidden="true">↗</span>
            </Link>
            <span className="availability-note">Learning sessions are in development.</span>
          </div>
        </section>
        <section className="closing-section page-width">
          <span className="eyebrow">BUILD YOUR ENGINEERING INSTINCT</span>
          <h2>
            The next step is
            <br />
            <em>a better question.</em>
          </h2>
          <Link className="button" to="/sign-up">
            Join Thinker <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
      <footer className="site-footer page-width">
        <Brand />
        <p>Engineering reasoning, practiced.</p>
        <span className="mono">BUILT FOR THE CURIOUS.</span>
      </footer>
    </div>
  );
}
