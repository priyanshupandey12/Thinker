# Thinker

Thinker is an engineering-reasoning platform built as a TypeScript modular monolith.

See [project progress](docs/PROGRESS.md) for implementation status, verification, and next steps.

## Workspace

- `apps/web` — React and Vite frontend.
- `apps/api` — Express API plus a separate worker entry point.
- `packages/contracts` — public Zod API contracts shared by web and API.
- `infra/compose.yaml` — local PostgreSQL service.
- `docs` — product, API, database, and system design documents.

The learner-facing Product API is intentionally not part of this repository. It will live in a
separate public repository that learners can fork. Hidden evaluator logic stays private.

## Local development

1. Copy `.env.example` to `.env` and fill in the GitHub OAuth values when authentication is used.
2. Start PostgreSQL with `docker compose -f infra/compose.yaml up -d`.
3. Install dependencies with `corepack pnpm install`.
4. Generate and apply migrations with `corepack pnpm db:generate` and
   `corepack pnpm db:migrate`.
5. Seed the initial catalog with `corepack pnpm db:seed`.
6. Start the API and web application with `corepack pnpm dev`.

The web application runs at `http://localhost:5173` and proxies `/api` to the API at
`http://localhost:3000`.

## GitHub sign-in setup

The landing page is `/`, sign-in is `/sign-in`, sign-up is `/sign-up`, and the protected
workspace is `/app`. Both sign-up and sign-in use GitHub through Better Auth.

1. Create a GitHub OAuth app with homepage `http://localhost:5173` and authorization
   callback `http://localhost:3000/api/auth/callback/github`.
2. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and a random `BETTER_AUTH_SECRET`
   of at least 32 characters in `.env`. Keep these values private.
3. Apply migrations with `corepack pnpm db:migrate`, then restart the API.
4. Use **Continue with GitHub**. New users get an account automatically; returning
   users sign in to their existing account. Sign out from `/app/account`.

Without credentials, the public site remains available and sign-in shows a setup-pending
message. Production must use HTTPS, a matching `APP_ORIGIN` and `BETTER_AUTH_URL`, and
route `/api` to the API under the frontend origin (as the Vite proxy does locally).

Integration reference: [Better Auth Express integration](https://better-auth.com/docs/integrations/express).
