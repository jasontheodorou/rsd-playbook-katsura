import type { BalanceItem } from '../components/Balance'
import type { DiagramItem } from '../components/Diagram'
import type { ChapterContent } from '../page/types'

/** The four design watch-outs, for the balance sliders. Text as supplied by Jason. */
const WATCHOUTS: BalanceItem[] = [
  {
    id: 'ambiguity',
    short: 'Ambiguity',
    icon: 'question',
    lead: 'Clarity about what “design” means.',
    body: 'The word is often used interchangeably with “develop”, “consult”, or “innovate.” Being clear about what it means keeps teams aligned, keeps practice deep and avoids disillusionment.',
    from: 'Vague',
    to: 'Clear',
  },
  {
    id: 'loops',
    short: 'Endless loops',
    icon: 'repeat',
    lead: 'Research and design that lead to delivery.',
    body: 'Delivery builds belief in the work, where endless loops create scepticism and backlash. The promise of transformational results relies on contextual grounding and delivered outcomes.',
    from: 'Endless research',
    to: 'Delivered outcomes',
  },
  {
    id: 'theatre',
    short: 'Design theatre',
    icon: 'mask',
    lead: 'Substance over design theatre.',
    body: 'Design rituals such as Post-Its, workshops and prototypes only work when they carry their underlying purpose and discipline. Copying the form without them mistakes form for substance.',
    from: 'Form',
    to: 'Substance',
  },
  {
    id: 'responsibly',
    short: 'Responsibility',
    icon: 'scales',
    lead: 'Design responsibly.',
    body: 'Avoid overclaiming, “cargo cult” adoption, or pendulum swings by grounding practice in rigour, ethics and transparency.',
    from: 'Overclaiming',
    to: 'Rigour',
  },
]

/** The five benefits of good design, for the diagram. Text as supplied by Jason. */
const BENEFITS: DiagramItem[] = [
  {
    id: 'effectiveness',
    label: 'Root causes',
    icon: 'plant',
    lead: 'Improves effectiveness by addressing root causes.',
    body: 'Well-designed services are successful when they solve real problems, not symptoms. They are built on insight ensuring that solutions actually address needs.',
  },
  {
    id: 'efficiency',
    label: 'Efficiency',
    icon: 'gauge',
    lead: 'Enhances efficiency and reduces waste.',
    body: 'Design-driven approaches make services more efficient by eliminating duplication, simplifying user interactions, and preventing \u201cfailure demand\u201d.',
  },
  {
    id: 'trust',
    label: 'Trust',
    icon: 'shieldCheck',
    lead: 'Builds trust and legitimacy.',
    body: 'Successful services are those people trust and understand. Design builds the relationship by making services clear, fair and easy to use.',
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: 'arrowsClockwise',
    lead: 'Strengthens organisational learning and adaptability.',
    body: 'Embedding learning, feedback, and iteration into delivery is essential for managing complexity and uncertainty, making it more likely services will be successful.',
  },
  {
    id: 'prevention',
    label: 'Prevention',
    icon: 'umbrella',
    lead: 'Enables prevention and long-term value.',
    body: 'Design makes services successful not only by fixing today\u2019s problems but by preventing tomorrow\u2019s, delivering long-term savings and resilience.',
  },
]

/**
 * Why design matters: chapter 02, built to the Foundations gold standard (see
 * docs/DESIGN-RULES.md). Content only; built one block at a time.
 */
export const whyDesignMatters: ChapterContent = {
  title: 'Why design matters',
  statement: {
    lead: 'Our clients must be the recipients of great design.',
    rest: (
      <>
        <br className="fc__break" />
        This goes beyond the visual. It&rsquo;s about how we approach problem solving.
      </>
    ),
  },
  blocks: [
    {
      kind: 'text',
      paragraphs: [
        'Great design is making sense of complex problems and creating solutions that are desirable for consumers, feasible to deliver, viable in achieving business goals and sustainable for the long-term.',
        'The role of Researchers and Designers is to bridge these elements.',
      ],
    },
    {
      kind: 'pinned',
      src: '/photos/good-design-team.png',
      alt: 'A hand placing a brick on a colourful Lego tower.',
      // The chapter's quote, hidden until asked for: it slides out from behind the photograph.
      quote:
        'Good research and design enables us to think better, act with empathy and deliver value that is effective, trusted and human. Researchers and designers act as a bridge between citizens and institutions, building trust in the final service, as something done with people, not to them.',
    },
    {
      kind: 'text',
      paragraphs: ['When design is done well, it does five things for the services we build:'],
    },
    {
      kind: 'diagram',
      hub: 'Good design',
      label: 'What good design does',
      emptyTitle: 'Five things good design does',
      emptyBody: 'Choose one on the diagram to find out how.',
      items: BENEFITS,
      // Warmed to this chapter's yellow (the pinned photo and quote card), with the usual sand.
      washes: ['#f1dc93', '#eadfcf'],
    },
    {
      kind: 'text',
      paragraphs: [
        'When human-centred design is absent, services fail. Common features of failing products and services are:',
      ],
    },
    {
      kind: 'boxout',
      label: 'Common features',
      accent: '#f1d46e',
      items: [
        'Services designed around systems, not people and the complexities of life.',
        'Design is seen as peripheral to the core of a project.',
        'Fixed, compliance-driven mindsets dominate growth and adaptive mindsets.',
        'Continuous learning or feedback loops are absent in the development process.',
        'Decisions are driven by organisational processes, constraints and priorities.',
      ],
    },
    {
      kind: 'text',
      paragraphs: [
        'Sometimes design itself is the reason a service fails.',
        'That is why we work openly, sharing our methods, evidence and failures, and build in feedback loops that give early warning of problems.',
      ],
    },
    {
      kind: 'balance',
      prompt: 'Move each one towards good practice',
      washes: ['#f1dc93', '#eadfcf'],
      items: WATCHOUTS,
    },
    {
      kind: 'text',
      paragraphs: [
        'Design cannot succeed in a vacuum.',
        'Good design listens deeply, tests ideas with real people and builds empathy into every level of decision-making.',
        'We can enable good design by:',
      ],
    },
    {
      kind: 'accordion',
      sections: [
        {
          id: 'dna',
          title: 'Embedding design into the DNA',
          body: (
            <p>
              Design thinking thrives where leadership and culture value and encourage
              experimentation, learning and human-centred decision-making.
            </p>
          ),
        },
        {
          id: 'language',
          title: 'Creating clear definitions and shared language',
          body: (
            <p>
              Design succeeds when there is common understanding of what it is and what it&rsquo;s
              for.
            </p>
          ),
        },
        {
          id: 'structures',
          title: 'Building the structures, resources and mandates that support design',
          body: (
            <p>
              Shared standards and frameworks are critical, with the right people, skills and
              practices in place, supported by continuous evaluation frameworks and learning.
            </p>
          ),
        },
        {
          id: 'conditions',
          title: 'Shaping conditions as well as capability',
          body: (
            <p>
              Recognise that design thrives not only through skilled people but also supportive
              organisational environments, leadership and culture.
            </p>
          ),
        },
      ],
    },
  ],
}
