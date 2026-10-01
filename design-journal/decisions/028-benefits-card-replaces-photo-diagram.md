---
id: adr-028
type: decision
date: 2026-09-30
topic: why-design-matters
tags: [photo-diagram, benefits-card, chapter-02, component]
status: accepted
related: [log-2026-09-29, log-2026-09-30, adr-027]
---

# 028: The benefits card replaces the photo diagram on Why design matters

## Context

Jason had gone off the photo diagram: it looked cheap and bodged together, read as a plain white box, and did not make clear that anything could be clicked. Its first-view pulse was remembered in the browser, so he had not seen it since his first visit. Rounds on `/refine` (five looks, then Hairline and five elevations, then "Raised, with a prompt", then layout changes) were built as CSS overrides on PhotoDiagram, which left offsets tuned by eye.

## Decision

Rebuild it as its own component, `components/BenefitsCard.tsx` with `benefits-card.css`, and render it for the `diagram` block when its items carry photos. PhotoDiagram stays in the code only for the `/refine` comparisons.

## Why

A fresh component could take every size from the 8px scale and place the five items on a regular pentagon that centres itself, instead of carrying measured nudges. Jason approved the rebuild ("You did it. Great work.") and asked for it on the page.

## Consequences

- The block's `title` is now the yellow speech bubble's words ("Explore the root elements of good design"); `emptyTitle` and `emptyBody` feed the reading's rest state. The `washes` field is no longer used by this block.
- The prompt and pulses show on every visit until the first choice, not once per browser, as on the Design Landscape.
- The page checker passes at 1440 and 1024px. Chapter 02's balance sliders have not been restyled to match yet.
