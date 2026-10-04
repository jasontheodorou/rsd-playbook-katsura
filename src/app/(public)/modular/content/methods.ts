// Stand-in content for the /modular options, copied from the first build (rsd-playbook
// src/data/methods.ts) on 2 October 2026.
import type { Card, Method } from './types'

/**
 * Service Designer discipline overview.
 *
 * First item in the Methods module. Concise (per the brief): short role
 * description + "What service designers do" bullets. Sits alongside the
 * six core methods below in the module's sidebar.
 */
export const sdOverviewCard: Card = {
  id: 'sd-methods-overview',
  title: 'Service designers',
  minutes: 3,
  roles: ['service-designer'],
  content: [
    { type: 'paragraph', text: 'Service designers are the bridge between research, UX, technology, operations, business and policy.' },
    { type: 'paragraph', text: 'They make visible how services function across front-stage and back-stage experiences, helping teams create a shared understanding of the whole service.' },
    { type: 'heading', text: 'What service designers do' },
    { type: 'list', items: [
      'Make complex services visible',
      'Connect people, processes, systems and organisations',
      'Bring different disciplines together around a shared problem',
      'Turn research and insight into journeys, maps, concepts and service models',
      'Help teams identify assumptions, dependencies and unintended consequences',
      'Support testing, learning and iteration through delivery',
    ]},
    { type: 'paragraph', text: 'The methods below are the ones service designers reach for most often. Each one has a short reference — what it is, when to use it, what you do, what you produce, and what good looks like.' },
  ],
}

/**
 * Core Service Design methods for the MVP.
 *
 * Six curated methods, editorially structured per the brief:
 *   whatItIs · whenToUse · whatYouDo · whatYouProduce · whatGoodLooksLike
 *   · relatedMethods · resources (optional) · accountResources (future)
 *
 * Language stays close to the source PDF and to the editorial brief.
 */
export const sdMethods: Method[] = [
  {
    kind: 'method',
    id: 'sd-method-journey-mapping',
    title: 'Journey mapping',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'A journey map shows the end-to-end experience someone has as they move through a service. It uses research and insight to describe the stages of the experience, key touchpoints, goals, behaviours, moments of delight and areas of friction.',
    whenToUse: [
      'When a team needs a shared view of the current experience',
      'When research is spread across different sources',
      'When you need to identify pain points or opportunities',
      'When teams are focusing too narrowly on individual touchpoints',
    ],
    whatYouDo: [
      'Bring together relevant research and evidence',
      'Identify the user or archetype being mapped',
      'Define the main stages of the journey',
      'Map behaviours, needs and touchpoints',
      'Capture moments of friction and value',
      'Review the journey with the people who use or deliver the service',
    ],
    whatYouProduce: [
      'An end-to-end journey map',
      'Shared understanding of the current experience',
      'Prioritised pain points and opportunities',
      'Areas for further research or design',
    ],
    whatGoodLooksLike:
      'A good journey map is grounded in evidence. It makes the experience easier to understand without oversimplifying it. It shows where the most important moments, barriers and opportunities sit across the journey.',
    relatedMethods: [
      'sd-method-system-mapping',
      'sd-method-service-blueprints',
      'sd-method-visualisation-storytelling',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'Explore a best practice journey map from a Transform project.',
      ctaLabel: 'See the map →',
      ctaHref: '#',
    },
  },
  {
    kind: 'method',
    id: 'sd-method-system-mapping',
    title: 'System mapping',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'System mapping identifies the different actors, components and relationships involved in delivering a service. It creates a single picture of the wider system and helps teams understand where important connections, dependencies and value exchanges exist.',
    whenToUse: [
      'When a service involves many organisations or teams',
      'When dependencies are unclear',
      'When problems sit across organisational boundaries',
      'When changing one part of a service may affect several others',
    ],
    whatYouDo: [
      'Identify the main actors in the system',
      'Capture key components, such as processes, technology, communications, policy or funding',
      'Map the relationships between them',
      'Identify important dependencies and influence',
      'Look for gaps, tensions and high-value points in the system',
      'Review the map with people who understand different parts of the system',
    ],
    whatYouProduce: [
      'A visual map of the service system',
      'A shared view of dependencies and relationships',
      'Areas of risk or opportunity',
      'Questions that require further investigation',
    ],
    whatGoodLooksLike:
      'A strong system map makes complexity legible. It should help a multidisciplinary team see relationships that were previously hidden or understood only by individual specialists.',
    relatedMethods: [
      'sd-method-journey-mapping',
      'sd-method-service-blueprints',
      'sd-method-co-design',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'See a well-crafted system map from a live service.',
      ctaLabel: 'See the map →',
      ctaHref: '#',
    },
  },
  {
    kind: 'method',
    id: 'sd-method-service-blueprints',
    title: 'Service blueprints',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'A service blueprint visualises the whole service across customers, staff, processes and systems. It connects the visible user experience with the backstage activity required to make that experience happen.',
    whenToUse: [
      'When designing or improving an end-to-end service',
      'When front-stage and back-stage activity are disconnected',
      'When operational dependencies need to be understood',
      'When teams need a shared model of how the service should work',
    ],
    whatYouDo: [
      'Map the main stages of the service',
      'Capture what the user does and experiences',
      'Map staff or frontline activity',
      'Add backstage processes and systems',
      'Identify dependencies, hand-offs and failure points',
      'Review the blueprint across disciplines',
    ],
    whatYouProduce: [
      'An end-to-end service blueprint',
      'A shared view of roles and interactions',
      'Identified operational gaps and dependencies',
      'A clearer picture of what needs to change',
    ],
    whatGoodLooksLike:
      'A good blueprint connects user experience to operational reality. It should make clear what has to happen behind the scenes for the intended experience to be delivered successfully.',
    relatedMethods: [
      'sd-method-journey-mapping',
      'sd-method-system-mapping',
      'sd-method-co-design',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'Study a strong service blueprint example.',
      ctaLabel: 'See the blueprint →',
      ctaHref: '#',
    },
  },
  {
    kind: 'method',
    id: 'sd-method-co-design',
    title: 'Co-design',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'Co-design brings users, staff, stakeholders and subject-matter experts into the design process. It uses participatory approaches to explore challenges, test assumptions and develop ideas together.',
    whenToUse: [
      'When several groups need to shape an outcome together',
      'When lived experience or frontline knowledge is essential',
      'When assumptions need to be surfaced',
      'When shared ownership will be important to implementation',
    ],
    whatYouDo: [
      'Define the question or challenge',
      'Identify the people who need to participate',
      'Create a safe and structured environment',
      'Use activities to surface knowledge and assumptions',
      'Develop and prioritise ideas together',
      'Capture decisions, disagreements and unanswered questions',
    ],
    whatYouProduce: [
      'Shared understanding',
      'Prioritised ideas',
      'New service concepts',
      'Assumptions and questions to test',
      'Greater ownership of the outcome',
    ],
    whatGoodLooksLike:
      'Good co-design is not simply a workshop. It gives participants meaningful influence over the work and brings perspectives into the design process that the core team could not generate alone.',
    relatedMethods: [
      'sd-method-design-sprints',
      'sd-method-journey-mapping',
      'sd-method-system-mapping',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'Look at a co-design session in practice.',
      ctaLabel: 'See the session →',
      ctaHref: '#',
    },
  },
  {
    kind: 'method',
    id: 'sd-method-design-sprints',
    title: 'Design sprints',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'A design sprint is a time-boxed collaborative process, typically three to five days, where a multidisciplinary team explores a challenge, prototypes a response and tests it with users.',
    whenToUse: [
      'When a team needs to move quickly from divergent ideas to a testable direction',
      'When decisions are stalling and assumptions need to be surfaced',
      'When multidisciplinary input needs to be aligned around one challenge',
      'When the cost of getting a direction wrong at delivery would be high',
    ],
    whatYouDo: [
      'Frame the challenge and the decision the sprint needs to inform',
      'Bring together the disciplines and voices needed to shape it',
      'Explore the problem and generate ideas together',
      'Decide on a prototype direction to test',
      'Build a prototype that is just real enough to learn from',
      'Test with users and capture what changes',
    ],
    whatYouProduce: [
      'A tested prototype',
      'Evidence about the direction and its assumptions',
      'A shared, aligned team point of view',
      'Clear next steps',
    ],
    whatGoodLooksLike:
      'A design sprint moves a team from divergent thinking to a testable prototype in days. It surfaces assumptions early, gives a multidisciplinary group shared ownership of the direction and reduces the cost of getting delivery wrong.',
    relatedMethods: [
      'sd-method-co-design',
      'sd-method-service-blueprints',
      'sd-method-visualisation-storytelling',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'Walk through a design sprint case study.',
      ctaLabel: 'See the case study →',
      ctaHref: '#',
    },
  },
  {
    kind: 'method',
    id: 'sd-method-visualisation-storytelling',
    title: 'Visualisation & storytelling',
    minutes: 5,
    roles: ['service-designer'],
    whatItIs:
      'Turning research, insight and ideas into visual artefacts and narratives — journeys, personas, maps, prototypes, stories — that make abstract concepts tangible and easy to discuss.',
    whenToUse: [
      'When abstract ideas need to be debated and decided on',
      'When different disciplines need a shared reference',
      'When making the case for change to stakeholders',
      'When bringing lived experience into decision-making',
    ],
    whatYouDo: [
      'Choose the right artefact or story for the question at hand',
      'Ground it in evidence — research, quotes, data, observations',
      'Keep it legible to people outside the design discipline',
      'Test the artefact with the people it describes',
      'Iterate as understanding sharpens',
    ],
    whatYouProduce: [
      'Journey maps, service blueprints and system maps',
      'Personas and archetypes',
      'Prototypes and walkthroughs',
      'Narratives that describe the case for change',
    ],
    whatGoodLooksLike:
      'Strong visualisation makes complexity legible. It creates a shared reference that multidisciplinary teams can discuss, challenge and act on, and it carries lived experience into rooms it would not otherwise reach.',
    relatedMethods: [
      'sd-method-journey-mapping',
      'sd-method-service-blueprints',
      'sd-method-system-mapping',
    ],
    bestPractice: {
      image: '/photos/lego-show-and-tell.png',
      alt: 'Placeholder image.',
      description: 'See how a story shaped a real design decision.',
      ctaLabel: 'See the story →',
      ctaHref: '#',
    },
  },
]
