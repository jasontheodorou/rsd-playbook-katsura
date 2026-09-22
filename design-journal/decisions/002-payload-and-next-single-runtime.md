---
id: adr-002
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 002. Payload 3 on Next.js as publisher and runtime, kept from the reference, used server-first

## Context

The reference scaffolded Payload 3 as a separate CMS next to a Vite single-page app. The brief needs drafts, versions, roles, scheduled publishing, blocks composition, uploads, jobs and email, all self-hostable.

## Decision

Keep Payload 3 and Postgres. Drop the Vite app and run the public site inside the same Next.js process, server-rendered, Node runtime only, `output: 'standalone'`, no edge runtime, no `next/image` loader, no incremental static regeneration.

## Why

A custom publisher would take weeks for a team of five. Directus fights a blocks-and-workflow model; Strapi's versioning is enterprise-only; Keystone has no versions; Sanity and Contentful cannot be self-hosted. Payload gives all of it on plain Postgres under an MIT licence. Next is the price of Payload 3; using it server-first is what makes "core content works without JavaScript" achievable.

## Consequences

Payload's schema shape and admin become the editors' daily tool; leaving means an export and a new admin. Next.js release churn (middleware becoming proxy, caching changes) must be managed by pinning versions. Lexical JSON is the one real content-format lock-in, mitigated by rendering HTML into the read model and keeping an export script.
