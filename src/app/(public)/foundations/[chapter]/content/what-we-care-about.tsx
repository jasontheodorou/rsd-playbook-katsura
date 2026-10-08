import type { ChapterContent } from '../page/types'

/**
 * What we care about: chapter 05, the deeper sections of Heart (F2.61 to F2.78) in the manual's
 * order, then the three storytelling methods page 1 points here for (F2.11, F2.16, F2.22). Taken
 * from the manual explorer's Sequencing plan; typo fixed (F2.78) and client-facing "you"
 * re-aimed at designers (F2.67). First draft, 28 September 2026.
 */
export const whatWeCareAbout: ChapterContent = {
  title: 'How we tell stories',
  framework: 'heart',
  statement: {
    lead: 'Stories are a powerful way to engage people, building strong feelings of belief and connection.',
  },
  blocks: [
    {
      kind: 'text',
      paragraphs: ['We use stories to:'],
    },
    {
      kind: 'boxout',
      accent: '#eea0a4',
      items: [
        'Uncover hidden challenges.',
        'Describe the case for change.',
        'Highlight the human elements of our work.',
      ],
    },
    {
      kind: 'text',
      // The boxout's last two points, written out as sentences at Jason's request (1 October 2026).
      paragraphs: [
        'Stories also help us share visions for the future. They show the impact of services and products on the people who use them.',
      ],
    },
    {
      kind: 'voices',
      voices: [
        {
          src: '/illustrations/quotes/person-1.svg',
          ratio: 430.8 / 396.1,
          quote:
            'I have a phone but I don’t always have credit and I’m only confident using it for a few things.',
          mark: 'only confident using it for a few things',
        },
        {
          src: '/illustrations/quotes/person-2.svg',
          ratio: 466.4 / 495.2,
          quote:
            'I speak a little English but I struggle with reading and writing, especially legal words.',
          mark: 'especially legal words',
        },
      ],
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/heart-scribble.png',
      // New heading, Jason's own words (1 October 2026).
      heading: 'Revealing the stories that matter',
      paragraphs: [
        'We tell immersive stories through videos, insight visualisation, personas and journey maps. This brings our clients into our work and establishes a shared storytelling language.',
        'Our designers tell these stories in three ways:',
      ],
    },
    {
      kind: 'stories',
      label: 'Three ways our designers tell stories',
      stories: [
        {
          label: 'Zooming in and out',
          text: 'Helping teams “zoom in” on human detail and “zoom out” to see the big picture.',
          photo: '/photos/lego-figures-upright.jpg',
          alt: 'Close-up of hands fixing small Lego figures onto a model, with loose bricks on the table below.',
        },
        {
          label: 'Making ideas tangible',
          text: 'Using narratives, maps, personas and prototypes to make abstract concepts tangible and persuadable.',
          photo: '/photos/lego-show-and-tell.png',
          alt: 'Two people at a workshop, one holding up a small Lego model while the other talks.',
        },
        {
          label: 'Mapping real experiences',
          text: 'Translating research into artefacts that visualise how people interact with services, the moments of delight and the barriers they face.',
          photo: '/photos/lego-bricks-drawings.jpg',
          alt: 'Lego bricks scattered over printed sheets with hand-drawn sketches of insects.',
        },
      ],
    },
    {
      kind: 'text',
      // New line, approved by Jason on 1 October 2026: closes the stories and the chapter.
      paragraphs: [
        'Whichever way we tell it, a good story helps people see the problem, care about it and act on it.',
      ],
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/heart-scribble.png',
      heading: 'Design is for everyone',
      // New lead-in, approved by Jason on 1 October 2026: ties the part to the stories before it.
      lead: 'The stories we hear show how differently people live, and what gets in their way. That is why we design for everyone.',
      photo: '/photos/office-awards-wall.jpg',
      alt: 'A framed board on an office wall of Lego figures on orange bricks, each above a card thanking a colleague or team.',
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
  ],
}
