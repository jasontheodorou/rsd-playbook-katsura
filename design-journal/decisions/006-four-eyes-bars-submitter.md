---
id: adr-006
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 006. The four-eyes rule bars the person who submitted the edition from publishing it

## Context

The brief says the author of an edition cannot publish it. Three readings were offered: the edition's creator, anyone who saved a version, or the submitter.

## Decision

Jason chose the submitter. The person who moved an edition to submitted cannot publish or schedule it. No admin override; a second admin can publish. Enforced on the publish button, the scheduled-publish job and version restore.

## Why

With 2 to 5 people the strictest reading would block publishing routinely. The submitter is a clear, auditable act.

## Consequences

Known and accepted gap: an edition's creator can publish it if a colleague submits it. The edition author is still recorded and shown in the audit log so the pattern is visible. Tightening to creator-or-submitter later is a one-line change in the four-eyes module.
