# Thinker

Thinker is an engineering-reasoning platform built as a TypeScript modular monolith.

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

