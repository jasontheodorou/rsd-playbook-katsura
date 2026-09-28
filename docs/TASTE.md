---
id: taste
type: reference
date: 2026-09-28
topic: design-taste
tags: [design, taste, process, layout, spacing, motion, interaction, content]
status: active
related: [doctrine]
---

# Design and taste criteria

What Jason approves and rejects, written as rules that can be followed without him in the room. Distilled from building the RSD Playbook's Foundations pages in katsura (22 to 28 September 2026): the Who we are gold standard, Why design matters, and Head, heart and hands, with every choice, rejection and approval along the way.

This file is about judgement. `DOCTRINE.md` says how an app is built, and the Valencia skill says what the brand looks like. A project's own rules file (in katsura, `docs/DESIGN-RULES.md`) holds its exact tokens and patterns, and overrides this file where the two differ.

Use it three ways:

- **Before designing:** read sections 1 and 2.
- **While designing:** use sections 3 to 9 to make each choice.
- **Before showing Jason anything:** run the checklist in section 11.

---

## 1. The working loop

These rules decide how work happens. Most rejected work in this project came from breaking one of them, not from bad taste.

1. **Show options as live pages, not descriptions.** When Jason asks "any ideas" or "try some versions", build three to seven numbered options on a sub-URL (such as `/hhh`, `/textels`), inside the real page frame and with the real content. Give each a one-line rule saying what it does. He chooses by looking. Every option page from this project was chosen from within minutes.
2. **Keep every option comparable.** Each option uses the same content (the same passage, the same part), so only the treatment differs.
3. **Build the minimum described.** "Simple" and "minimal" mean exactly the layout described. Extras are rejected as "too much" or "too busy". Add one idea at a time and let him ask for more.
4. **Refine, do not redesign.** Keep what was approved and change the one thing named. If patches keep missing, stop and rebuild from the grid rather than add another offset.
5. **Treat an approved component's size as fixed.** To add something (a photo, a title), re-lay the inside within the old footprint. Stacking new content on top makes it "too big".
6. **Measure before reporting.** After every visual change, render it and look: 1440px, 1024px and 390px at least. Measure the edges and gaps that changed, in pixels. Never judge by reading CSS. Test interactions in the browser: hover, click, reload, and reduced motion.
7. **Read the screenshot he points to.** "See the screenshot on desktop" means the newest image in `~/Desktop`. Read it before answering, and name what it shows.
8. **Only an explicit choice is approval.** "Launch it", "show me" or "open it" mean show the current state. They do not approve a proposal that is still open.
9. **Say what you took an ambiguous word to mean, then act.** If a request is unclear ("the navigator", "the text to follow"), take the most likely reading, state it in one line, and build it. If he corrects you, switch without argument.
10. **Keep every record in step with the build.** When the page changes, update the rules file, the journal and any source-tracking tool (such as the manual explorer) in the same turn. Back up data files before editing them. Rebuild records from what is actually rendered, not from memory.
11. **Commit and push only when asked.** Then check first (type check, lint, the page checker, the pre-ship check) and report the commit.

## 2. The core of the taste

- **Calm, warm and restrained, but never dull.** Warm paper, quiet tints, one accent. "Tone it down" has a floor: strip loud colour, then add back quiet depth (a soft wash, a hairline, a lift) so it does not go flat.
- **Refined means "chic 2026".** Frosted or tinted surfaces, hairlines instead of borders, soft washes, a deep muted accent for the chosen state only, light line icons in ink. No glows, no bounce, no lines through words.
- **Strict alignment.** One grid shared by the top bar and every page. Every edge on a grid line. Nothing nudged off its line for effect.
- **One column, top to bottom.** Pages read like GOV.UK: each element follows the one before. A pattern may put things side by side inside its own frame, but the page never splits into columns for decoration.
- **Space and tint separate things, never rules.** No horizontal hairline rules anywhere.
- **Each page is a little unique.** Pages share the frame, grid, type and spacing, but not their block order. Each page gets its own signature element, ideally drawn from its own imagery (chapter 03 borrowed its sticky notes, pins and scribbles from its own sketch).
- **Liveliness comes from the content's own world.** When a page feels dry, borrow shapes, colours and textures already on the page (its illustration, its photos) before inventing new devices. New devices feel jarring; borrowed ones feel designed.
- **Hide to include.** Everything the source says must be there, but not all at once. Secondary content sits behind the reader's choice: a tab, an accordion, a diagram, a fanned stack, a quote behind a photo. It stays in the page for screen readers and works without JavaScript.

## 3. Grid and alignment

- A 12-column grid on one shared container (`--container`, `--gutter`, `--grid-gap`). Column 1 is a rail (chapter number and progress). Content sits on the other 11 columns as a subgrid, so children snap to the same lines.
- Reading text sits on columns 2 to 9 with its measure set in ems (about 65 to 70 characters a line). Wide patterns use columns 2 to 12, or 2 to 11 for compact ones.
- Inside a card, text keeps a single inset from the card's edge, the same on every side (in the photo diagram: 8px inset plus 32px padding, so 40px). Titles and counters in neighbouring zones share a top line; bottom elements share a bottom line.
- Centre a drawing by what is drawn, not by its box. Measure the visible parts (tiles, labels) and make the space above equal the space below.
- Decorative offsets are one grid gap, such as a photo's coloured plane.
- Use the whole width on desktop. Empty space beyond the grid is dead space.

## 4. Vertical spacing

- Every gap is a multiple of 8px and has one owner: the `margin-top` of the element below.
- Gaps grow with the relationship. In katsura: 32 between paragraphs, 48 from title to statement, 64 between blocks (the same above and below every image and component), and 96 from the top of the page.
- Equal relationships get equal gaps. A component has the same space above and below it, even after a lead-in ending in a colon.
- Measure what the eye sees. Text runs from cap height to baseline (`text-box: trim-both cap alphabetic`), and anything painted runs to its painted edge. Measure an animated element from a still wrapper, because it may not have arrived yet.
- A spacing overlay with named gaps (V1, V2 and so on) is how Jason refers to spacing. Keep it until the page is signed off.

## 5. Type and colour

- One typeface (Open Sans in this brand). A display title at weight 800, ending in the page's one orange full stop.
- A lead statement splits by colour, not weight: the first sentence in ink, the rest in warm grey.
- Small uppercase labels (12px, letter-spaced) name things quietly. Drop them when a drawn mark already does the job; chapter 03's scribbles replaced its eyebrows.
- Colour is quiet: tones of the page's own paper, a warm hairline, and the palette's soft tints (pale blue, terracotta, warm grey, yellow). The orange is for single accents only. No blue inside icons.
- Colour-code parts only by borrowing (Head orange, Heart red, Hands plum from the sketch's scribbles). Darken a borrowed colour until it reads as small text.
- An ambient wash is fine at low strength. A fade or gradient added "for contrast" is usually too strong; start at 40% of what looks right on first try.

## 6. Imagery

- A page must not settle into "text, still photo, text, still photo". Give photos a quiet life: a coloured plane one grid gap behind, drifting gently with scroll (up to about 20px), and varied from photo to photo. Vary the corner, the colour and the direction of drift so the page never repeats itself.
- Frames beat bare photos. Plain rounded photos on their own were rejected. The offset coloured plane from the original build was wanted.
- Photos show people doing the work. Check every crop at every width, because a narrow portrait frame can cut the people out; set a focus point when it does.
- Alt text describes the photo only. It never repeats or adds content words.
- An illustration from the original build is worth reviving. Trim it to its drawing so spacing is measured from what is drawn, and consider cutting it into pieces so it can move (chapter 03's wall builds itself on scroll).
- Keep a strong idea for later rather than cramming it in. The sticky-notes video is saved for the next version.

## 7. Motion

- Things move when the reader does: on scroll, when in view, on hover or on choice. Nothing loops for decoration, apart from a one-time prompt.
- Subtle every time. The first version is usually too strong; halve it. Soft springs (high damping) or ease-out curves, 400 to 800ms. No bounce, no glow, no travelling light.
- Entrances are small: a fade and a few pixels of rise, or a drop onto pins for pinned things. Stagger siblings by about 50 to 80ms.
- Physical metaphors must be honest. A poster swings from its pins, a sticky note tilts, a stack fans out. Keep them small and short.
- Reduced motion shows the finished state with nothing moving, and anything hidden behind motion is shown.
- Measure geometry from layout size, not rendered boxes, while things animate in.

## 8. Interaction

- **One way to move through a thing.** If the tiles are the control, do not add arrows and progress pills as well; they "create confusion over navigation and process". No separate page navigation.
- **Separate a control from its result by surface, not by space.** One shape, two zones: the control on a tinted, ambient side and the result on plain white, meeting in a straight edge. One busy card was rejected, and so were two disconnected cards.
- **Prompt once, then trust the reader.** A first-view cue (a soft pulse on the first tile, a small "Hover to expand" hint with a nudging arrow) shows until the reader uses the pattern once. Then it never shows again, on any copy of the pattern or any later visit. The cue disappears the moment the pattern is used.
- **Hint words are few and exact.** "Hover to expand" was preferred to "Click to expand" on desktop. Put the hint beside the thing, not over it.
- **A reveal rewards the gesture.** Text revealed at the good end of a slider is written in the good state. A lead-in above an interactive component sets it up without naming what it reveals.
- **Everything works without JavaScript first.** It works by keyboard with arrow keys, and all text is in the page.

## 9. Components and blocks

- **Prefer an approved pattern to a new one.** The approved set covers most needs: body text, statement, photo with plane, pinned photo with hidden quote, quiet accordion, small accordion, image trio, T-shaped tabs, stacking cards, photo diagram, balance sliders, boxout, fanned sticky notes, quote card, and a self-building illustration.
- **A new need means a new block kind**, with its own rules and Jason's approval, never one-off styles in a content file.
- **A component never changes height as its state changes.** Stack every state in one grid cell and show the chosen one.
- **Break long runs of prose with shapes the page already has.** Use a bullet boxout for the middle paragraphs, or a fanned stack for a set of two or three short points. Vary the device within a page, so no two neighbouring parts use the same one.
- **A block that feels orphaned wherever it goes should be folded into another block.** For example, a quotation belongs behind a photo's tab.
- **A component approved on its own can still fail on the page.** It must take its colour and cue from what comes before it.
- **Do not place two heavy panels next to each other.** Let text or an image sit between them.

## 10. Content and copy

- **Stay faithful to the source.** Keep the author's sections whole and in order, move whole sections rather than lines, and restore cut passages rather than trimming them. The only fixes made without asking are typos.
- **Re-aim the source at the audience, subtly.** If copy was written for clients ("you") and the page is for designers, change only the words that address the wrong reader ("our clients, their context…"). Headings count too.
- **Split long sentences when a pattern needs it,** and keep the author's words. Mark every rewrite and every new line so it can be signed off.
- **Every new line needs sign-off.** That includes lead-ins, labels, hints, titles and quotes taken from an older build. Record them in one list.
- **Write in plain English, GOV.UK style,** with short sentences and no jargon. Numbers stay as the author wrote them unless asked.
- **Manual or client text in a public repository** goes in only when Jason supplies it or approves the source.

## 11. Before showing Jason anything

Run this checklist and fix any failure first.

- [ ] It does only what was asked. Nothing extra has crept in.
- [ ] Every edge sits on a grid line, and every gap is on the scale with one owner. The page checker and the overlay pass at 1440px and 1024px.
- [ ] Neighbouring zones share their top and bottom lines. Drawings are centred by what is drawn.
- [ ] It has no horizontal rules, no loud fills, and no orange except the single accent.
- [ ] The motion is subtle, happens only on reader action or scroll, and reduced motion is honoured. A prompt shows once and then never again.
- [ ] There is one way to navigate, and no duplicate controls.
- [ ] The component's height does not jump between states.
- [ ] Photos have frames, drift gently and vary. The crops keep the people in.
- [ ] The source text is faithful, re-aimed only where needed, and every new or changed word is recorded for sign-off.
- [ ] It works without JavaScript, by keyboard and with a screen reader. The console shows no errors or warnings.
- [ ] You have looked at screenshots at desktop, mid and phone widths, and the report gives measured facts.
- [ ] The rules file, journal and source-tracking records are updated to match.

## 12. Reading Jason's feedback

His words map to consistent fixes:

| He says | It usually means | Do this |
|---|---|---|
| "Too busy" | Too many surfaces, boxes or cues competing | Remove a layer (an inner box, a fade, a label, a second control). Simplify before adding |
| "Too big" | The footprint grew | Restore the original size and re-lay the inside |
| "Dry", "dull", "static" | Text and still images in a flat run | Add life from the page's own imagery: drifting planes, fanned notes, a boxout. Not new devices |
| "Jarring" | A device from outside the page's language | Swap it for one the page already uses |
| "Overdid it" | Too strong | Cut it by the amount he names, or halve it |
| "Doesn't entirely work" | The idea is right, the structure is wrong | Keep the idea and rethink how the parts connect |
| "Feels wrong" (about words) | Copy aimed at the wrong reader, or jargon | Re-aim or plainly reword the one phrase |
| "Kill it" | Remove it completely | Remove it, along with any code, styles and records that only served it |
| "Great", "nailed it", "cool" | Approved | Record it as approved in the rules, with what was rejected on the way |

## 13. What was rejected, so it is not tried again

- Orange pill tabs ("obnoxious"), full-bleed colour bands, split screens used as decoration, cards of unequal width, cards that shrink when covered.
- Hairline rules between sections, and lines above or below blocks.
- A photo stacked above text inside an approved card. An inset box inside a card plus a white fade. Two disconnected cards for one control.
- Arrows and progress pills on a component whose tiles already navigate.
- A caption or replay button on an animated illustration.
- Pins and a drop-in animation on a quote card.
- Eyebrow labels above headings that already carry a drawn mark.
- Plain rounded photos with no frame.
- Long paragraphs lifted into sticky notes that split a sentence the author wrote as one thought, when a set of points nearby suits the notes better.
- Anything off the grid, and anything nudged for effect.
