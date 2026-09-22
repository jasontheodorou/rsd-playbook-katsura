---
id: glossary
type: glossary
date: 2026-04-19
topic: knowledge-base
tags: [vocabulary, convention]
status: accepted
---

# Glossary — katsura

Short, unambiguous definitions of project-specific vocabulary. For humans onboarding, and for any AI scanner resolving terms without guessing.

---

## Reference build

The previous attempt at this product, the-rsd-playbook, cloned read-only into `.reference/`. It supplies content and lessons later. Nothing in it is reused as code.

## Edition

One published state of a page, or the draft that will become the next one. In katsura an edition is a Payload version plus a row in the `page_editions` state table that records who created, submitted and published it.

## Read model (published_pages)

The table holding a frozen JSON snapshot of every currently published edition, written at publish time. The public site reads only this table. It is the Whitehall "content store" reduced to one table.

## Four-eyes

The rule that the person who submitted an edition for review cannot be the one who publishes it. Enforced on the publish button, the scheduled-publish job and version restore.

## Component registry

The code module that lists every component type editors can place on a page. Each type has one folder with its schema, its server renderer and an optional client enhancer. Admins can disable a registered type without a deploy; adding a type is a deploy.

## Seam

A point where a host-specific concern (auth, database, storage, jobs, email) is chosen by an environment variable, with a Vercel branch now and an employer-infrastructure branch later.

## Snapshot

The act of writing a page's published edition into the read model, inside the same database transaction as the publish so a failed publish leaves nothing behind.

