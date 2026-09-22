---
id: adr-004
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 004. Every host-specific concern sits behind an environment-driven seam, and local development runs the after-migration shape

## Context

Vercel now, employer-run infrastructure behind an organisation-wide login in about 18 months. Portability outranks convenience.

## Decision

Auth, reader access, database, media storage, background jobs, email and site URL are each selected by an environment variable with a now-branch and a later-branch. Vercel-proprietary features are avoided outright (Postgres, Blob, KV, edge middleware, image loader, analytics) except cron, which is a trigger for a portable jobs endpoint. Local development runs Docker Compose with Postgres, MinIO, the app container and a proxy stub that injects an identity header. Vercel is the special case, exercised by CI.

## Why

If the destination shape is the daily environment, cutover is an env swap rehearsed hundreds of times. The alternative, discovering serverless assumptions at migration, is the uncomfortable outcome the brief asks to design away.

## Consequences

Slightly more setup on day one. Some conveniences given up: request bodies over 4.5 MB on Vercel force direct-to-bucket uploads; scheduled publishing needs a Vercel Pro cron or an external pinger; `next build` must never open a database connection.
