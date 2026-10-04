import type { StackCardItem } from '../components/StackCards'
import type { ChapterContent } from '../page/types'

/** The three parts, as stacking cards: each part's one-line definition from the manual (F2.31 to F2.33). */
const PARTS: StackCardItem[] = [
  {
    id: 'head',
    accent: '#a94c00',
    eyebrow: 'Head',
    title: 'Head is how we think and frame our work.',
    photo: '/photos/head-flipchart.jpg',
    alt: 'Three colleagues sketching a diagram together at a flipchart.',
  },
  {
    id: 'heart',
    accent: '#c4121f',
    eyebrow: 'Heart',
    title: 'Heart is all the things we care about most.',
    photo: '/photos/lego-sticky-upskill.jpg',
    alt: 'A hand holds a green sticky note reading “Helping others to develop + upskill!!” beside a small Lego tower and figure.',
  },
  {
    id: 'hands',
    accent: '#a61448',
    eyebrow: 'Hands',
    title: 'Hands is how we deliver and get the job done.',
    photo: '/photos/hands-many-lego.png',
    alt: 'Many hands reaching into a table covered in Lego bricks, building together.',
  },
]

/**
 * Head, heart and hands: chapter 03, built to the Foundations gold standard. Ian's introduction
 * (F2.30 to F2.34), then the opening section of each part (F2.35 to F2.37, F2.56 to F2.60, F2.79 to
 * F2.86), in the manual's wording with typos fixed, and subtly re-aimed at designers: where Ian addresses the
 * client ("you"), the text now talks about clients (F2.34, F2.35, F2.37). Taken from the manual explorer's Sequencing
 * plan at Jason's request, 28 September 2026.
 */
export const headHeartAndHands: ChapterContent = {
  title: 'Head, heart and hands',
  statement: {
    lead: 'We’re passionate about building services that truly transform lives, making the world a better place through design.',
    rest: (
      <>
        <br className="fc__break" />
        This is captured in our research and design philosophy framework: Head, Heart, Hands.
      </>
    ),
  },
  blocks: [
    {
      kind: 'hhhWall',
      alt: 'Three sketches pinned to a wall, a head, a heart and a hand, surrounded by sticky notes.',
    },
    { kind: 'stack', cards: PARTS },
    {
      kind: 'text',
      paragraphs: [
        'This helps our clients’ organisations thrive by establishing cultures of expert and empathic problem solving. It is an approach that has transformed dozens of public services and delivered digital experiences that have helped millions of people along the way.',
      ],
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/head-scribble.png',
      heading: 'Immersed in our clients’ world',
      photo: '/photos/lego-table-group.jpg',
      plane: 'paleblue',
      side: 'tl',
      drift: 'diagonal',
      alt: 'Several people lean over a table covered in Lego bricks, building together.',
      paragraphs: [
        'We work to understand our clients, their context, their needs and their people, so that we can help them design for the future.',
        'We use human-centred frameworks to shape how we think about our approach. These help us to understand people and their context. After all, those who use, deliver and manage services don’t exist in a vacuum.',
      ],
      // F2.37, broken into two shorter sentences, one per note (Jason, 28 September 2026).
      fan: {
        label: 'How we understand and grow',
        tints: ['#fde9d6', '#fbdcc0'],
        notes: [
          { label: 'Always learning', text: 'We’re always working to understand and grow.' },
          {
            label: 'Going further',
            text: 'We extend our work with clients by putting our human-centred approach at the centre, to address the systemic factors that make or break services.',
          },
        ],
      },
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/heart-scribble.png',
      heading: 'Practice we believe in',
      photo: '/photos/lego-tower-build.jpg',
      plane: 'terracotta',
      side: 'br',
      drift: 'vertical',
      alt: 'A woman builds a tall Lego tower topped with a small figure, on a patterned rug.',
      paragraphs: [
        'The ‘WHY’ behind what we do - the things that get us out of bed in the morning. We hold our values close to our hearts and bring them into everything we do.',
        'It all comes down to making an impact: improving lives, supporting people, and making the world better. This is based on 3 core principles:',
      ],
      fan: {
        label: 'The three core principles',
        tints: ['#fde8e9', '#fadbdd', '#fef2f2'],
        notes: [
          {
            label: 'Solve the right problem',
            text: 'A product or service can only ever be as good as the understanding of the problem it is addressing or gap it is filling.',
          },
          {
            label: 'Co-location underpins collaboration',
            text: 'When we’re together, we can design better, deliver quicker and adapt to change as new insight emerges.',
          },
          {
            label: 'We’re human first',
            text: 'As our technological and physical worlds converge, we must hold people at the centre of our work.',
          },
        ],
      },
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/hands-scribble.png',
      heading: 'Designing the possible',
      photo: '/photos/lego-trees.png',
      plane: 'grey',
      side: 'bl',
      drift: 'sideways',
      alt: 'Hands placing a small Lego figure on a model built from bricks.',
      paragraphs: [
        'Our skills, methods and capabilities span the full lifecycle of a project and a service, which means we can always find the right tools for the task at hand.',
        'We use three techniques to explore the key questions: desirability (is it solving a problem or filling a gap for users?), feasibility (can it be done?), and viability (is the size of the prize right?).',
      ],
      boxout: {
        after: 1,
        accent: '#d98aa9',
        items: [
          'Working alongside our colleagues, clients and partners, we incrementally turn the ideas, service concepts and prototypes into real working services.',
          'We relentlessly focus on elements that deliver the greatest value, testing assumptions, learning and enhancing our designs throughout the process.',
          'Where our assumptions or hypotheses fall short, it provides the option to ‘pivot’; to review the research, insights to change direction.',
        ],
      },
      fan: {
        label: 'Three stages, from idea to service',
        tints: ['#f7e7ee', '#f2dce6', '#fbf0f4'],
        notes: [
          {
            label: 'Proof of Concept (POC)',
            text: 'The testing of, or experimentation with, an idea to assess whether it can become a real service or product.',
          },
          {
            label: 'Prototype',
            text: 'Paper, clickable or coded, designed to test the broad end-to-end journey, simulating real interactions with one or more touchpoints.',
          },
          {
            label: 'Pilots',
            text: 'A feature rich service that mirrors a real world environment as much as possible and timeboxed, with clearly defined, measurable outcomes for evaluation.',
          },
        ],
      },
    },
    {
      kind: 'quote',
      // The original build's closing quote card for this chapter (not the manual's wording).
      text: 'Head, heart, hands: think clearly, care deeply, deliver together.',
      attribution: 'Our philosophy',
    },
  ],
}
