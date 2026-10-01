---
id: adr-032
type: decision
date: 2026-10-01
topic: who-we-are
tags: [tabs, roles, illustration, chapter-01, paper]
status: accepted
related: [log-2026-10-01, adr-031]
---

# 032: Who we are's roles are shown as drawings on paper

## Context

Who we are's T-shaped tabs showed a photograph for each of the four roles. Jason supplied four role drawings (research, service, interaction, content: black ink with orange accents) to represent each discipline, and asked for ways to make them less dry. Five treatments were built on `/icons`: Drawn in, Orange comes alive, On paper, Sticker on the photo and Coloured plane.

## Decision

Jason chose On paper ("superb"), after the texture was lightened because the first version looked "grey and grotty". In the tabs, each role's drawing sits on a small card of watercolour paper where the photograph was (content columns 2 to 4), 92% of the column wide so its tilt stays inside, tilted 1.5 degrees with a soft shadow. It settles from 6 degrees and 12px lower as it arrives (0.9 seconds), once the card is first in view and again at each change of tab. The `tabs` block takes `art: 'paper'`, and each role an `art` path to its drawing (`public/illustrations/roles/`, split into `-ink` and `-accent` layers). The paper is `public/illustrations/roles/paper-light.jpg`, the voices paper lifted towards warm white (30% of its depth kept, mean 244, 243, 239).

## Why

The drawings are the build's own hand, like the scribbles and sketches on other chapters, and the paper card gives them a physical presence without a new device.

## Consequences

The role photographs stay in the content for the other looks but are not shown on the page. The other four looks remain on `/icons` for comparison. Without JavaScript the drawings show at rest; reduced motion shows them at rest too. The card's height is unchanged in every state.
