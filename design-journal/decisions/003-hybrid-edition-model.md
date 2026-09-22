---
id: adr-003
type: decision
date: 2026-09-22
topic: architecture
tags: [adr, architecture]
status: accepted
related: [artefact-2026-09-22-architecture-plan, log-2026-09-22]
---

# 003. Editions are Payload versions plus a page_editions state table

## Context

The brief requires editions: every save a new version, published content immutable until superseded, full history, states draft to submitted to published, scheduled publishing, withdrawal with redirects, and a four-eyes rule.

## Decision

Payload's drafts and versions (unlimited history) hold content and save history. A separate `page_editions` table holds workflow metadata: edition number, state, author, submitter, publisher, schedule, change note, published version id. Withdraw and reinstate are custom endpoints that update `page_editions` and `published_pages`, never versions. Payload's built-in Unpublish is hidden.

## Why

Review of the first draft showed workflow state cannot live inside the versioned document. Payload writes the main row only on publish, so a withdrawn flag would itself need a publish and trip four-eyes. A before-change hook cannot tell the first draft save from later ones because the original document stays at the published row. A full "editions as their own collection" model (Option B) would fix this but cost editors autosave, live preview and a one-click restore.

## Consequences

Two stores must agree; a nightly reconciliation job checks snapshot version ids. Four-eyes must be enforced on three publish paths: the button, the scheduled job, and version restore. Anonymous REST reads must filter to published status or never-published pages leak as drafts.
