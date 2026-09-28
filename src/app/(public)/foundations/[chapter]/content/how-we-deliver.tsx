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
 * F2.99), then the three methods page 1 points here for (F2.14, F2.15, F2.19) and the two
 * collaboration passages from chapter 1 (F1.15, F1.28). Taken from the manual explorer's
 * Sequencing plan; slip fixed (F2.87) and client-facing "your" re-aimed at designers (F2.93).
 * First draft, 28 September 2026.
 */
export const howWeDeliver: ChapterContent = {
  title: 'How we deliver',
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
        'Our participation model demonstrates value and builds knowledge through doing. We invite and guide participants to experience it themselves - moving from ‘engage’ to ‘grow’ by walking through scenarios, in each other’s shoes, to develop future journeys, service maps, roles and structures. Concepts are then brought to life and tested together.',
        'The participation model:',
      ],
    },
    {
      kind: 'journey',
      title: 'Explore the participation model',
      label: 'The four steps of the participation model',
      restTitle: 'Four steps, from engage to grow',
      restBody: 'Choose a step to see what it involves.',
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
    {
      kind: 'part',
      mark: '/illustrations/hhh/hands-scribble.png',
      heading: 'How our designers work with others',
      photo: '/photos/participation-people.png',
      alt: 'Lego figures on a wall beside printed notes about the people they stand for.',
      plane: 'yellow',
      side: 'bl',
      drift: 'sideways',
      paragraphs: ['Our designers bring participation to life in three ways:'],
      fan: {
        label: 'Three ways our designers work with others',
        tints: ['#f7e7ee', '#f2dce6', '#fbf0f4'],
        notes: [
          {
            label: 'Facilitation',
            text: 'With designers, consumers, frontline staff and the organisation to explore hypotheses and reveal hidden assumptions.',
          },
          {
            label: 'Design sprints',
            text: 'Participation with cross-functional teams to ideate and prioritise solutions, identify unintended consequences and build legitimacy.',
          },
          {
            label: 'Co-design',
            text: 'Intensive, short cycles leading multidisciplinary teams to explore, prototype and test ideas together.',
          },
        ],
      },
    },
    {
      kind: 'text',
      paragraphs: ['Collaboration is also what lets design succeed:'],
    },
    {
      kind: 'accordion',
      sections: [
        {
          id: 'systemic-change',
          title: 'Cultivating collaboration and systemic change',
          body: (
            <p>
              The success of modern services depends on collaboration across professions, agencies,
              and communities, a hallmark of design.
            </p>
          ),
        },
        {
          id: 'cross-boundary',
          title: 'Systems thinking and cross-boundary collaboration',
          body: (
            <p>
              Systems must enable collaboration through multidisciplinary teams empowered to co-own
              outcomes.
            </p>
          ),
        },
      ],
    },
  ],
}
