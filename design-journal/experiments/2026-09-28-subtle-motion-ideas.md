---
id: exp-2026-09-28-subtle-motion-ideas
type: experiment
date: 2026-09-28
topic: chapters-04-06-distinctive
tags: [ideas, motion, images, text, chapters-04-06]
status: rejected
related: [exp-2026-09-28-different-ideas, log-2026-09-28]
---

# Ten subtle, Motion-led ideas for chapters 4 to 6

## Hypothesis

Quieter devices than the twenty at `/different` can make chapters 4 to 6 feel fresh through how things arrive and respond, rather than through new components, using Motion's springs, layout animation and scroll values.

## Approach

Ten live sketches at `/subtle`, with real content from the three chapters. Images: arrive in focus (blur and slight scale settle), aperture (the photo opens from a circle, echoing the chapter marks' bloom), slow pan (the crop travels 4% either way with scroll, on a spring), gentle tilt (up to 3 degrees towards a mouse pointer). Text: lines rise (each statement line slides out of its own mask, 80ms apart), type settles (a heading's letter-spacing and blur settle), glide (a shared-layout pill moves between three topics, text cross-fades in one grid cell), word preview (named methods float a photo beside the pointer). Text and image: photo travels (a shared-layout photo moves into the chosen row of the four ways we work), scroll captions (a sticky photo with the three ways of working passing over it). Everything moves only on scroll, pointer or choice, with no bounce.

Faults found and fixed in testing. Reading reduced motion through useReducedMotion made the server's HTML differ from the first client render, so hydration failed; it is now read through useSyncExternalStore with a server snapshot of false. A spring cannot animate a clip-path circle string, so the aperture stayed shut; it now animates a numeric radius into a motion template. Lines never rose, because each line's in-view check ran on an element hidden by its own mask; the paragraph now watches the view and drives the lines as variants. The word preview first appeared at the corner and slid across the text; it now jumps to the pointer on entry and sits below it.

## Result

All ten work with no console errors, reduced motion shows every finished state, and the page does not overflow at 390px. As proofs of idea, the entrance sketches start hidden in the server's HTML, so a chosen one needs a no-JavaScript fallback before it is built into a chapter. Awaiting Jason's choice.

## Conclusion

Rejected. Jason looked at all ten and chose none ("don't like any of them"), on 28 September 2026. The page stays at `/subtle` as a record and is uncommitted. Taken with the open twenty at `/different`, a next attempt should start from what chapters 4 to 6 already contain, per the taste rule that liveliness comes from the page's own imagery, rather than from motion treatments applied to generic photos and text.
