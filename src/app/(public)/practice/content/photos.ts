/**
 * Photos placed in Shape your practice cards, on top of the MYP demo plan (which names only two
 * images, both still to commission). Jason chose six formats from /syp-images on 3 October 2026
 * (3 card, 5 background, 6 badged, 9 pair, 11 tabs, 13 tonal frame) "to use where appropriate".
 * Every photo is the playbook's own (the Lego photos from the January 2026 sessions, added 3 October 2026), and none appears anywhere else in the build; alt text describes the photo only. Titles, badges and tab
 * labels marked new are new wording awaiting sign-off.
 */
export type Photo = { src: string; alt: string }

export type PhotoAsset =
  | { format: 'frame'; photo: Photo; caption?: string }
  | { format: 'pair'; photos: [Photo, Photo]; caption?: string }
  | { format: 'card'; photo: Photo; title: string; text?: string }
  | { format: 'tabs'; tabs: { label: string; photo: Photo }[] }
  | { format: 'background'; photo: Photo; title: string; text?: string }
  | { format: 'badged'; photo: Photo; badge: string; caption?: string }

const P = {
  meet: {
    src: '/photos/team-meeting.png',
    alt: 'Five colleagues talk around a white meeting table with laptops.',
  },
  placing: {
    src: '/photos/lego-figure-placing.jpg',
    alt: 'Hands place a small Lego figure on a model, a sticky note and a mug on the table beside it.',
  },
  desk: {
    src: '/photos/eunice-tracey.jpg',
    alt: 'Two colleagues talking and laughing at a desk in a busy office.',
  },
  upright: {
    src: '/photos/lego-figures-upright.jpg',
    alt: 'Hands fit small Lego figures onto an upright model with a red wheel.',
  },
  cards: {
    src: '/photos/challenge-cards.png',
    alt: 'A printed sheet of Net Positive Challenge Cards, each with prompts about services.',
  },
  vehicle: {
    src: '/photos/lego-vehicle-hands.jpg',
    alt: 'Hands hold a small Lego vehicle carrying two figures.',
  },
  note: {
    src: '/photos/lego-sticky-note.jpg',
    alt: 'A handwritten pink sticky note on a patterned rug beside a few Lego bricks.',
  },
  baseplate: {
    src: '/photos/lego-baseplate-hands.jpg',
    alt: 'Hands build a ladder of Lego bricks on a blue baseplate, loose bricks all around.',
  },
  tray: {
    src: '/photos/lego-tray-applause.jpg',
    alt: 'A Lego model on a tray is carried past a colleague who applauds.',
  },
}

/** Where each photo goes: a course and card number, and the content ID it follows (or after the words). */
export const PHOTOS: { course: number; card: number; after?: string; asset: PhotoAsset }[] = [
  // Course 1, card 2: point 6, "We Work Across Boundaries".
  { course: 1, card: 2, after: 'M8.19', asset: { format: 'pair', photos: [P.meet, P.placing] } },
  // Course 1, card 4: start with the needs of users.
  { course: 1, card: 4, asset: { format: 'frame', photo: P.desk } },
  // Course 2, card 6: iterative. The title is the manual's own words (M3.7).
  {
    course: 2,
    card: 6,
    asset: { format: 'card', photo: P.upright, title: 'Build, test, iterate and repeat.' },
  },
  // Course 2, card 9: transparency, evidence and impact. Tab labels are new.
  {
    course: 2,
    card: 9,
    asset: {
      format: 'tabs',
      tabs: [
        { label: 'Set the measure', photo: P.cards },
        { label: 'Test it', photo: P.vehicle },
        { label: 'Share what changed', photo: P.note },
      ],
    },
  },
  // Course 2, card 10: fresh perspectives and innovations. The title is new.
  {
    course: 2,
    card: 10,
    asset: { format: 'background', photo: P.baseplate, title: 'Test new ideas in the open' },
  },
  // Course 2, card 12: being honest and open. The badge is new.
  { course: 2, card: 12, asset: { format: 'badged', photo: P.tray, badge: 'In practice' } },
]
