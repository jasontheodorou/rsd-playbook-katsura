---
id: design-rules
type: reference
date: 2026-09-25
topic: design
tags: [grid, spacing, components, process, taste]
status: active
related: [decision-016, decision-017]
---

# Design rules

How pages in this build are designed, and how Claude works on them. Loaded into every session through CLAUDE.md. These rules come from what worked, and what Jason rejected, while building the Who we are page (25 September 2026). Follow them without being asked. Change this file when a rule changes.

## How to work

1. **Measure before you report.** After every visual change, render the page in Playwright at 390, 768, 1024, 1440 and 1819px. Measure the edges and gaps that changed, look at the screenshots, and only then report. Never judge a layout by reading the CSS.
2. **Report measurements as facts.** Give the edge positions and gap sizes in pixels. Say what you inferred separately from what you measured.
3. **Desktop first.** Jason reviews on a wide desktop. Phones are a second pass, but nothing may overflow or overlap at 390px.
4. **Look at the screenshots Jason points to.** "See the screenshot on desktop" means the newest image in `~/Desktop`. Read it before answering.
5. **Refine, do not redesign.** Keep the layout's order and structure unless Jason asks for a rebuild. When he asks for a rebuild, start again from the grid, not from the old page.
6. **Build the minimum described.** Add only what was asked. Extras have been rejected as "too busy".
7. **Show options as live pages.** When Jason asks for versions, build them at a sub-URL (such as `/options` or `/accordions`) in the Who we are frame, numbered, each with a one-line rule, and open the page in his browser.
8. **Follow the spatial-logic method** (github.com/jasontheodorou/spatial-logic): classify each gap by what it separates, give every gap one owner, and measure what the eye sees, not the CSS box.

## The grid

- **One grid for the top bar and every page:** `--container: 1600px`, `--gutter: clamp(20px, 4vw, 64px)`, `--grid-gap: clamp(16px, 2vw, 32px)`, 12 columns (`src/theme/tokens.css`). Pages use `.container` so their edges match the top bar exactly.
- **Column 1 is the rail.** It holds the chapter number box ("01", 48 by 32px, orange outline) and the reading-progress track, pinned while scrolling. Its left edge is the wordmark's.
- **Content runs from column 2 to column 12.** Column 12's right edge is the account control's edge. Build content as an 11-column subgrid so children snap to the same lines.
- **Reading text sits on column 2 to column 9**, with its measure set in ems (about 65 to 70 characters a line).
- **Every left and right edge lands on a grid line.** Nothing may cross the reading edge (column 2's left). Never nudge text off its line for an effect (no `translate` on titles).
- **Inside a card or panel,** text keeps its grid line. Only leading markers and trailing controls move inside the card's padding. A panel that spans the full width leaves one column of margin inside each side.
- **Decorative offsets use one grid gap.** For example, a photograph's plane sits one `--grid-gap` below and to the right, and ends on column 12's edge.
- **Use the whole width on desktop.** Empty margins beyond the grid are dead space and are not acceptable. Let media and panels fill columns 2 to 12, and let type scale with the window.

## Vertical spacing

- **Every gap is a multiple of 8px and has exactly one owner:** the `margin-top` of the element below it. All other margins in the page are zero.
- **Gaps grow with the relationship,** smallest to largest:

| Relationship | Desktop | Example |
|---|---|---|
| Paragraph to paragraph | 32 | body text |
| Title to its statement | 48 | |
| Block to block, the same above and below every image and component (`--gap-block`) | 64 | statement to photograph, text to accordion and back, text to image trio and back, text to tabs |
| Last content to the chapter end | 64 | the block gap, like every other block |
| Top of the page to the title | 96 | |

- **No lead-in exception.** A sentence ending in a colon still takes the full block gap before what it introduces; a component must have the same space above and below it (Jason, 25 September 2026: 48 above and 80 below "makes no sense").
- **Equal gaps for equal relationships.** Any image or component takes the same block gap above and below. Never let two gaps of the same kind differ.
- **Measure to what the eye sees, including inside components.** If a component pads its content (the image trio's photographs sit inside coloured cells), the owner margin subtracts that padding so the visible gap lands on the scale, and the spacing overlay measures to the visible object.

- **Measure visible gaps.** Text is measured from the top of its capital letters (first line) to its baseline (last line); anything with a fill, border, shadow or image is measured by its painted edge, so a tinted component's tint is its edge. The spacing overlay measures this way, to a tenth of a pixel. Trim text line boxes with `text-box: trim-both cap alphabetic`, so CSS gaps match. Where a component adds its own padding, set the owner's value so the visible gap lands on the scale.
- **Name the gaps.** While a page is being designed, list every gap in its `SPACES` array for the spacing overlay (`components/SpacingOverlay.tsx`), with IDs V1, V2 and so on (vertical) and H1, H2 and so on (horizontal). Jason refers to gaps by ID. The overlay has a Spacing on/off button, bottom right. Remove it when a page's spacing is signed off.

## Type and colour

- Open Sans. Page title at display size (`clamp(3rem, 1rem + 5.2vw, 7.5rem)`, weight 800), ending in an orange full stop.
- Statement: about 27px at 1440px, one weight. The first sentence is ink `#111` and the rest is grey `#8a847e`.
- Body text (`components/BodyText.tsx`): about 21px at 1440px, `#2a2a2e`, line height 1.6, measure 34em.
- Palette: warm paper page `#fcfbf8`, sand tones `#f5f1ea`, `#efe9e0`, `#ece6dd`, warm hairline `#e2dcd3`, orange `#ec671b` (accent only), yellow `#f1d46e`, blue `#619cba`, terracotta `#d8b4a3`, pale blue `#cbd9da`, navy `#213d59`.
- Colour is quiet. Surfaces are tones of the page's own paper. The orange is kept for single accents.

## Taste: what Jason chose and rejected

- **Chosen:** calm, warm and restrained design; strict alignment; Material Design 3 behaviour in a restrained form (tonal surfaces, faint state layers, gentle shape morphs); scroll-linked motion that only moves when the reader does.
- **Rejected:** horizontal hairline rules of any kind (dividers, section rules, lines above or below blocks): separate things with space and tint instead; busy pages, loud accent fills on components (the first orange-pill tabs were "obnoxious"), split screens used as decoration, full-bleed colour bands, unequal card widths, cards that shrink when covered, strong colour competing with the text, anything off the grid.
- Page layout is one column, top to bottom. Patterns Jason has approved may place things side by side inside their own frame (stacking cards, the image trio).

## Approved patterns

| Pattern | Where | Use |
|---|---|---|
| Body text | `foundations/[chapter]/components/BodyText.tsx` | Reading copy, columns 2 to 9 |
| Accordion, "quiet outline" | `components/Accordion.tsx` | Sections that open and close. Each row on a faint warm tint (`#f7f4ef`, deeper when open), 4px apart; marker on column 2, title and text on column 3, a 32px hairline button inside column 12's edge that fills when open |
| Image trio | `components/ImageTrio.tsx` | Three portrait photographs; hovering fills a cell with colour and shows a label 16px above the pointer |
| T-shaped tabs | `components/TShapedTabs.tsx` | Roles or options side by side: a paper card with a hairline edge, sand pill on the chosen tab, photo on page columns 3 to 5, text on 7 to 11, grey square markers. Stays the height of the tallest panel |
| Stacking cards | `app/(public)/options/StackingCards.tsx` | Long sections as identical cards that pin and fold over one another, in paper tones |
| Photograph with plane | `components/PhotoWithPlane.tsx` | A 2:1 photograph with a pale plane one grid gap below and to the right |

## Foundations page standard (the gold standard)

"Who we are" (chapter 01, finished 25 September 2026) is the standard for every Foundations page. Jason approved it as the gold standard. Every decision below is built into the shared page component, so a new chapter gets all of it by supplying content only.

### How it is built

| Part | File | Job |
|---|---|---|
| Page component | `src/app/(public)/foundations/[chapter]/page/FoundationsChapter.tsx` | The frame, rail, grid, title, statement, block placement, every gap, and the spacing overlay's gap IDs |
| Page styles | `page/foundations-chapter.css` | The grid, the spacing scale and the breakpoints, in one place |
| Content types | `page/types.ts` | What a chapter can contain: a title, a statement and a list of blocks |
| Chapter content | `content/<slug>.tsx` | One file per chapter: words, photographs, alt text. No layout or spacing |
| Registry | `content/index.ts` | Chapters built to the standard, by slug. `ChapterView` renders these with the page component |
| Checker | `scripts/check-foundations.mjs` | Fails if any gap is off the scale or any block is off its columns |

### Every decision

**Frame.** The chapter opens in the frame over the Foundations grid, on warm paper `#fcfbf8`. Escape or the top bar's "Foundations" link closes it.

**Grid.** The page uses `.container` (the top bar's width and gutters) as 12 columns. Column 1 is the rail. Columns 2 to 12 hold content as an 11-column subgrid. Text (the statement and body text) spans columns 2 to 9, and every other block spans columns 2 to 12. Nothing crosses column 2's left edge, and nothing is nudged off its line.

**Rail.** Column 1 holds the chapter number in a 48 by 32px box with an orange 1.5px outline, above an 8px progress track that fills as you scroll. It is pinned 96px from the top, and its top meets the title's cap line. Below 1024px the number sits above the title and the track is dropped.

**Title.** The chapter name at display size (`clamp(3rem, 1rem + 5.2vw, 7.5rem)`, weight 800, letter-spacing -0.03em), ending in the page's one circle, an orange full stop. No marker text or rule above it.

**Statement.** One weight, 27px at 1440px (`clamp(1.25rem, 0.7rem + 1.1vw, 2.125rem)`), line height 1.6, measure 28.6em. The first sentence is ink `#111`, the rest grey `#8a847e`. An optional set line break (`<br className="fc__break" />`) holds only above 900px.

**Blocks.** Each chapter is the statement followed by a sequence of blocks:

| Block | Use | Rules |
|---|---|---|
| `text` | Body text | Short paragraphs, one or two sentences where possible. Split long text up. Plain English. Paragraphs 32px apart |
| `photo` | A landscape photograph, usually the first block | 2:1, with a pale blue plane (`#cbd9da`) one grid gap below and to the right |
| `accordion` | Several short sections, such as commitments | Quiet outline: tinted rows `#f7f4ef`, 4px apart, deeper when open; a marker, the title and a 32px hairline button that fills when open. Bodies start with "We…" |
| `trio` | Three portrait photographs with labels | 4:5 photographs in equal cells; hovering fills a cell with yellow, blue or terracotta and shows a label 16px above the pointer. Vertical dividers only as tall as the photographs, hidden either side of a lit cell. The fill stops 5px short of the cell at top and bottom so it never presses against text |
| `pinned` | A photograph as a quieter pause between text blocks | Adapted from the original build's PinnedPhoto: square photograph on page columns 2 to 6 on a yellow plane the same size, which settles from 0 to -3 degrees over 2.4s as it scrolls into view (at rest under reduced motion). Chapter 02's signature image. It can carry the chapter's quotation, hidden until asked for: a "Read the quote" tab on the photograph's corner slides a yellow quote card out from behind it (tucked 30% under the photograph, reaching page column 11, within the photograph's height); Escape or the tab closes it; without JavaScript the quote shows under the photograph |
| `diagram` | A centre idea with five items to explore (such as the five benefits) | The refined diagram; see "Refined pattern standard" below. Spans columns 2 to 11: stage on page columns 2 to 6, reading panel on 7 to 11 With a photo on every item it becomes the photo diagram (below) |
| `balance` | Ideas that are best understood as moving from a failure to good practice (such as design watch-outs) | Refined pattern: one frosted row per item with a light icon and a native slider between two ends in the source's own words; handles start near the failure end; past the middle a row brightens and reveals the full passage; "n of N in balance" count. Its prompt and rows fade in once as they scroll into view, each row 50ms after the last, as the diagram's tiles do. Very soft washes in the chapter's colour (18%, 96px blur). Page columns 2 to 11. Without JavaScript, a plain list |
| `boxout` | A short list that deserves to stand apart (such as features or signs) | Adapted from the original build's information card: white panel, hairline edge, 4px corners, a 48 by 4px accent bar top-left in the chapter's colour (not orange), a small uppercase grey label, points with grey square markers, 40px padding. Spans page columns 2 to 9. Introduced by a body-text line ending in a colon |
| `illustration` | A drawn illustration that carries a chapter's one idea (such as the head, heart and hands sketch) | A transparent image trimmed to its drawing, so the block gap is measured from the drawing. No frame, no plane, full width (page columns 2 to 12). From the original build's illustrations (`public/illustrations`) |
| `hhhWall` | The head, heart and hands sketch on chapter 03 | "Pinned as you arrive", chosen from `/hhh`: the sketch cut into its three posters and seven notes (`public/illustrations/hhh`, positions in `components/hhh-pieces.ts`), which rebuild it exactly. On first view each poster drops onto its pins in turn (a soft spring), then the notes follow; pointing at a poster swings it gently from its pins. No caption and no replay. One image with one description for screen readers. At the illustration's size, 74% of the content width |
| `stack` | Three or so short ideas that introduce what a page goes on to explain (such as head, heart and hands) | Stacking cards from `/options` (after Wise): each card pins at the frame's top padding, in line with the rail number, 16px below the last, and the next slides over it; a card's shade deepens slightly as it is covered. Cards 600px tall at most, 48px apart before pinning, in three tones of warm paper. Inside, an eyebrow and a title on content columns 2 to 6 and a 4:3 photograph on 7 to 10. Reads the chapter frame's scroll through `ChapterScrollContext`, because the page scrolls inside `.fc`. Below 1024px the cards stack without pinning Optional `accent` colours a card's eyebrow. |
| `part` | One part of a page's idea, written out in the source's wording | An optional eyebrow, a heading, a 21:9 photograph with 16px corners, then body text with an optional list with bold lead-ins. Page columns 2 to 9. Visible gaps: eyebrow to heading 24, heading to photograph 48, photograph to text 48 A short list of points with lead-ins goes in `items`, shown as the small accordion (`Accordion small`): one line per row, 56px, lead-in as the title without its full stop, 32px under the text Optional `accent` colours the eyebrow (a darkened scribble colour, readable as small text) and `mark` sets a small drawn mark after the heading, 1.1em tall and tilted 6 degrees (chapter 03: each poster's scribble). The plane drifts as the reader scrolls ("Drifting plane", chosen from `/hhh2`), kept subtle: `drift` is diagonal (16px up, 8px across), vertical (20px) or sideways (16px), and the photograph moves 6px the other way. Vary the plane's corner (`side`: tl, br or bl), colour and drift from part to part so the page never repeats itself. Scroll is read from the chapter frame. Up to three short points can go in `fan`, a fanned stack of sticky notes (`NoteFan`, chosen from `/textels/notes`): square notes in three shades of the part's tint, stacked with the top one readable, fanning into a row when pointed at, focused or chosen; spread out under reduced motion, and one under another on phones. While closed, a hint sits 32px to the right ("Hover to expand", 14px grey, with an arrow nudging towards the notes); it slides away and fades as the notes fan out, and once a reader has opened any stack it is never shown again, on any stack or visit (remembered in the browser as `katsura:note-fan-used`). Use it for a set of points that belong together (chapter 03: the three core principles, and the three stages from proof of concept to pilot) A long run of paragraphs can be broken with `boxout` (`after`, `items`, `accent`): the boxout, 48px from the text above and below, holding the middle paragraphs as points; chapter 03's Hands part holds F2.80 to F2.82 this way, with a soft plum accent bar |
| `quote` | One quotation that deserves weight | Adapted from the original build's tinted quote card: flat yellow `#f1d46e` panel (the one recurring tint; terracotta read as a warning, pale blue competed with image planes), 24px corners, 48px padding. Spans page columns 2 to 9 like body text; Georgia speech mark centred in the first column, quotation bold at about 25px on columns 3 to 8, optional small uppercase attribution |
| `tabs` | Roles or options to compare | T-shaped tabs: paper card with a hairline edge, bar tinted `#f5f1ea`, a sand pill for the chosen tab, photo on page columns 3 to 5 and text on 7 to 11, grey square markers, bold lead-ins. It stays the height of the tallest panel |

**Hide to include.** Every passage of the manual must appear, but not all at once. Secondary content (a quotation, extra detail, a list that supports a point) should sit behind a reader's choice: a tab on an image, an accordion, a diagram, tabs. It must stay in the page for screen readers and appear without JavaScript. A standalone block that breaks the flow is a sign its content should be folded into another block.

**Rhythm.** Do not run text block after text block. Break up runs of text with an image or a visual component, roughly every two or three blocks.

**Each page is a little unique.** The frame, grid, type and spacing are shared; the content shape is not. Do not copy another chapter's block order (for example, opening every chapter with the same photograph after the statement). Give each chapter its own image treatment or signature element, agreed with Jason, so pages feel related but not identical.

A block that introduces the next one (such as "Most of our specialists do work in four roles:") is a `text` block ending in a colon.

**Spacing.** Every gap is visible distance, and has one owner:

| Gap | Desktop | Tablet | Phone |
|---|---|---|---|
| Top of page to title | 96 | 48 | 48 |
| Title to statement | 48 | 32 | 24 |
| Block to block, the same above and below every block | 64 | 56 | 48 |
| Paragraph to paragraph | 32 | 32 | 24 |
| Last block to the chapter end (the block gap) | 64 | 56 | 48 |

**No horizontal rules** anywhere on the page. Blocks are separated by space and tint only.

**Chapter end.** The chapter's mark, left-aligned, with no rule above it, one block gap below the last block. Resting on it for about a second marks the chapter read. Once read, "Chapter read." shows above one block of two equal buttons (44px high, pill-shaped, 15px text, 12px apart): "Back to menu", filled in ink, which closes the chapter to the Foundations grid, and "Mark unread", outlined and quieter. After "Mark unread" the chapter stays unread until the reader has scrolled at least halfway back up the page.

**Motion.** The page fades up 24px as the frame opens, and the rail slides in 0.3 seconds later. Components move only when the reader acts or scrolls. Reduced motion removes all movement.

**Accessibility.** Every block works without JavaScript first. All text in accordions, tabs and the trio is in the page. Photographs have alt text that describes the photograph only. The tabs use arrow keys, Home and End.

### Making a new Foundations page

1. Write `content/<slug>.tsx` exporting a `ChapterContent`: the title, the statement (lead and rest) and the blocks, in reading order. Copy `content/who-we-are.tsx` as the model.
2. Add it to `content/index.ts`. Its slug must match the chapter in `foundations/chapters.ts`.
3. Use only the block kinds in `page/types.ts`. A layout need that no block covers means a new block kind, added to the page component with its own rules and approved by Jason first. It never means one-off styles in a content file.
4. Copy photographs into `public/photos` and give each alt text that describes the photograph only.
5. Run `node scripts/check-foundations.mjs <slug>` with the dev server running. It must pass at 1440px and 1024px.
6. Open the page with the spacing overlay on, check every gap by eye at 1440px, and show Jason before anything else.

## Refined pattern standard (the gold standard for refined components)

The refined diagram (chapter 02, "Why design matters", 26 September 2026) is the standard for any component that should feel "minimal, elegant, chic": it lifts off the page without the Transform colours. Jason approved it as a gold standard after rejecting a colourful version (too loud) and a paper-and-ink version (too dull). Build any new refined component to these rules.

**Code.** `foundations/[chapter]/components/Diagram.tsx` with `look="refined"`, styles in `components/diagram.css` (`.bd--refined`). Used as the `diagram` block. Icons from Phosphor (`@phosphor-icons/react`, MIT).

**Photo diagram (28 September 2026).** When each diagram item carries a `photo` (with `alt`, and an optional `focus` object-position), the block renders `components/PhotoDiagram.tsx` (`photo-diagram.css`, `.pd`). It is one card in two zones, at least 424px tall: the diagram's zone on the left (page columns 2 to 5 and the gap after them), edge to edge on its warm tint with the ambient washes, and a white zone holding the reading (6 to 8) and a portrait photo inset 8px with 17px corners (9 to 11). The zones meet in one straight edge with a hairline: the control and its result read apart but stay one shape. Jason approved this ("you nailed it") after rejecting a photo above the text (too tall), a card whose inner boxes did not align, one card with an inset diagram box and a white fade (too busy), and two separate cards (disconnected). Text edges sit 40px from the card's edge (32px from 1024px to 1279px, where the reading takes four of the white zone's six columns and tiles drop to 44px), so the title and the counter share a top line. The drawing is centred below the title. All passages share one grid cell, so the card never changes height. There is no navigator: arrows and progress pills confused how to move through it, so the tiles are the only control; a hidden line tells screen readers how many are explored. On first view the first tile pulses (a soft slate ring every 2.4 seconds) until the reader chooses any tile, then never again (`katsura:diagram-used`, via `page/once.ts`, which the fanned stack's hint also uses). A `restPhoto` shows before anything is chosen, and an optional `title` sits at the diagram zone's top left.

**Colour.**
- No Transform orange and no black lines. Text stays ink (`#16222b` for headings, `#44515a` for body).
- No blue inside icons. Icons are Phosphor "light" line icons in grey-ink (`#3c4a54`); the chosen one turns ink (`#16222b`) at "regular" weight. The panel icon sits on neutral paper (`#f3f1ed`).
- One restrained accent, slate `#34566b`, only in the drawn connector (at 60%) and the filled progress bars.
- Surfaces are frosted white (`rgba(255,255,255,0.62)` with a 10 to 12px backdrop blur) or plain white, edged with a hairline `rgba(52,60,70,0.1)`.

**Size.** Compact: ten columns wide (page columns 2 to 11, a column short of full width), the stage and panel five columns each; a wider-than-tall stage (16:11), 60px tiles with 16px corners, 13px labels, a 14px centre pill, a 40px-padded panel. About 490px tall at 1440px.

**Ambience (subtle, never showy).**
- Two blurred washes behind the stage, at 32% opacity with an 80px blur, drifting over 24 and 28 seconds. **The washes pick up the chapter's own colour** (the `washes` field on the block), so the component flows from what comes before it: pale blue `#cfe0e6` and sand `#eadfcf` by default; chapter 02 uses yellow `#f1dc93` and sand. The slate accent stays the same everywhere.
- Shadows are soft and low: about `0 20px 40px -28px rgba(52,60,70,0.1)` for surfaces, smaller for tiles.
- No coloured glow or fill on a chosen item: a fine ink edge (`rgba(22,34,43,0.28)`) and a 2px lift only.
- Nothing playful: no bounce or spring, no breathing outlines, no travelling lights. Items fade in once; choices ease over 0.3 to 0.4 seconds.

**Lines.**
- Connectors are hairlines in pale slate (16%, 30% once explored). The chosen one draws in slate over 0.6 seconds.
- **No line may pass through wording, a tile or the centre.** Lines end at the measured edge of each surface plus clear space (measured from layout size, so entrance animations cannot skew it), and labels sit on the side of their tile away from the centre. `scripts/check-foundations.mjs` fails a page if any line crosses a label, tile or the centre.

**Type.** Labels 13px, weight 600, mid-grey, ink when chosen. Panel heading weight 600, tight tracking (−0.025em), about 30px at 1440px. Panel count ("03 of 05") in warm grey, letter-spaced.

**Placement.** Introduce the component with a one-line body-text lead-in ending in a colon, and do not place it directly after another heavy panel such as a quote card; let body text or an image sit between them.

**Behaviour.**
- The panel says what to do before anything is chosen: a title and one instruction.
- Every item is a real button with a short label, reachable by keyboard, with arrow keys moving between items.
- Without JavaScript, the component is a plain list with icons and all text.
- Reduced motion stops the washes and the connector drawing.

## Always

- Every interactive element works without JavaScript first, then gains its behaviour on top.
- All text in accordions and hover patterns is in the page, so screen readers reach it.
- Reduced motion shows the finished state with no movement.
- Write in plain English, GOV.UK style.
- Manual text is client content, and this repository is public. Only put manual text in the code when Jason has supplied it for the page.
