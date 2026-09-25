import type { AccordionSection } from '../components/Accordion'
import type { TrioItem } from '../components/ImageTrio'
import type { Role } from '../components/TShapedTabs'
import type { ChapterContent } from '../page/types'

/**
 * Who we are: chapter 01, and the gold standard for every Foundations page. Its content only; the
 * layout, spacing and patterns come from FoundationsChapter.
 */

/** The four commitments, as sections of the Foundations accordion. */
const COMMITMENTS: AccordionSection[] = [
  {
    id: 'expand-understanding',
    title: '1. Expand understanding',
    body: (
      <p>
        We bring to light what traditional approaches miss: people&rsquo;s lived experience, how the
        wider system behaves, and consequences nobody intended.
      </p>
    ),
  },
  {
    id: 'make-sense-of-complexity',
    title: '2. Help groups make sense of complexity',
    body: (
      <p>
        We use visualisation, prototyping and collaborative tools to allow groups to hold more
        information and perspectives at once.
      </p>
    ),
  },
  {
    id: 'reframe-problems',
    title: '3. Reframe problems',
    body: (
      <p>
        We look at a problem in more than one way before deciding what it is. This opens up new
        solutions and keeps us humble about what the real problem is.
      </p>
    ),
  },
  {
    id: 'trust-and-accountability',
    title: '4. Build trust and accountability',
    body: (
      <p>
        We balance participatory, iterative approaches with the need for clarity, scrutiny and
        traceability in decision-making.
      </p>
    ),
  },
]

/** Three of the team's roles, from the text above, as the image trio. */
const TEAM: TrioItem[] = [
  {
    id: 'researchers',
    src: '/photos/problem-framing.jpg',
    alt: 'Three colleagues at a table covered in worksheets, one pointing as he explains.',
    label: 'Researchers',
    tone: '#f1d46e',
  },
  {
    id: 'experimenters',
    src: '/photos/lego-prototyping.jpg',
    alt: 'A group leaning over a table piled with Lego bricks, building together.',
    label: 'Experimenters',
    tone: '#619cba',
  },
  {
    id: 'collaborators',
    src: '/photos/journey-map-group.jpg',
    alt: 'A group gathered around a man in an orange shirt who holds a printed map.',
    label: 'Collaborators',
    tone: '#d8b4a3',
  },
]

/** The four roles, as T-shaped tabs. Text as supplied by Jason. */
const ROLES: Role[] = [
  {
    id: 'researchers',
    label: 'Researchers',
    photo: '/photos/problem-framing.jpg',
    alt: 'Three colleagues at a table covered in worksheets, one pointing as he explains.',
    intro: (
      <>
        Research provides the foundation. It allows us to understand needs, wants, motivations,
        barriers and systems through the eyes of users. Researchers frame problems, create
        hypotheses, test, evidence and prove ideas before they are built. Key methods include:
      </>
    ),
    methods: [
      {
        term: 'Quantitative research',
        text: 'capturing insight at scale to understand population or demographic group level trends.',
      },
      {
        term: 'Qualitative research',
        text: 'observing and interviewing people to understand real needs.',
      },
      {
        term: 'Strategic insight & analysis',
        text: 'making sense of complex information, from brand research to data modelling, and turning it into action.',
      },
    ],
  },
  {
    id: 'service-designers',
    label: 'Service Designers',
    photo: '/photos/journey-map-group.jpg',
    alt: 'A group gathered around a man in an orange shirt who holds a printed map.',
    intro: (
      <>
        Service designers connect research, UX, technology, operations, business and policy. They
        map how a service works, both what users see and what happens behind the scenes, so everyone
        shares the same picture. Key methods include:
      </>
    ),
    methods: [
      { term: 'Systems mapping and evaluation', text: 'explained in How we think.' },
      { term: 'Storytelling', text: 'explained in What we care about.' },
      { term: 'Facilitation and design sprints', text: 'explained in How we deliver.' },
    ],
  },
  {
    id: 'ux-designers',
    label: 'UX & Interaction Designers',
    photo: '/photos/lego-prototyping.jpg',
    alt: 'A group leaning over a table piled with Lego bricks, building together.',
    intro: (
      <>
        UX designers make digital interactions clear, inclusive, and evidence-driven — ensuring
        everyone can use products and services easily, safely and with confidence. Their work is
        defined by creative collaboration. Key methods include:
      </>
    ),
    methods: [
      {
        term: 'Prototyping',
        text: 'building rough sketches and wireframes to test early ideas, then realistic clickable versions to test the whole experience.',
      },
      {
        term: 'Usability testing',
        text: 'testing with people who have visible and hidden disabilities, low digital skills or other needs, so designs work for everyone.',
      },
      {
        term: 'Strategic design',
        text: 'judging how well an organisation does UX, and how to build it into its strategy and decisions.',
      },
    ],
  },
  {
    id: 'content-designers',
    label: 'Content Designers',
    photo: '/photos/worksheet-writing.png',
    alt: 'Close-up of a hand holding a pen over a printed worksheet.',
    intro: (
      <>
        Content designers help people get things done quickly and accurately. They turn complex
        information into plain language and organise it, so services are clear and accessible to
        everyone. Key methods include:
      </>
    ),
    methods: [
      {
        term: 'Content strategy',
        text: 'establishing the approach, planning, creation, format and governance of content. This includes the text, images and multimedia material.',
      },
      {
        term: 'Information architecture',
        text: 'ensuring content is well structured, prioritised and easily discovered, e.g. through card sorts, journey mapping and optimal flows.',
      },
    ],
  },
]

export const whoWeAre: ChapterContent = {
  title: 'Who we are',
  statement: {
    lead: 'We exist to turn uncertainty into clarity and possibility.',
    rest: (
      <>
        Enabling better, collective decisions through deep understanding of people, place, systems
        and contexts, <br className="fc__break" />
        to create environments for design to thrive.
      </>
    ),
  },
  blocks: [
    {
      kind: 'photo',
      src: '/photos/window-conversation.jpg',
      alt: 'Two colleagues talking by a tall office window, one holding a laptop.',
    },
    {
      kind: 'text',
      paragraphs: [
        'We do this through evidence, empathy and iteration. We design with purpose, so that our work leads to real-world outcomes that are meaningful, fair and lasting.',
        'In practice, this comes down to four commitments:',
      ],
    },
    { kind: 'accordion', sections: COMMITMENTS },
    {
      kind: 'text',
      paragraphs: [
        'Keeping these commitments takes a mix of creativity, people skills and an understanding of whole systems.',
        'Our team includes skilled, empathetic researchers and creative experimenters. It includes strategic collaborators. It also includes people who make sure change happens responsibly.',
      ],
    },
    { kind: 'trio', items: TEAM },
    {
      kind: 'text',
      paragraphs: [
        'Their expertise lies in what they design themselves, and just as much in helping others understand users’ needs and act on them.',
        'That is how we help with policy, services, strategy and innovation, using insight, data and prototypes to test ideas.',
        'Most of our specialists do work in four roles:',
      ],
    },
    { kind: 'tabs', roles: ROLES },
  ],
}
