import type { LandscapeLayer } from '../components/DesignLandscape'
import type { ChapterContent } from '../page/types'

/** The Design Landscape's five layers, outside in (F2.46 to F2.42), in the manual's words. */
const LAYERS: LandscapeLayer[] = [
  {
    id: 'environment',
    name: 'Environment',
    text: 'Environmental context - the factors influencing take up and scaled adoption.',
  },
  {
    id: 'community',
    name: 'Community',
    text: 'Community influence. Impact of networks and relationships, including advocates / detractors.',
  },
  {
    id: 'organisation',
    name: 'Organisation',
    text: 'The needs of the organisation, such as strategic goals, commercial priorities, capabilities, performance, and culture.',
  },
  {
    id: 'service',
    name: 'Service',
    text: 'The service context - delivery needs, barriers, technology and implementation challenges.',
  },
  {
    id: 'individual',
    name: 'Individual',
    text: 'The individual’s needs, capability, motivation and opportunity that drive current behaviours.',
  },
]

/**
 * How we think: chapter 04, the deeper sections of Head (F2.38 to F2.55) in the manual's order,
 * then the two service design methods page 1 points here for (F2.13, F2.17). Taken from the
 * manual explorer's Sequencing plan; typos fixed (F2.39, F2.44) and client-facing "you" re-aimed at designers
 * (F2.49, F2.50). First draft, 28 September 2026.
 */
export const howWeThink: ChapterContent = {
  title: 'How we think',
  framework: 'head',
  statement: {
    lead: 'Every aspect of the way we live is changing - our economies, our jobs, our communities and our relationships.',
    rest: (
      <>
        <br className="fc__break" />
        Our experiences influence our decisions, drive our behaviours and define the way we choose
        to live our lives more than ever.
      </>
    ),
  },
  blocks: [
    {
      kind: 'text',
      paragraphs: [
        'We identify what affects and shapes people’s lives, motivations and behaviours to develop complete strategies, where new ideas and designs can thrive.',
        'We must be bold in designing 360° experiences and creating integrated services to improve lives, ways of working and daily experiences for users, companies and communities.',
        'Our approach is based on our ‘Design Landscape’, the features that shape decision making:',
      ],
    },
    {
      kind: 'landscape',
      title: 'Explore the Design Landscape',
      label: 'The five layers of the Design Landscape',
      restTitle: 'Five layers that shape decisions',
      restBody:
        'The Design Landscape spans the Individual, Service, Organisation, Community and Environment.',
      layers: LAYERS,
      washes: ['#fde3c8', '#eadfcf'],
    },
    {
      kind: 'text',
      paragraphs: [
        'Understanding how a service will exist in this ecosystem is essential when designing end-to-end and front-to-back services.',
      ],
    },
    {
      kind: 'part',
      mark: '/illustrations/hhh/head-scribble.png',
      heading: 'Data-driven decision-making',
      photo: '/photos/focused-work.jpg',
      alt: 'A designer in headphones working at a screen, a workshop board on the monitor behind.',
      plane: 'paleblue',
      side: 'br',
      drift: 'vertical',
      paragraphs: [
        'To make decisions about future change, we need to fully and honestly understand where our clients are today.',
        'We’ll start with our clients’ data and add our own capabilities to enrich and analyse the evidence. We can identify the right changes at the right time, working efficiently to translate data into the design of scalable, sustainable experiences.',
        'This means we can measure the impact of our work from the start. Through every stage, we’ll use data visualisation, making the stories behind the data accessible to all.',
        'Understanding data includes:',
      ],
      list: ['Data analytics.', 'Future analysis sketches.', 'Performance metrics and baselines.'],
    },
    {
      kind: 'text',
      paragraphs: [
        'Our service designers bring this thinking into their work through two methods:',
      ],
    },
    {
      kind: 'accordion',
      sections: [
        {
          id: 'visual-frameworks',
          title: 'Visual frameworks',
          body: (
            <p>
              Such as systems mapping to make visible the inter-connections between people,
              policies, place and service.
            </p>
          ),
        },
        {
          id: 'evaluation',
          title: 'Evaluation',
          body: <p>Embedding measurement, learning and iteration that reflect experience.</p>,
        },
      ],
    },
  ],
}
