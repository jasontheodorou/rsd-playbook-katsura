---
id: adr-029
type: decision
date: 2026-10-01
topic: how-we-think
tags: [data-path, chapter-04, component, grid]
status: accepted
related: [log-2026-10-01, adr-028]
---

# 029: The data path is rebuilt on the dot grid

## Context

The first data path (30 September) was liked and went on How we think, but its drawing was laid out in a stretched 100 by 60 drawing. Its labels sat at different heights under their stops, the bubble needed a 112px band of its own, and the white half had a large empty area under the words. Jason asked for it to be recreated from scratch, to make best use of the space on each side, and to line up vertically and horizontally, keeping the dots.

## Decision

Replace it with a new component, built at first as `DataPathNew` beside the old one on `/datapattern`, and now `components/DataPath.tsx` (`.dpn`). The card splits on page column 8's line. The browser lays the drawing out in pixels: the gap between stops and every row are whole steps of the dot grid, the dot grid is moved so a dot sits under every stop, and the drawing is centred by its drawn edges. The labels share one line along the bottom, each directly under its stop. Two lines cross both halves: the top inset line (bubble, highest stop, title) and the bottom inset line (labels, count).

## Why

The dot grid gave the drawing a visible grid to snap to, so alignment could be exact rather than judged by eye. Moving the bubble into the empty top left, which a rising line leaves free, used space that the old band wasted. Putting the count on the bottom line used the white half's empty area without adding anything new. Jason approved it ("That's great") and asked for it on the page.

## Consequences

- The old DataPath and its styles were deleted, and `/datapattern` shows only the new card.
- The page checker measures the block from `.dpn`.
- On phones the halves stack and the drawing keeps an 88px band for the bubble, so the stacked card is 640px tall at 390px (486px before). There, "Frameworks" is wider than its slot and sits 5px from "sketches".
