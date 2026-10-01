---
id: adr-030
type: decision
date: 2026-10-01
topic: what-we-care-about
tags: [voices, chapter-05, component, prompt]
status: accepted
related: [log-2026-10-01, adr-029]
---

# 030: The voices card becomes the Turntable

## Context

What we care about showed its two user quotes side by side in a tinted card, labelled "In their words", as a first draft. Jason asked for a way to explore two people's quotes using two simple sketches, with a slight 3D move from one person to the other. Five treatments were built on `/quotes` and four flourishes on `/quotes/flourish`.

## Decision

Replace the old card with the Turntable, sketched in then highlighted (`components/Voices.tsx`, `voices.css`, `.qv`). The two people stand on a turning floor and the one at the front speaks; their lines are drawn in, then a few of their words are highlighted in yellow. The drawing is the only control. A yellow message box with no tail, "Alternate between the users to hear their stories", and a blue pulse on the first person's jumper show until the first move (Prompt memory, key `voices`). The `voices` block now takes each voice's sketch and quote, with optional `look` and `flourish`.

## Why

Jason approved it ("It's great") and asked for it on the page. The sketches give the quotes a person to belong to without photographs, and one quote at a time gives each one weight.

## Consequences

- The old Voices card and its styles were deleted, and the "In their words" label went with them.
- `/quotes` and `/quotes/flourish` now use the chapter's component, so changes show on both.
- The page checker measures the block from `.qv`.
- Which quote goes with which drawing is still a guess awaiting sign-off.
- On phones the message box covers part of the jumper and pulse; at 1024px it touches the shoulder's end.
