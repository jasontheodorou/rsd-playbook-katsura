import type { ChapterContent } from '../page/types'

/**
 * What we care about: chapter 05, the deeper sections of Heart (F2.61 to F2.78) in the manual's
 * order, then the three storytelling methods page 1 points here for (F2.11, F2.16, F2.22). Taken
 * from the manual explorer's Sequencing plan; typo fixed (F2.78) and client-facing "you"
 * re-aimed at designers (F2.67). First draft, 28 September 2026.
 */
export const whatWeCareAbout: ChapterContent = {
  title: 'What we care about',
  framework: 'heart',
  statement: {
    lead: 'Stories are a powerful way to engage people, building strong feelings of belief and connection.',
  },
  blocks: [
    {
      kind: 'text',
      paragraphs: ['We use stories to:'],
      list: [
        'uncover hidden challenges;',
        'describe the case for change;',
        'highlight the human elements of our work;',
        'share visions for the future;',
        'show the impact of services and products.',
      ],
    },
    {
      kind: 'text',
      paragraphs: [
        'We tell immersive stories through videos, insight visualisation, personas and journey maps. This brings our clients into our work and establishes a shared storytelling language.',
      ],
    },
    {
      kind: 'voices',
      label: 'In their words',
      tint: '#fdf0ee',
      quotes: [
        'I have a phone but I don’t always have credit and I’m only confident using it for a few things.',
        'I speak a little English but I struggle with reading and writing, especially legal words.',
      ],
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/heart-scribble.png',
      heading: 'Design is for everyone',
      photo: '/photos/audience-hands.jpg',
      alt: 'A room full of people raising their hands at a talk, a slide glowing at the front.',
      plane: 'terracotta',
      side: 'tl',
      drift: 'diagonal',
      paragraphs: [
        'We’re bringing together our thinking on sustainability and inclusivity into a universal design approach that guides our work:',
        'Universal Design implicitly serves all. It is supportive, adaptable, intuitive, sustainable and equitable.',
        'This approach creates long-term solutions and helps to ensure wellbeing while minimising our adverse impact on the environment.',
      ],
      boxout: {
        after: 1,
        accent: '#eea0a4',
        items: [
          'Removing exclusion and promoting sustainability.',
          'Aligning our practices to the Sustainable Development Goals.',
          'Mapping the systems our services live within to identify further inclusivity and circularity.',
          'Using consequence mapping to explore the potential unintended outcomes of our work.',
          'Establishing practices designed to encourage and reward positive actions and behaviours.',
          'Measuring iteratively to ensure that we’re creating positive reinforcing loops.',
        ],
      },
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/heart-scribble.png',
      heading: 'How our designers tell stories',
      paragraphs: ['Our designers tell these stories in three ways:'],
      fan: {
        label: 'Three ways our designers tell stories',
        tints: ['#fde8e9', '#fadbdd', '#fef2f2'],
        notes: [
          {
            label: 'Storytelling',
            text: 'Helping teams “zoom in” on human detail and “zoom out” to see the big picture.',
          },
          {
            label: 'Visualisation & storytelling',
            text: 'Using narratives, maps, personas and prototypes to make abstract concepts tangible and persuadable.',
          },
          {
            label: 'Visual storytelling',
            text: 'Translating research into artefacts that visualise how people interact with services, the moments of delight and the barriers they face.',
          },
        ],
      },
    },
  ],
}
