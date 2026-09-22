---
id: adr-007
type: decision
date: 2026-09-22
topic: hosting
tags: [adr, vercel, free-tier, hosting]
status: accepted
related: [adr-004, artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 007. Build for the Vercel free tier, using no Vercel-specific features at all

## Context

Jason has no knowledge of the company's authentication or hosting systems, wants the stack as light as possible, and will host on Vercel's free (Hobby) tier until the move to company infrastructure.

## Decision

The first build uses exactly three outside services, all on free tiers: Vercel for hosting, Neon for Postgres, Cloudflare R2 for files. No email service. Timed tasks (scheduled publishing) are triggered by a GitHub Actions workflow calling the app's jobs endpoint every 5 minutes, not by Vercel cron. Preview deployments are switched off so only the main branch touches the database. Publish requests are shown in the admin rather than emailed.

## Why

Vercel Hobby cron runs once a day, which is useless for scheduled publishing; an external caller is free, portable and works unchanged on the company's side. Hobby projects are single-member and their terms are for personal use, so the less the app depends on Vercel the less it matters if that changes. Dropping email removes an account to create, secure and migrate.

## Consequences

Nothing Vercel-specific remains in code or config. Scheduled publishing resolves to within a few minutes rather than to the second. A first page after a quiet spell is slower while the free database wakes. Vercel's non-commercial terms remain a risk to confirm; the fix if challenged is a single paid seat or an earlier move, with no code change. Every commit must be authored with the identity Vercel's account knows.
