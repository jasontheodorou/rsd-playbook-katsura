---
id: exp-2026-09-28-different-ideas
type: experiment
date: 2026-09-28
topic: chapters-04-06-distinctive
tags: [ideas, images, text, interaction, chapters-04-06]
status: open
related: [adr-024, log-2026-09-28]
---

# Twenty ideas to make chapters 4 to 6 feel different

## Hypothesis

The last three chapters can feel distinct from pages 1 to 3 through image, text and interactive devices used nowhere else, each acting out an idea from its own content.

## Approach

Twenty live sketches at `/different`, in three groups. Images: polaroid scatter, sketch to real (a drag divider), zoom in and out on scroll, filmstrip, duotone in the part's colour, photo seen through the scribble. Text: big numbers, margin note, hand-drawn circle, words that light up on scroll, question cards, inline definition. Interaction: zoom switch, persona card, put them in order, consequence map, systems map, your turn (a private reflection note), quick poll (placeholder figures), build the wall (draggable notes). Faults found in testing and fixed: grouping the ideas took them off the page grid, collapsing zero-width cards; `<details>` inside a paragraph broke hydration; a React lint rule forbade setting state in an effect, so the saved note is read with an external store.

## Result

All twenty work in the browser with no console errors and no phone overflow. Awaiting Jason's choice.

## Conclusion

Open.
