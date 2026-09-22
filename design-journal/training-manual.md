---
id: training-manual
type: manual
date: 2026-04-19
topic: knowledge-base
tags: [lessons, insights, techniques, patterns]
status: accepted
---

# Training Manual — katsura

A codified knowledge base for designers joining this project or anyone at Transform UK building related tooling. Written incrementally as the project unfolds. The goal: a new designer should be able to pick up the craft from this document without reading the logbook.

## How to read this manual

Entries fall into four shapes. The shape tells you how to use it:

- **Lesson** — a principle learned the hard way (or near-miss prevented). If you take nothing else from an entry, take this.
- **Insight** — a conceptual framing that unlocks a problem. Often short; the value is in the reframe, not the length.
- **Technique** — a how-to. Step-by-step, or a decision heuristic.
- **Pattern** — a reusable structural template. Architectural, or about how to model a kind of problem.

Each entry is timeless: it should still make sense without the context of the session it came from. Entries are grouped by **topic**. New entries are added to an existing topic where possible; new topics appear only when genuinely new ground is covered.

---

## Publishing systems

### Lesson: workflow state does not belong inside a versioned document

When a content system keeps every save as a version and writes the live record only on publish, any state you stamp into the document inherits those rules. A "withdrawn" flag stamped into the document needs a publish to take effect, and a hook trying to record "who started this edition" cannot see the difference between the first draft save and the fiftieth, because the original document it compares against stays frozen at the last publish. Keep workflow metadata (state, author, submitter, publisher, schedule) in its own small table keyed by page, and let the versioned document hold content only. The tell that you are getting this wrong: a state change that should be instant requires an editorial action.

### Technique: enforce a publishing rule on every path that publishes

A rule like "the submitter cannot publish" is easy to attach to the publish button and easy to forget elsewhere. List every route to a published state before writing the rule: the button, a scheduled job that runs later with no user attached, restoring an old version, an import script. Write one test per path. If a path runs without a user, record who scheduled it and check that person instead.

## Portability

### Pattern: run the destination architecture as the daily environment

When a system will move hosts, make the future host's shape the default development environment from day one (a container, a plain database, an object store, a stub for the upstream identity gate) and treat the current host as the special case exercised by CI. Every convenience of the current host then shows up immediately as a difference between "works locally" and "works on the host", when it is cheap to fix, instead of on cutover day. The corollary: any feature that only exists on the current host goes behind a seam selected by an environment variable, and the seam has a working local branch before the hosted one.

## Tooling

### Lesson: a scaffold is a starting point, not a foundation

The official Payload scaffold shipped a lint config that crashed under the Next version it installed, a compose file for the wrong database, a Dockerfile for a different package manager, and a homepage that imported the CMS into the public site. Every generated file was read and either rewritten or deleted before the first commit. Budget for that; do not commit a scaffold as-is and plan to tidy later.

### Technique: a local database without Docker or admin rights

Where Docker cannot be installed, the `embedded-postgres` package downloads real Postgres binaries into the project and starts them on a spare port with one script. Data lives in a gitignored folder. The company-shaped container environment then runs in CI instead of on the laptop, which is where it needs to be trusted anyway.

## Databases

### Lesson: a thrown error inside a transaction can leak the connection

Payload opens a transaction per operation. When an operation throws part-way (here, the job runner before its collection existed), the `begin` is never followed by a commit or rollback and the connection sits "idle in transaction" until the process dies. Four of those exhausted a pool of five and every later write hung with no error while reads still worked. When writes hang but reads work, query `pg_stat_activity` for idle-in-transaction sessions before suspecting the new code. Keep the pool small so this surfaces early.

## Learning design

### Pattern: show completion by completing the picture

For a set of things to read, draw each one's mark as an outline and fill it solid when done. The grid becomes its own progress record, needs no ticks or badges, and the reward is the finished picture. Pair the visual with a non-visual cue (a word in the corner, a count in text) so the state never rests on shape or colour alone, and render the resting state on the server so it holds with no JavaScript.
