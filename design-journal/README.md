---
id: design-journal-readme
type: glossary
date: 2026-04-19
topic: knowledge-base
tags: [convention, overview]
status: accepted
---

# Design journal — katsura

A plain-English record of this project.

## Structure

- **`logbook/`** — one entry per session, chronological prose. Blow-by-blow account of what we talked about, what we decided, and why. _Gitignored by default — private to the team._
- **`weekly/`** — Monday roll-ups. Bulleted summary of core insights, decisions, and improvements. _Gitignored by default._
- **`decisions/`** — lightweight ADR-style records of each real architectural call. One file per decision, numbered `NNN-short-slug.md`. _Public; shipped to GitHub._
- **`training-manual.md`** — codified lessons, insights, techniques, and patterns for other designers. Timeless, audience-facing. _Public; shipped to GitHub._

## How it's kept up to date

- **Per-session:** a Stop hook (configured in `../.claude/settings.json`) appends today's logbook entry automatically at the end of each Claude Code session. Same run also lifts anything genuinely generalisable into the training manual, and adds a decision file if a real architectural call was made.
- **Weekly:** a scheduled launchd job runs every Monday morning to roll the week's logbook into a weekly digest and perform light housekeeping on the training manual.
- **Logs:** `.hook.log` and `.weekly.log` in this directory capture any errors without blocking you.
