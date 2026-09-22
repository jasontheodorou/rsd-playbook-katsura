---
id: overview-katsura
type: overview
project: katsura
status: active
last-updated: 2026-09-22
---

# katsura: Overview

**One-sentence description:** An immersive, self-paced design manual for Transform UK designers, with an editorial publisher behind it modelled on GOV.UK Whitehall Publisher.

## Current state

Architecture agreed on 2026-09-22 (see `artefacts/2026-09-22-architecture-plan.md` and decisions 001 to 007). Build step 1 (foundations) done the same day: Payload 3 on Next 16 skeleton, platform seams, users and media, health and jobs endpoints, first migration, Dockerfile and compose, CI and scheduler workflows. Local dev uses a downloaded Postgres (`npm run db:local`) because Docker cannot be installed here. The reference build is cloned read-only at `.reference/` (gitignored).

## Active goals

- Finish step 1 hosting: GitHub repo, Neon database, Cloudflare R2 bucket, Vercel project (preview deploys off, build runs migrations), scheduler variable and secret.
- Build phase 2 (publisher spike): pages with drafts and versions, `page_editions` state table, three roles, four-eyes rule, `published_pages` snapshot, public and preview routes, draft-leak test.

## Key constraints

- Vercel free (Hobby) tier now; employer infrastructure behind one organisation-wide login in about 18 months. Portability outranks convenience. Company auth system entirely unknown; the app must consume an upstream identity, never own login.
- Keep the stack as light as possible and in mainstream, fluid-to-integrate systems (TypeScript, Node, React, Postgres, S3-style bucket).
- Nothing Vercel-proprietary in application code. Every host concern behind an environment seam. Local dev runs the after-migration shape.
- Core content must work without JavaScript. Content is structured data, not markup.
- Four-eyes: the submitter of an edition cannot publish it.
- Scale: 2 to 5 editors, under 100 pages, under 1,000 readers a month, staff-only readers after migration.

## Stakeholders

- Jason Theodorou: owner, designer, builder.
- A small editorial team (2 to 5) at Transform UK: editors, reviewers, admins.
- Employer platform team (later): owns the auth gate and hosting. Gate technology and hostname continuity are open questions.

## Stack / environment

- Runs on `localhost:3019`
- Project directory: `/Users/jason.theodorou/projects/katsura`
- Payload 3 on Next.js (server-first, Node runtime, standalone output), Postgres 16, S3-compatible object storage, Payload jobs queue, Mantine v7 (provisional, pending brand session), zod, TypeScript, npm.

---

**Note to Claude:** this file is injected into every session as persistent project memory. Keep it concise, one screen. Update it whenever the project state changes meaningfully (new goal, phase change, stakeholder shift). Detail belongs in the logbook, decisions, experiments.
