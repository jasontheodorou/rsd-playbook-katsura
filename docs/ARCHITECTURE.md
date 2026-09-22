# Architecture

katsura is one application: a publisher (Payload, at `/admin`), a read model (`published_pages`), and a public site that renders only from that read model. The full plan, with the reasoning, alternatives and the migration dry-run, is in `design-journal/artefacts/2026-09-22-architecture-plan.md`. Decisions are in `design-journal/decisions/`.

## Folders

- `src/app/(public)` reader site. May import from `content-store`, `learning`, `components`, `auth`, `theme`. Must never import Payload or `publishing`. A lint rule enforces this.
- `src/app/(payload)` Payload admin and REST, generated.
- `src/app/api` health check and the jobs trigger.
- `src/publishing` the editorial side: collections, access rules, workflow, snapshot hook.
- `src/content-store` read-model queries (build step 2).
- `src/learning` learner identity and progress (build step 5).
- `src/auth` editorial and reader access seams.
- `src/platform` every host-specific choice, each driven by one environment variable.
- `src/components` the component registry (build step 4).
- `migrations` committed database migrations. Schema never changes any other way.
- `docker` the company-shaped environment: one container, Postgres, MinIO.

## Rules

- The build never needs a database. Payload connects on first use.
- Public routes are `force-dynamic`. No incremental static regeneration, no host cache.
- Nothing reads a host's own variables (no `VERCEL_*`). `SITE_URL` is set explicitly.
- Commits are authored as the identity the Vercel account knows (repo-local git config).
