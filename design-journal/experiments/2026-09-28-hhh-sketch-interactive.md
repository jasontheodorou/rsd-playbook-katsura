---
id: exp-2026-09-28-hhh-sketch-interactive
type: experiment
date: 2026-09-28
topic: head-heart-hands-sketch
tags: [illustration, interaction, motion, chapter-03]
status: done
related: [log-2026-09-28]
---

# Making the head, heart and hands sketch interactive

## Hypothesis

The original build's sketch (three posters pinned to a wall with sticky notes) can become the chapter's interactive moment if each poster can move on its own, without redrawing it.

## Approach

The sketch is a transparent PNG, not an SVG. It was cut into ten pieces by finding each connected shape in its alpha channel: three posters and seven sticky notes (the note stuck to the head poster's corner stays part of it). The pieces sit in `public/illustrations/hhh` with percentage positions in `src/app/(public)/hhh/pieces.ts`, and rebuild the drawing exactly (checked pixel by pixel). A first cut failed: faint shading around the drawing joined far-apart pieces, so the cut was redone from a slightly thickened outline of each shape. Four versions at `/hhh`: lift and read, turn it over, pinned as you arrive, depth and colour. Each shows the manual's one-line definition for the chosen part.

## Result

All four work with pointer, keyboard and reduced motion, with no console errors. Jason chose version 3, pinned as you arrive, without the caption and without the replay button.

## Conclusion

The sketch works as the chapter's interactive moment when it builds itself on arrival and responds to pointing with a small physical swing. Words are not needed on it: the stacking cards straight after carry the definitions. Built as the `hhhWall` block on chapter 03, in place of the still illustration.
