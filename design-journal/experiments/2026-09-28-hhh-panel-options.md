---
id: exp-2026-09-28-hhh-panel-options
type: experiment
date: 2026-09-28
topic: chapter-navigation
tags: [navigation, head-heart-hands, chapters-04-06]
status: done
related: [adr-024, log-2026-09-28]
---

# A panel linking chapters 4 to 6 back to Head, heart and hands

## Hypothesis

A small panel under the title of chapters 4 to 6 can say, with almost no words, that each is one part of Head, heart and hands, and lead back to it, by borrowing the sketch's scribbles and posters.

## Approach

Five options at `/hhhnav`, each under a real How we think title: a segmented pill (the framework's name and the three parts as segments, the current one lit); a mini wall (the three posters as thumbnails, the current one in colour and lifted); a thread (three stops on a short line); a scribble chip (one line); and a glass bar that opens to the three posters. Two faults found in testing and fixed: the glass bar pushed the statement down when opened (it now drops over the page, with a bridge so the pointer can reach it), and posters of different heights misaligned their names (every poster now sits in one fixed box). A redirect from `/HHHnav` looped, because Next.js matches redirect sources without regard to case, and a second `HHHnav` folder was the same folder on the Mac's case-insensitive disk; both were dropped, so the page is at `/hhhnav`.

## Result

All five work with no console errors and no phone overflow; every link goes to the right chapter. Jason chose the segmented pill.

## Conclusion

The pill does the job in one line because it is both a label and a way to move: it names the framework, shows which part you are in and takes you to the other two. Built as `FrameworkPill` and shown on chapters 04 to 06 through a `framework` setting on the chapter's content, 32px under the title. The page checker measures its two gaps.
