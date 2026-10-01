---
id: exp-2026-09-29-data-section-options
type: experiment
date: 2026-09-29
topic: data-driven-decision-making
tags: [how-we-think, data, charts, options, chapter-04]
status: active
related: [log-2026-09-29]
---

# Showing data-driven decision-making with data: options at /data

## Hypothesis

The section is dull because it describes data visualisation in prose next to a stock photo. Showing a small chart the reader can use will make its point better than the words do.

## Approach

Four options at `/data`, on example data for one made-up measure (the share of online applications completed), each labelled "Example data":

- 01 One chart in three steps: the three list items become steps of one chart (raw dots, then the baseline and line, then a sketched range). Control on a pale blue side, chart on white.
- 02 Same data, two ways: a table of monthly figures switches to a bar chart of the same numbers.
- 03 Measure from the start: the baseline draws itself, then each month after the change rises above it on scroll, with the gain counted.
- 04 Hand-drawn chart: an ink chart with handwritten labels on paper with the pale blue plane, drawn in once, in place of the photo.

## Result

All four work at 1440 and 390px with no overflow or console errors, and reduced motion shows each finished state. Faults fixed on the way: bars that started at 40% instead of zero, labels clashing with dots and lines, the first bar over the axis labels, and chart text too small on phones. #3f7894 failed the palette check's chroma floor (it reads as grey); #2f77a6 passed.

## Conclusion

Awaiting Jason's choice. Open for sign-off: the step order in 01 (baselines before future sketches, the reverse of the source list) and every caption, which is new copy.

## Update: option 04 abandoned

Option 04 (the hand-drawn chart, then "enrich the client's data") went through about ten rounds: pointer reading with a pencil loop, a switch adding evidence layers, drag-and-drop cards, a third overlay (benchmark), a refined two-zone card, a one-column hybrid, and finally a minimal version with one card and four notes in both ink and refined styles. Jason called the last one "it just doesn't work" and asked for the approach to be abandoned. The component, its styles and its entry on /data were removed; options 01 to 03 remain. What failed, as far as can be told: an invented service story, several competing prompts, a drag that did nothing a click did not, and a chart that read as a dashboard in a manual that elsewhere teaches through diagrams and photos. The drag-evidence-onto-data idea should not be tried again for this section.
