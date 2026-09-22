---
id: adr-001
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 001. One application, with the Whitehall boundaries as code modules and a read-model table

## Context

GOV.UK Whitehall separates Publisher, Publishing API, Content Store and Frontend. Katsura has 2 to 5 editors, under 100 pages and under 1,000 readers a month, and must move hosts in about 18 months.

## Decision

Build one deployable application. Keep the publisher, the content store and the public site as separate code modules inside it. The content store is a table, `published_pages`, holding a frozen JSON snapshot of each published edition. The public renderer may import only from the read model, enforced by a lint rule on import paths.

## Why

Separation buys independent scaling, multiple publishing apps and team decoupling. None apply at this scale. It costs a second deploy, a second auth surface, a sync mechanism that can fail, and cross-origin preview plumbing (which the reference build never finished). The read-model table gives the one property that matters, drafts cannot reach readers, without the operational cost.

## Consequences

Publisher bugs share a blast radius with the reader site. A later split is possible only if the import boundary is enforced from day one. `published_pages` becomes the payload of a publishing API if that day comes.
