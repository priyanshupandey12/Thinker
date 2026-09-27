# Thinker project progress

Last updated: 2026-09-27

## Current milestone

Landing page, GitHub sign-up/sign-in, and the main application dashboard.
Both authentication entry pages use the same GitHub OAuth flow, as required by PRD section 9.
The first successful GitHub login creates an account; returning users resume their account.

## Status

| Area | Status | Notes |
| --- | --- | --- |
| TypeScript workspace, API, web, shared contracts | Existing | Initial scaffold present. |
| PostgreSQL and catalog schema | Existing | Compose, migration, seed, and read APIs present. |
| Landing page | Implemented; automated checks passed | Responsive product introduction, learning approach, illustrative scenario preview, and auth links. Visual review pending. |
| Sign-up and sign-in pages | Implemented; automated checks passed | GitHub entry, availability/error states, redirect to dashboard. Real OAuth round trip pending. |
| Authentication backend | Implemented; integration tests passed | Better Auth, Drizzle tables and applied PostgreSQL migration, session identity endpoint, sign-out, trusted origin checks. Real GitHub OAuth round trip pending. |
| Main dashboard | Implemented; render checks passed | Protected overview, real catalog fetch, expandable scenarios, journal placeholder, account and sign-out. Live authenticated browser review pending. |
| Journal persistence | Not started | Empty state only; no fabricated activity or progress. |
| Learning sessions | Not started | Version-pinned sessions and backend stage progression remain next. |
| Architecture design workspace | Not started | Versioned design, reasoning, predictions, and risks. |
| Product API starter repository | Outside this repository | Separate public repository per the PRD. |
| Evaluation worker / sandbox | Not started | Worker scaffold only. |
| AI mentor and failure experiments | Not started | Follow deterministic learning and evaluation implementation. |

## Setup and verification remaining

- Register the local GitHub OAuth callback as `http://localhost:3000/api/auth/callback/github`.
- Complete an actual GitHub authorization, dashboard reload, and sign-out round trip.
- Review desktop and mobile layout, route redirects, refresh persistence, catalog expansion, and sign-out in a browser. Browser automation returned no connected browsers in this session.

## Verification evidence

Verified on 2026-09-27:

- `corepack pnpm lint`: passed.
- `corepack pnpm typecheck`: passed.
- `corepack pnpm build`: web and API production builds passed.
- Test suites: 20 tests passed (2 existing contract tests, 5 auth HTTP boundary tests,
  4 Better Auth integration tests, 7 React server-render checks, and 2 OAuth callback tests).
- Auth tests cover unauthenticated rejection, public-only identity output, error handling,
  configuration availability, GitHub authorization URL and HttpOnly state cookie,
  identity-only scopes, untrusted callback rejection, and cookie-bearing origin checks.
- OAuth integration tests use Better Auth's in-memory adapter with test credentials.
  They do not contact GitHub or prove the PostgreSQL adapter/login callback end to end.
- Live Vite proxy checks: health and auth status returned 200; `/api/v1/me` returned
  401 while signed out; `/sign-up` and `/app` served the application HTML.
- `git diff --check`: passed.
- `corepack pnpm db:generate`: generated migration `0001_grey_carmella_unuscione.sql`.
- `corepack pnpm db:migrate`: applied the authentication migration to PostgreSQL;
  verified `auth_users`, `auth_sessions`, `auth_accounts`, and `auth_verifications` exist.

## Next milestone

Start and resume a learning session from a published scenario version. Implement the
Observe → Question → Hypothesis → Design progression with persisted responses and
backend-enforced requirements. Design revisions must preserve earlier versions.

## Work log

### 2026-09-27

- Prioritized the entry experience following the user's direction.
- Added landing page, GitHub authentication integration, and main dashboard.
- Kept authentication origin/CSRF checks explicitly enabled in every environment.
- Omitted request query strings and redacted response cookies/redirect locations in
  HTTP logs so OAuth codes and session cookies are not recorded.
- Added this tracker and a root `AGENTS.md` instruction so future work maintains it.
- Found GitHub credentials unset locally; no secrets were changed or recorded.
- Docker is not available on the current command path; database verification remains pending.
- Added setup instructions and callback URL to README and `.env.example`.
- Completed automated verification above. Browser visual review and a real GitHub
  login require the remaining setup; they are not marked complete.
- Simplified the landing page following design feedback: removed the navbar, the
  editor/code/decisions tagline, the evidence/reasoning banner, and decorative
  section/card numbers. Removed unused styles and adjusted spacing. All 7 frontend
  render tests, frontend type-check/build, targeted lint, and whitespace checks passed.
- Added a centered floating pill navbar on the landing page with rounded ends,
  a translucent background, subtle shadow, section links, and sign-in/sign-up actions.
  It stays visible on scroll and compacts on mobile. Previously removed taglines and
  numbered labels remain removed. All 7 frontend render tests, frontend type-check/build,
  targeted lint, and whitespace checks passed. Browser visual review remains pending.
- Removed the explanatory trade-offs/reflection line beneath the landing page learning
  journey and its unused CSS rule following user feedback.
- Removed the heading above the hero evidence card and the illustrative-evidence
  caption beneath it, along with their unused styles. Kept the section's accessible label.
- Re-verified the GitHub-only sign-in/sign-up implementation after reviewing the
  credential setup flow. All 18 tests, workspace type-check, lint, production build,
  and `git diff --check` passed. A real OAuth round trip still requires local GitHub
  credentials and a running PostgreSQL instance.
- Confirmed all required authentication settings are present in the ignored local
  `.env` without displaying their values. Repaired a stale Drizzle baseline journal
  record after verifying the complete existing catalog schema, then successfully
  applied and verified the authentication migration. The real GitHub browser round
  trip remains pending.
- Started the local web and API servers after credential setup. Runtime checks returned
  `health=ok` and `githubEnabled=true`; browser authorization and sign-out still require
  the user's GitHub interaction and remain the final OAuth verification.
- Redesigned sign-in and sign-up around a minimal, warm, premium single-card layout.
  Removed the split-screen story, slogans, process decoration, and redundant footer;
  tightened both modes' copy and added a concise repository-access reassurance. All
  7 frontend render tests, frontend type-check/build, full lint, and `git diff --check`
  passed. Live visual review and the real GitHub round trip remain pending.
- Revised authentication again following layout direction: the left column now contains
  only the brand, Sign in/Sign up toggle, mode-specific GitHub button, required states,
  and a short privacy note. The right column is a restrained warm editorial panel with
  one strong heading. Responsive layouts keep authentication first on mobile. All 7
  frontend render tests, frontend type-check/build, full lint, and `git diff --check`
  passed. No browser surface was available for live visual review.
- Refined the auth experience into a conventional modern SaaS pattern: added clear
  mode-specific headings and supporting text, retained the compact segmented toggle
  and single GitHub action, and polished the right brand panel with restrained layered
  color and concise editorial copy. All 7 frontend render tests, frontend type-check/
  build, full lint, and `git diff --check` passed. Live visual review remains pending.
- Preserved the initiating authentication mode when GitHub OAuth is cancelled or fails,
  so sign-up errors return to sign-up and sign-in errors return to sign-in. Added focused
  coverage for both callback URLs and re-ran the workspace verification suite.
