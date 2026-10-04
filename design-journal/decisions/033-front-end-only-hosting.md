---
id: adr-033
type: decision
date: 2026-10-04
topic: hosting
tags: [vercel, progress, cookie, portability, seams]
status: accepted
related: [adr-004, adr-005, adr-007, log-2026-10-04]
---

# 033: Host the reader-facing site first, without a database

## Context

Jason wanted Foundations, Shape your practice and every page readers see and interact with on Vercel now, with the database (Neon), media bucket (R2) and editorial publisher held over. Shape your practice already keeps progress in the browser. Foundations read and wrote chapter completions in Postgres on every request (decision 005), so it could not run without a database.

## Decision

A new seam, `PROGRESS_STORE`, chooses where reading progress lives. `database` (the default) keeps decision 005 unchanged. `cookie` keeps the list of completed chapters in a signed, HttpOnly cookie on the reader's device (`katsura_progress`, signed with `LEARNER_COOKIE_SECRET`). "Forget my progress" clears it. The code is in `src/learning/cookie-progress.ts`; the reader and the two progress routes branch on the seam.

The front-end-only deployment sets `PROGRESS_STORE=cookie`, `LEARNER_COOKIE_SECRET`, `PAYLOAD_SECRET` and `SITE_URL`, and nothing else. The build command stays `npm run build`, with no migrations.

## Consequences

- A production build with no database settings succeeded, and every page loaded. Marking a chapter read showed "1 of 6 read" and forgetting set it back to 0.
- Progress no longer follows a reader between devices, and is lost if they clear cookies. It never did follow them across devices, as the learner was always anonymous.
- `/admin`, `/api/*` and `/api/health` still exist in the build and will fail if visited, because there is no database.
- Reader access by passphrase (`READER_ACCESS`) is not built yet, so the site is public to anyone with the address. The source code is already public on GitHub.
- Switching to the full set-up later is a change of environment variables: `PROGRESS_STORE=database` plus the Neon strings. Cookie progress is not carried over.
