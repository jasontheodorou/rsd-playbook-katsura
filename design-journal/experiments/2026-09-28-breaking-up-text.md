---
id: exp-2026-09-28-breaking-up-text
type: experiment
date: 2026-09-28
topic: chapter-03-text
tags: [typography, body-text, chapter-03]
status: done
related: [exp-2026-09-28-hhh-photo-options, log-2026-09-28]
---

# Breaking up long text on Head, heart and hands

## Hypothesis

Chapter 03's parts are long runs of body text (Hands has five paragraphs in a row). They can be broken up with patterns the other pages already use, without new layout and without cutting Ian's words.

## Approach

Seven treatments at `/textels`, each on the Hands part: lead and body (first paragraph at statement size), ink and grey (each paragraph opens in ink, continues in grey, as the statement does), highlighter (two or three key phrases get a stroke of the part's tint, drawn on scroll), read more (the last three paragraphs behind a quiet disclosure), three questions (desirability, feasibility and viability as three small cards), sticky note (the pivot paragraph on a tilted note in the part's tint), and together (lead, sticky note and question cards). A first highlighter drew its stroke as a separate box, which could not follow a phrase across a line break and forced the phrase onto a new line; it is now a background that wraps.

## Result

All seven render without console errors. Jason liked the sticky note best and asked for versions with up to three notes. Five arrangements are at `/textels/notes`: one note (the pivot), a pair (focus and pivot, tilted opposite ways), three questions (a cluster of three square notes in three shades of the part's tint), margin notes (two notes in the empty columns right of the text, each beside its paragraph), and a fanned stack (three notes that fan out when pointed at or chosen). He chose the fanned stack and asked for it in at least two places.

## Conclusion

The sticky note works because it borrows the chapter's own sketch rather than adding a new device. As a fanned stack it also hides two of three points until the reader asks, which suits "hide to include". Built as `NoteFan` and used twice on chapter 03: the three core principles (Heart, in red tints) and the three stages, proof of concept, prototype and pilots (Hands, in plum tints), which replace the small accordion. A first version fanned the three key questions instead, splitting Ian's paragraph; Jason preferred the paragraph whole and the stages as notes.
