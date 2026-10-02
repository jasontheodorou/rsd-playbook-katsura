import type { JourneyStep } from '../components/Journey'
import type { ChapterContent } from '../page/types'

/** The participation model's four steps (F2.90 to F2.93), in the manual's words. */
const STEPS: JourneyStep[] = [
  {
    id: 'engage',
    name: 'Engage',
    lead: 'Connecting people and ideas.',
    text: 'Making connections and proactively involving all stakeholders.',
  },
  {
    id: 'involve',
    name: 'Involve',
    lead: 'Encouraging collaboration.',
    text: 'Drawing out insights and enabling one-team collaboration.',
  },
  {
    id: 'collaborate',
    name: 'Collaborate',
    lead: 'Bringing visions to life.',
    text: 'Facilitating teamwork to bring shared visions to reality.',
  },
  {
    id: 'grow',
    name: 'Grow',
    lead: 'Growing our clients’ capabilities.',
    text: 'Building communities of practice in research, design, product, data delivery and technology.',
  },
]

/**
 * How we deliver: chapter 06, Hands' closing section, "Participation is our superpower" (F2.87 to
 * F2.99). The three methods page 1 points here for (F2.14, F2.15, F2.19, "How our designers work
 * with others") and the two collaboration passages from chapter 1 (F1.15, F1.28, "Collaboration is
 * also what lets design succeed") were removed at Jason's request on 2 October 2026. Taken from the manual explorer's
 * Sequencing plan; slip fixed (F2.87) and client-facing "your" re-aimed at designers (F2.93).
 * First draft, 28 September 2026.
 */
export const howWeDeliver: ChapterContent = {
  title: 'How we collaborate',
  framework: 'hands',
  statement: {
    lead: 'Great design is built on great collaboration.',
    rest: 'That’s why participatory design is our default.',
  },
  blocks: [
    {
      kind: 'text',
      paragraphs: [
        'We want our work to be embedded into the culture of a project, programme and organisation, so it can live on and create positive change that everyone wants to sustain.',
        // The manual's paragraph (F2.88) is split here so the model sits after its first sentence (Jason, 2 October 2026).
        'Our participation model demonstrates value and builds knowledge through doing.',
      ],
    },
    {
      kind: 'participation',
      // Roll call's words (Jason, 2 October 2026)
      lead: 'Select a step in the model',
      prompt: 'Select a step in the model',
      steps: STEPS,
    },
    {
      kind: 'text',
      paragraphs: [
        'We invite and guide participants to experience it themselves - moving from ‘engage’ to ‘grow’ by walking through scenarios, in each other’s shoes, to develop future journeys, service maps, roles and structures. Concepts are then brought to life and tested together.',
      ],
    },
    {
      kind: 'participationSteps',
      label: 'The four steps of the participation model',
      steps: STEPS,
    },
    {
      kind: 'text',
      paragraphs: ['We value this approach as vital for:'],
    },
    {
      kind: 'boxout',
      accent: '#d98aa9',
      items: [
        'Building shared, sustainable visions for change.',
        'Establishing connections and conditions for new services and products to thrive.',
        'Promoting strengths and assets, rather than just focussing on needs and deficits.',
        'Empowering and promoting hidden user groups, bringing their insights into focus.',
        'Nurturing in-house research and design skills to sustain ongoing innovation.',
      ],
    },
  ],
}
