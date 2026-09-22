---
id: adr-005
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 005. Learner progress is server-side from day one, keyed by content identity, with an anonymous learner that can later be merged into an identity

## Context

Readers are anonymous on Vercel and identified by the employer gate later. The reference kept progress in localStorage and lost it on every device or browser change.

## Decision

An opaque learner id in an HttpOnly cookie signed with its own secret, set only on an explicit action (mark complete, answer a check, opt in), never on a passive visit. Progress events keyed by page id and block key, both stable across republishes, plus a content hash so rewritten questions can invalidate stale completions. Derived state is computed, not stored. On identification, a young cookie learner is merged in one guarded transaction; an older one prompts first.

## Why

Server-side storage means nothing in the page, block or component model changes when identity arrives. Explicit-action cookies avoid a consent problem. Content-identity keys survive editing; edition keys would not.

## Consequences

Anonymous progress is lost if the hostname changes at cutover unless an email-linking feature is built first; accepted for now. Once identity-backed this is employee learning data: purpose notice, clear-my-progress action, retention period, and a DPIA citing ICO worker-monitoring guidance are required. The cookie secret must be treated like a database credential.
