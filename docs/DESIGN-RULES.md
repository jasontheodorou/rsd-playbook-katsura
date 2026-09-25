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
| `tabs` | Roles or options to compare | T-shaped tabs: paper card with a hairline edge, bar tinted `#f5f1ea`, a sand pill for the chosen tab, photo on page columns 3 to 5 and text on 7 to 11, grey square markers, bold lead-ins. It stays the height of the tallest panel |

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

## Always

- Every interactive element works without JavaScript first, then gains its behaviour on top.
- All text in accordions and hover patterns is in the page, so screen readers reach it.
- Reduced motion shows the finished state with no movement.
- Write in plain English, GOV.UK style.
- Manual text is client content, and this repository is public. Only put manual text in the code when Jason has supplied it for the page.
