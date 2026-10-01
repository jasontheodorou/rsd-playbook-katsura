---
id: adr-031
type: decision
date: 2026-10-01
topic: how-we-tell-stories
tags: [stories, chapter-05, component, prompt, panels]
status: accepted
related: [log-2026-10-01, adr-030]
---

# 031: Story panels replace the sticky notes in "How our designers tell stories"

## Context

The three ways our designers tell stories (Storytelling; Visualisation & storytelling; Visual storytelling) sat in a fanned stack of sticky notes inside the part. Jason found it read like "some random text" and asked for a pattern that takes more space and puts each way's words over or beside a photograph. Four options were built on `/stories`: Panels, Photo and list, Scroll story and Wide photograph.

## Decision

Jason chose Panels, with the usual message box and blue pulse. It is a new block kind, `stories` (`components/Stories.tsx` with `look="panels"`, `stories.css`, `.st`), on page columns 2 to 11 (the voices card's width; first built on 2 to 12, which Jason found too long), after the part's lead-in "Our designers tell these stories in three ways:". Three photographs sit side by side, 8px apart, 4px corners. The open one takes 3.4 shares of the width (2.6 below 1280px) and shows its words on a frosted white card at its bottom left; the closed ones show their number and name on a small frosted tag. Pointing at a photograph (mouse), clicking or focusing it opens it; arrow keys, Home and End move along. The prompt is the yellow message box with no tail, "Hover over a photo to see each way we tell stories", at the open photograph's top left, and the Design Landscape's pulse in the middle of each closed photograph in turn, 0.35 seconds apart, every 5 seconds. Both go the first time the reader opens another photograph (Prompt memory, key `stories`).

## Why

It holds the full width with the page's own photographs, so it reads as a significant component, and the words stay with the picture they belong to. Panels show at a glance that there are three things to explore.

## Consequences

The part no longer carries a `fan`. Below 1024px the panels stack, each 440px tall with its card showing, and the prompt is hidden. The other three looks stay on `/stories` for comparison. The prompt's words and the three photographs and their alt text are new and await sign-off. Without JavaScript only the first photograph's words are visible; the other two are in the page but hidden.
