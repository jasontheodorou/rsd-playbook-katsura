// Stand-in content for the /modular options, copied from the first build (rsd-playbook
// src/data/modules.ts) on 2 October 2026.
import type { Card, Module } from './types'
import { sdOverviewCard, sdMethods } from './methods'

export type { ContentBlock, ResourceTint, ResourceItem, ResourceGroup, Card, Method, ModuleItem, Module } from './types'

// ── Account cards (shared across both pathways) ───────────────────────────────

const hmctsCard: Card = {
  id: 'acct-hmcts',
  title: 'Get to know the account',
  minutes: 5,
  roles: ['service-designer', 'interaction-designer'],
  content: [
    { type: 'paragraph', text: 'HM Courts and Tribunals Service (HMCTS) administers criminal, civil and family courts in England and Wales, and reserved unified tribunals across the UK.' },
    { type: 'paragraph', text: 'HMCTS works with an independent judiciary to provide a fair, efficient and effective justice system. Its services support people at important and often difficult moments, including:' },
    { type: 'list', items: [
      'Victims and witnesses',
      'Defendants',
      'Families in dispute',
      'People in debt or challenging employment decisions',
      'People challenging government decisions',
    ]},
    { type: 'heading', text: 'What this means for your work' },
    { type: 'paragraph', text: 'Justice services are complex. People may move between different services, organisations and channels as a case progresses.' },
    { type: 'paragraph', text: 'When you work on the HMCTS account, understand the whole journey. Design for access to justice, not only completion of a digital task.' },
    { type: 'callout', variant: 'involve', body: 'Work with public users, legal professionals, court and tribunal staff, operational teams and other justice organisations. Include people who face barriers to accessing justice.' },
  ],
}

const dfeCard: Card = {
  id: 'acct-dfe',
  title: 'Get to know the account',
  minutes: 5,
  roles: ['service-designer', 'interaction-designer'],
  content: [
    { type: 'paragraph', text: 'The Department for Education (DfE) is responsible for children\'s services and education in England, covering early years, schools, further education and higher education.' },
    { type: 'paragraph', text: 'The account covers a wide service landscape. Users and delivery partners can include:' },
    { type: 'list', items: [
      'Children, learners, parents and carers',
      'Teachers, school and college staff, and training providers',
      'Local authorities and national agencies',
      'People working in children\'s and health services',
    ]},
    { type: 'heading', text: 'What this means for your work' },
    { type: 'paragraph', text: 'When you work on the DfE account, look beyond a single transaction. Understand how policy, local delivery, professional practice and the learner\'s wider journey connect.' },
    { type: 'paragraph', text: 'DfE expects teams to design accessible, user-centred and secure services using departmental standards and the GOV.UK Service Standard.' },
    { type: 'callout', variant: 'tool', body: 'Check DfE Design, departmental standards and its Service Standard guidance before creating a new pattern or component.', ctaLabel: 'Open DfE design guidance', ctaHref: '#' },
  ],
}

/**
 * Get to know the policies (HMCTS)
 * Sits immediately after the account card for HMCTS users. GOV.UK-style
 * explainer of three policies that shape service design in the account.
 * Kept short: one paragraph per policy, plain English, action-oriented.
 */
const hmctsPoliciesCard: Card = {
  id: 'acct-hmcts-policies',
  title: 'Get to know the policies',
  minutes: 6,
  roles: ['service-designer', 'interaction-designer'],
  content: [
    { type: 'paragraph', text: 'Three policies shape how services are designed and delivered in HMCTS. Understand each before you make design decisions.' },

    { type: 'heading', text: 'Reasonable adjustments' },
    { type: 'paragraph', text: 'HMCTS must make services accessible to disabled people and to those with additional needs. This applies to every service, digital or otherwise.' },
    { type: 'paragraph', text: 'Design so that users can request an adjustment at any point in the journey — not only at the start. Make it easy to change or cancel an adjustment as circumstances change.' },
    { type: 'list', items: [
      'Meet the WCAG 2.2 AA accessibility standard as a minimum',
      'Offer a non-digital route for anyone who cannot use the digital service',
      'Test the service with people who use assistive technology',
    ]},

    { type: 'heading', text: 'Digital by default, not digital only' },
    { type: 'paragraph', text: 'HMCTS services aim to be digital-first, but must always support people who cannot or do not want to use them online.' },
    { type: 'paragraph', text: 'When you design a digital service, design the assisted digital and non-digital routes alongside it. Treat them as part of the same service, not as fallbacks.' },
    { type: 'list', items: [
      'Provide clear signposting to telephone, paper and face-to-face routes',
      'Design consistent outcomes across every channel',
      'Measure take-up and success rates across all channels, not just digital',
    ]},

    { type: 'heading', text: 'Data protection and privacy' },
    { type: 'paragraph', text: 'HMCTS handles sensitive personal data — including data about vulnerable people, victims, witnesses and children. All services must comply with the UK GDPR and the Data Protection Act 2018.' },
    { type: 'paragraph', text: 'Collect the minimum data needed to deliver the service. Be clear with users about what you are collecting, why, and who it will be shared with.' },
    { type: 'list', items: [
      'Complete a Data Protection Impact Assessment for new services or significant changes',
      'Follow the principle of data minimisation at every step',
      'Design for people to see, correct and — where lawful — delete their data',
    ]},

    { type: 'callout', variant: 'best-practice', body: 'When in doubt, involve the HMCTS privacy, accessibility or policy team early. Retrofitting a policy check late in delivery is far more costly than designing to the policy from the start.' },
  ],
}

// ── Senior service designer — modules ────────────────────────────────────────

const sdModules: Module[] = [
  {
    id: 'sd-practice',
    title: 'The practice we share',
    description: 'The shared philosophy, standards and working habits behind Transform\'s research and design practice.',
    cards: [
      {
        id: 'sd-ps-c1',
        title: 'Turn uncertainty into possibility',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Transform exists to turn uncertainty into clarity and possibility.' },
          { type: 'paragraph', text: 'We enable better, collective decisions through a deep understanding of people, places, systems and contexts.' },
          { type: 'paragraph', text: 'In practice, this means:' },
          { type: 'list', items: [
            'Expanding understanding and enabling sensemaking',
            'Reframing problems before reaching for solutions',
            'Using evidence, empathy and iteration',
            'Practising with rigour, ethics, transparency and accountability',
          ]},
          { type: 'callout', variant: 'involve', body: 'Bring together people who use, deliver, manage and own the service. Different perspectives help a group hold more information and make better decisions.' },
        ],
      },
      {
        id: 'sd-ps-c2',
        title: 'Design for real outcomes',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Good research and design helps us think better, act with empathy and deliver value that is effective, trusted and human.' },
          { type: 'paragraph', text: 'At its best, design:' },
          { type: 'list', items: [
            'Addresses root causes rather than symptoms',
            'Reduces duplication and simplifies interactions',
            'Prevents failure demand',
            'Builds trust by making services clear, fair and easy to use',
          ]},
          { type: 'paragraph', text: 'Good design also strengthens learning and adaptability — helping organisations prevent future problems, create long-term value and work across professions, organisations and communities.' },
        ],
      },
      {
        id: 'sd-ps-c3',
        title: 'Know what design means',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'At Transform, design goes beyond the visual. It is how we approach problem-solving.' },
          { type: 'paragraph', text: 'Great design creates solutions that are:' },
          { type: 'list', items: [
            'Desirable for people',
            'Feasible to deliver',
            'Viable against business goals',
            'Sustainable for the long term',
          ]},
          { type: 'paragraph', text: 'Researchers and designers bridge all four. We combine creativity, robust evidence and participation to reduce delivery risk, build legitimacy and create value.' },
          { type: 'callout', variant: 'best-practice', body: 'Be clear about what design means on the project. Ambiguity leads to misalignment, superficial practice and disillusionment.' },
        ],
      },
      {
        id: 'sd-ps-c4',
        title: 'Use head, heart, hands',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Head, Heart and Hands is Transform\'s research and design philosophy.' },
          { type: 'list', items: [
            'Head is how we think and frame our work — understanding people, their context and the systems around them.',
            'Heart is what we care about — solving the right problem, working together and keeping people at the centre.',
            'Hands is how we deliver — turning ideas into working services, testing assumptions and changing direction when the evidence tells us to.',
          ]},
        ],
      },
      {
        id: 'sd-ps-c5',
        title: 'See the whole system',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'People who use, deliver and manage services do not exist in a vacuum.' },
          { type: 'heading', text: 'The Design Landscape' },
          { type: 'paragraph', text: 'The Design Landscape asks us to understand five layers:' },
          { type: 'list', items: [
            'Individual needs, capability, motivation and opportunity',
            'Service barriers, technology and delivery needs',
            'Organisational goals, priorities, capability and culture',
            'Community networks and relationships',
            'Environmental factors that affect adoption and scale',
          ]},
          { type: 'paragraph', text: 'Understanding this ecosystem is essential when designing end-to-end and front-to-back services.' },
          { type: 'callout', variant: 'tool', body: 'Use the Design Landscape to explore the individual, service, organisation, community and environment.', ctaLabel: 'View the Design Landscape', ctaHref: '#' },
        ],
      },
      {
        id: 'sd-ps-c6',
        title: 'Design with people',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Participatory design is our default.' },
          { type: 'paragraph', text: 'We work with clients, stakeholders, staff and customers — bringing them into the centre of the design. Participation helps people:' },
          { type: 'list', items: [
            'Walk through scenarios and develop future journeys',
            'Co-create service maps, roles and structures',
            'Bring concepts to life and test them together',
          ]},
          { type: 'paragraph', text: 'This builds shared visions, strengthens the conditions for new services and brings hidden user groups into focus. It also builds research and design capability that can continue after the project.' },
          { type: 'callout', variant: 'best-practice', body: 'Design with people, not to them. Start with lived experience and seek out those who are least heard and most affected.' },
        ],
      },
      {
        id: 'sd-ps-c7',
        title: 'Meet the quality standard',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Transformational Design is the governing framework for how we work and assess our work.' },
          { type: 'paragraph', text: 'Our services should:' },
          { type: 'list', items: [
            'Work for everyone, including people most at risk of exclusion',
            'Be grounded in lived experience',
            'Be ethical, accessible and equitable',
            'Integrate across policy, services and place',
            'Adapt continuously through evidence',
            'Prevent harm and reduce long-term cost',
            'Build trust and legitimacy',
          ]},
          { type: 'paragraph', text: 'We measure quality against five principles: human-centred, participatory, visualised, iterative and holistic.' },
        ],
      },
    ],
  },
  {
    id: 'sd-methods',
    title: 'Methods',
    description: 'The core methods service designers reach for most often. Each one is a short practical reference — what it is, when to use it, what you do, what you produce, and what good looks like.',
    cards: [
      sdOverviewCard,
      ...sdMethods,
    ],
  },
  {
    id: 'sd-shape',
    title: 'How you shape the work',
    description: 'How senior service designers frame problems, create conditions for design and connect vision to delivery.',
    cards: [
      {
        id: 'sd-sw-c1',
        title: 'Reframe the problem',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'A service can only be as good as its understanding of the problem it is addressing.' },
          { type: 'paragraph', text: 'Your job is to open up more than one frame. This means:' },
          { type: 'list', items: [
            'Surfacing lived experience, system dynamics and unintended consequences',
            'Connecting user needs to business and policy goals',
            'Focusing on root causes rather than symptoms',
            'Remaining flexible and humble about how the problem is understood',
          ]},
          { type: 'paragraph', text: 'As a senior service designer, make the framing visible so the team can test it — rather than treating it as fact.' },
          { type: 'callout', variant: 'tool', body: 'Use assumption mapping and problem statements during Define.', ctaLabel: 'View Define methods', ctaHref: '#' },
        ],
      },
      {
        id: 'sd-sw-c2',
        title: 'Enable shared sensemaking',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Use visualisation, prototyping and collaborative tools to help groups hold more information and perspectives at once.' },
          { type: 'paragraph', text: 'Artefacts like journey maps, personas, prototypes and insight visualisations create a shared language. Stories can:' },
          { type: 'list', items: [
            'Uncover hidden challenges',
            'Describe the case for change',
            'Show the human elements of the work',
            'Make a future vision tangible',
          ]},
          { type: 'paragraph', text: 'Your role is to make complexity legible — without removing the differences that matter.' },
          { type: 'callout', variant: 'involve', body: 'Work with users, business owners, managers, frontline staff and subject matter experts when their knowledge affects the decision.' },
        ],
      },
      {
        id: 'sd-sw-c3',
        title: 'Shape conditions for design',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Design cannot succeed in a vacuum.' },
          { type: 'paragraph', text: 'It needs the right conditions, including:' },
          { type: 'list', items: [
            'Leadership and culture that support experimentation and learning',
            'Multidisciplinary teams that can co-own outcomes',
            'Shared language, standards, resources and mandates',
          ]},
          { type: 'paragraph', text: 'Senior service designers shape these conditions as well as the service. Build collaboration across boundaries, make design part of the programme and help others understand what it is for.' },
        ],
      },
      {
        id: 'sd-sw-c4',
        title: 'Build trust and accountability',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Participatory and iterative practice still needs clarity, scrutiny and traceability.' },
          { type: 'paragraph', text: 'When working with people and data, you should:' },
          { type: 'list', items: [
            'Be transparent about the purpose of research and data collection',
            'Respect confidentiality, rights and wellbeing',
            'Exercise independent professional judgement',
            'Balance the needs of participants, clients and the work',
          ]},
          { type: 'paragraph', text: 'Make evidence, decisions and progress visible. Work in the open, invite feedback and use measurable criteria to monitor performance over time.' },
          { type: 'callout', variant: 'best-practice', body: 'Challenge overclaiming. Show how and why design has improved an outcome, and record the evidence behind important decisions.' },
        ],
      },
      {
        id: 'sd-sw-c5',
        title: 'Connect vision to delivery',
        minutes: 5,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'A vision has value when it can become a working service.' },
          { type: 'paragraph', text: 'Work incrementally with colleagues, clients and partners. Focus on the elements that deliver the greatest value, and test assumptions throughout the lifecycle.' },
          { type: 'paragraph', text: 'Use the right artefacts to connect direction to delivery:' },
          { type: 'list', items: [
            'Service blueprints to link the customer experience with staff, processes and systems',
            'Process models to show how work moves through the organisation',
            'Product roadmaps to set priorities while remaining responsive to change',
          ]},
          { type: 'callout', variant: 'tool', body: 'Use a service blueprint to connect the customer experience with staff, processes and systems.', ctaLabel: 'View service blueprints', ctaHref: '#' },
        ],
      },
      {
        id: 'sd-sw-c6',
        title: 'Challenge design theatre',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Tools and rituals do not create value by themselves.' },
          { type: 'paragraph', text: 'Design fails when teams copy workshops, Post-its and prototypes without their purpose or discipline. Watch for:' },
          { type: 'list', items: [
            'Activities that are not linked to a decision or outcome',
            'Endless research loops that never reach delivery',
            'Overclaiming the impact of design without evidence',
          ]},
          { type: 'paragraph', text: 'Set a clear purpose for each method. Link activity to a decision, an outcome or a risk that needs to be reduced.' },
        ],
      },
      {
        id: 'sd-sw-c7',
        title: 'Build capability through doing',
        minutes: 4,
        roles: ['service-designer'],
        content: [
          { type: 'paragraph', text: 'Participation demonstrates value and builds knowledge through doing.' },
          { type: 'paragraph', text: 'Invite clients and colleagues to experience the approach themselves. Work through:' },
          { type: 'list', items: [
            'Scenarios and future journeys',
            'Service maps, roles and structures',
            'Concepts brought to life and tested together',
          ]},
          { type: 'paragraph', text: 'Share practices, knowledge and evidence across the multidisciplinary team. Build in-house skills so learning and innovation can continue after the project.' },
          { type: 'callout', variant: 'involve', body: 'Include the people who will own, deliver and improve the service after the project.' },
        ],
      },
    ],
  },
]

// ── Consultant interaction designer — modules ─────────────────────────────────

const idModules: Module[] = [
  {
    id: 'id-practice',
    title: 'The practice we share',
    description: 'The shared philosophy, standards and working habits behind Transform\'s research and design practice.',
    cards: [
      {
        id: 'id-ps-c1',
        title: 'Turn uncertainty into possibility',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Transform exists to turn uncertainty into clarity and possibility.' },
          { type: 'paragraph', text: 'We enable better, collective decisions through a deep understanding of people, places, systems and contexts.' },
          { type: 'paragraph', text: 'Interaction design contributes by making future experiences visible and testable — from early sketches to high-fidelity prototypes.' },
          { type: 'paragraph', text: 'In practice, this means:' },
          { type: 'list', items: [
            'Using evidence, empathy and iteration',
            'Creating real-world outcomes that are meaningful, equitable and sustainable',
            'Practising with rigour, ethics, transparency and accountability',
          ]},
        ],
      },
      {
        id: 'id-ps-c2',
        title: 'Design for real outcomes',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Good research and design helps us think better, act with empathy and deliver value that is effective, trusted and human.' },
          { type: 'paragraph', text: 'It solves real problems, reduces waste and makes services clear, fair and easy to use. It also builds learning and feedback into delivery so services can adapt.' },
          { type: 'paragraph', text: 'A successful interaction is not only usable. It supports a service that people understand and trust.' },
        ],
      },
      {
        id: 'id-ps-c3',
        title: 'Know what design means',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Design goes beyond the visual. It is how we approach problem-solving.' },
          { type: 'paragraph', text: 'Great design creates solutions that are:' },
          { type: 'list', items: [
            'Desirable for people',
            'Feasible to deliver',
            'Viable against business goals',
            'Sustainable for the long term',
          ]},
          { type: 'paragraph', text: 'Interaction designers bridge human needs and digital delivery. The work should be clear, inclusive and evidence-driven so people can use services easily, safely and with confidence.' },
          { type: 'callout', variant: 'best-practice', body: 'Do not leave design to guesswork. Use research and insight to inform the interaction.' },
        ],
      },
      {
        id: 'id-ps-c4',
        title: 'Use head, heart, hands',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Head, Heart and Hands is Transform\'s research and design philosophy.' },
          { type: 'list', items: [
            'Head means understanding people and context before designing the future.',
            'Heart means solving the right problem, working together and keeping people at the centre.',
            'Hands means making ideas tangible, testing assumptions and improving designs through the project lifecycle.',
          ]},
          { type: 'paragraph', text: 'For interaction design, this connects evidence and empathy with the craft of making a service usable.' },
        ],
      },
      {
        id: 'id-ps-c5',
        title: 'See the whole service',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'People do not experience a screen in isolation.' },
          { type: 'paragraph', text: 'Their experience is shaped by many things beyond the interface:' },
          { type: 'list', items: [
            'Their needs and capabilities',
            'The service context and the organisation',
            'Their community and the wider environment',
            'Channels, staff interactions and processes they cannot see',
          ]},
          { type: 'paragraph', text: 'Understand how the interaction fits within the end-to-end and front-to-back service. This helps you avoid improving one screen while leaving the wider journey confusing.' },
          { type: 'callout', variant: 'tool', body: 'Use a journey map or service blueprint to see what happens before, during and after the interaction.', ctaLabel: 'View experience design methods', ctaHref: '#' },
        ],
      },
      {
        id: 'id-ps-c6',
        title: 'Design with people',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Participatory design is our default.' },
          { type: 'paragraph', text: 'Work in multidisciplinary teams and bring clients, stakeholders, staff and customers into the centre of the design. Use co-design, prototypes and testing to explore ideas together.' },
          { type: 'paragraph', text: 'Participation can:' },
          { type: 'list', items: [
            'Reveal hidden assumptions',
            'Strengthen the design',
            'Build legitimacy',
            'Help teams develop a shared vision',
          ]},
        ],
      },
      {
        id: 'id-ps-c7',
        title: 'Build accessibility in',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Accessibility is a foundation, not a layer added later.' },
          { type: 'paragraph', text: 'From the start, you should:' },
          { type: 'list', items: [
            'Focus on people most at risk of exclusion',
            'Consider cognitive accessibility as well as physical disability',
            'Reduce unnecessary demand on the user',
            'Support people to recover from errors',
            'Use clear, accurate information throughout',
          ]},
          { type: 'paragraph', text: 'Aim beyond compliance. Design the whole experience so people can use the service easily, safely and with confidence.' },
          { type: 'callout', variant: 'best-practice', body: 'Include people with visible and hidden disabilities, digital inclusion needs and other barriers in usability evaluation.' },
        ],
      },
    ],
  },
  {
    id: 'id-shape',
    title: 'How you shape the work',
    description: 'How interaction designers work from evidence, collaborate across disciplines and take responsibility for quality.',
    cards: [
      {
        id: 'id-sw-c1',
        title: 'Work from evidence',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Human-centred design always uses research and insight. Nothing should be left to guesswork.' },
          { type: 'paragraph', text: 'In practice, this means:' },
          { type: 'list', items: [
            'Understanding the evidence behind the user need',
            'Using research, data, observation and evaluation to support design choices',
            'Where evidence is incomplete, making the assumption clear and testing it',
          ]},
          { type: 'paragraph', text: 'At consultant level, build the habit of explaining which evidence informed a choice — and what still needs to be learned.' },
          { type: 'callout', variant: 'best-practice', body: 'In reviews, separate evidence from assumptions. This makes it clearer what the team knows and what it needs to test.' },
        ],
      },
      {
        id: 'id-sw-c2',
        title: 'Collaborate creatively',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Interaction design is defined by creative collaboration.' },
          { type: 'paragraph', text: 'Work with research, service design, content, product and technology. Multidisciplinary teams should work in the open and co-own outcomes.' },
          { type: 'paragraph', text: 'Use co-design and short cycles to:' },
          { type: 'list', items: [
            'Explore and prototype ideas together',
            'Bring colleagues in early enough for their knowledge to change the design',
            'Test and iterate before committing to a direction',
          ]},
          { type: 'callout', variant: 'involve', body: 'Work with the user researcher, content designer, service designer, product lead and developer when their decisions affect the experience.' },
        ],
      },
      {
        id: 'id-sw-c3',
        title: 'Make the work visible',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Visualisation helps people understand and discuss the experience.' },
          { type: 'paragraph', text: 'Translate research into artefacts that show:' },
          { type: 'list', items: [
            'How people interact with the service',
            'Where they face barriers',
            'Where the experience works well',
          ]},
          { type: 'paragraph', text: 'Use journey maps, storyboards, user scenarios and prototypes to make the work tangible. A picture can help a team hold more information at once — but it should remain grounded in evidence.' },
        ],
      },
      {
        id: 'id-sw-c4',
        title: 'Build, test and repeat',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Transform\'s practice is iterative.' },
          { type: 'paragraph', text: 'Make ideas tangible early. The cycle is:' },
          { type: 'list', items: [
            'Build — make something testable',
            'Test — observe what happens with real people',
            'Learn — understand what the evidence says',
            'Improve — change the design based on what you found',
          ]},
          { type: 'paragraph', text: 'Work through Discover, Define, Design and Deliver as a continuous lifecycle. Needs and capabilities change, so the service must be able to evolve and adapt.' },
          { type: 'callout', variant: 'tool', body: 'Use sketches, wireframes, storyboards, prototypes and usability testing during Design.', ctaLabel: 'View the delivery framework', ctaHref: '#' },
        ],
      },
      {
        id: 'id-sw-c5',
        title: 'Explain your decisions',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Transformational design uses transparency, evidence and impact.' },
          { type: 'paragraph', text: 'Work in the open, share progress and embrace feedback. For each design decision, you should be able to explain:' },
          { type: 'list', items: [
            'Which evidence informed the choice',
            'What the design is expected to achieve',
            'What would cause you to change it',
          ]},
          { type: 'paragraph', text: 'Use prototypes and visual storytelling to make decisions easy to understand. Record important evidence and changes so the team can trace how the design developed.' },
        ],
      },
      {
        id: 'id-sw-c6',
        title: 'Design responsibly',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Design can fail when teams copy its rituals without the purpose or discipline behind them.' },
          { type: 'paragraph', text: 'Avoid design theatre. Choose a method because it:' },
          { type: 'list', items: [
            'Answers a specific question',
            'Tests an assumption',
            'Reduces a delivery risk',
          ]},
          { type: 'paragraph', text: 'Be honest about what the design has proved. A prototype is not a working service, and a preference is not evidence.' },
          { type: 'callout', variant: 'best-practice', body: 'State the question before creating a prototype. Define what you need to learn and what would change the design.' },
        ],
      },
      {
        id: 'id-sw-c7',
        title: 'Grow through practice',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Transform specialists are empathetic researchers, creative experimenters, strategic collaborators and ethical stewards of change.' },
          { type: 'paragraph', text: 'Expertise is not only what we design. It is also how we help others see, understand and adapt to the needs of people who experience the service.' },
          { type: 'paragraph', text: 'Build your judgement by:' },
          { type: 'list', items: [
            'Working with other disciplines',
            'Reviewing evidence and testing designs',
            'Learning from feedback',
            'Asking for support when a decision depends on a wider service, research or technical question',
          ]},
        ],
      },
    ],
  },
  {
    id: 'id-craft',
    title: 'Your craft in practice',
    description: 'The methods and disciplines of interaction design — from task analysis to prototyping to delivery.',
    cards: [
      {
        id: 'id-cp-c1',
        title: 'Make interactions clear',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Interaction designers make digital interactions clear, inclusive and evidence-driven.' },
          { type: 'paragraph', text: 'The aim is to help everyone use products and services easily, safely and with confidence. The work involves:' },
          { type: 'list', items: [
            'Creative collaboration and co-design',
            'Prototyping and usability evaluation',
            'Visual storytelling and strategic design',
          ]},
          { type: 'paragraph', text: 'Interaction design is not limited to screens. It connects the detailed interaction with the end-to-end functional experience and the wider service.' },
        ],
      },
      {
        id: 'id-cp-c2',
        title: 'Understand the task',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Task analysis identifies the cognitive activities needed to complete a task.' },
          { type: 'paragraph', text: 'Break the task into critical steps and observe how users, staff or stakeholders complete it. This reveals:' },
          { type: 'list', items: [
            'Where time and effort are being lost',
            'Where confusion affects the experience',
            'Where the current design creates blockers',
          ]},
          { type: 'paragraph', text: 'Contextual inquiry adds real-world detail — observe people in their everyday environment, set tasks and see where they understand the service or face blockers.' },
          { type: 'callout', variant: 'tool', body: 'Use task analysis and contextual inquiry before deciding the interaction flow.', ctaLabel: 'View task analysis', ctaHref: '#' },
        ],
      },
      {
        id: 'id-cp-c3',
        title: 'Design for mental models',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'A mental model is how someone believes a product or service should work.' },
          { type: 'paragraph', text: 'It can be shaped by previous experiences, including other services. Understanding that perspective helps you make an interaction more usable, intuitive and relevant.' },
          { type: 'paragraph', text: 'Information architecture organises content so people can learn, navigate and adapt with minimal difficulty. Card sorting can show how people group and understand information.' },
          { type: 'callout', variant: 'involve', body: 'Work with the user researcher and content designer to understand language, expectations and navigation.' },
        ],
      },
      {
        id: 'id-cp-c4',
        title: 'Create a clear flow',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Optimal information flow reduces the amount of information people must handle at one time.' },
          { type: 'paragraph', text: 'To create a clear flow:' },
          { type: 'list', items: [
            'Structure the journey so it is easy to follow and not too dense',
            'Reduce the information requested up front where this helps people complete the task',
            'Use user scenarios to describe how someone interacts with the service in a real situation',
          ]},
          { type: 'paragraph', text: 'A user scenario should include the person\'s context, needs and the steps in the experience.' },
        ],
      },
      {
        id: 'id-cp-c5',
        title: 'Support error and recovery',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Ethical and equitable services design for user error.' },
          { type: 'paragraph', text: 'To support correction and recovery:' },
          { type: 'list', items: [
            'Make it easy to adjust on the path to completing a task',
            'Reduce assumptions about ability',
            'Build confidence and avoid unnecessary anxiety',
            'Use plain language and coherent structures throughout',
          ]},
          { type: 'paragraph', text: 'Information should be clear, empathetic, accessible and accurate — so people do not need expert help to understand what to do.' },
          { type: 'callout', variant: 'best-practice', body: 'Design and test the correction path as part of the main experience, not as an afterthought.' },
        ],
      },
      {
        id: 'id-cp-c6',
        title: 'Choose prototype fidelity',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Prototyping moves from low-fidelity wireframes and sketches to high-fidelity visual and clickable designs.' },
          { type: 'paragraph', text: 'Choose the approach that answers the question:' },
          { type: 'list', items: [
            'Throwaway prototypes — quick feedback and course correction',
            'Parallel prototypes — compare several ideas at once',
            'Evolutionary prototypes — build and refine through repeated cycles',
            'Incremental prototypes — add to a working baseline over time',
          ]},
          { type: 'paragraph', text: 'Use early prototypes to test concepts. Use higher fidelity to explore detail and behaviour closer to the final product. Do not add fidelity that does not help answer the question.' },
          { type: 'callout', variant: 'tool', body: 'Compare throwaway, evolutionary, incremental and parallel prototyping methods.', ctaLabel: 'View prototyping methods', ctaHref: '#' },
        ],
      },
      {
        id: 'id-cp-c7',
        title: 'Test usability',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'User testing explores how easily a design allows someone to complete a task.' },
          { type: 'paragraph', text: 'Use representative groups and observe what people do. Repeated testing can reveal flaws that would otherwise be missed — particularly for people with disabilities or additional needs.' },
          { type: 'paragraph', text: 'Heuristic evaluation compares the interface with best-practice standards. It can identify usability issues before or alongside testing with users.' },
          { type: 'callout', variant: 'involve', body: 'Plan usability evaluation with a user researcher. Include people with relevant access and digital inclusion needs.' },
        ],
      },
      {
        id: 'id-cp-c8',
        title: 'Tell the interaction story',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Storyboards show the key events and situations in a user\'s experience.' },
          { type: 'paragraph', text: 'They make research, ideas, context and emotion visible. Designers and developers can use them to explore what it will take to make the future experience real.' },
          { type: 'paragraph', text: 'Service walkthroughs use sketches or mock-ups to support a narrative. Walk users, stakeholders or subject matter experts through the proposed experience and gather feedback as it evolves.' },
        ],
      },
      {
        id: 'id-cp-c9',
        title: 'Work with content',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Good content starts with understanding users — their motivations, goals, needs and behaviours.' },
          { type: 'paragraph', text: 'Content and interaction should help people complete tasks quickly and accurately. The following all shape whether the service is understandable and useful:' },
          { type: 'list', items: [
            'Information architecture',
            'Accessible writing',
            'Optimal information flow',
          ]},
          { type: 'paragraph', text: 'Work collaboratively with users, content designers, product managers and developers. The content includes text, images and multimedia — not only copy.' },
          { type: 'callout', variant: 'best-practice', body: 'Review structure, labels, guidance and error messages with the content designer before high-fidelity design.' },
        ],
      },
      {
        id: 'id-cp-c10',
        title: 'Work with technology',
        minutes: 4,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Interaction design must be feasible to deliver as well as desirable for users.' },
          { type: 'paragraph', text: 'Work with developers to:' },
          { type: 'list', items: [
            'Understand what is needed for a working service',
            'Identify feasibility issues early',
            'Use interactive prototypes to test usability, interactions and technology together',
          ]},
          { type: 'paragraph', text: 'Consider sustainable UX. Content, interactions and data-heavy components use energy. Use clear content, short click paths and optimised images, video, icons, fonts and other assets.' },
          { type: 'callout', variant: 'involve', body: 'Review important interactions with developers while the design can still change.' },
        ],
      },
      {
        id: 'id-cp-c11',
        title: 'Refine through delivery',
        minutes: 5,
        roles: ['interaction-designer'],
        content: [
          { type: 'paragraph', text: 'Treat the design lifecycle as continuous and iterative.' },
          { type: 'list', items: [
            'Discover — explore the service landscape using qualitative and quantitative methods',
            'Define — agree aims, assumptions, problem statements and journeys',
            'Design — work with wireframes, storyboards, prototypes and usability testing',
            'Deliver — release into the real world and measure impact',
          ]},
          { type: 'paragraph', text: 'As needs and capabilities change, designs should evolve and adapt.' },
          { type: 'paragraph', text: 'High-fidelity designs can support final visual evaluation — but they should build on evidence from earlier research, prototyping and testing.' },
          { type: 'callout', variant: 'tool', body: 'Use the Discover, Define, Design and Deliver framework to identify the next learning activity.', ctaLabel: 'View the delivery framework', ctaHref: '#' },
        ],
      },
    ],
  },
]

// ── Public API ─────────────────────────────────────────────────────────────────

export type RoleId = 'service-designer' | 'interaction-designer'
export type AccountId = 'hmcts' | 'dfe'

/** Every module for a role, with the account's cards added to the end of the first module. */
export function getModulesForUser(role: RoleId, account: AccountId | null): Module[] {
  const baseModules = role === 'service-designer' ? sdModules : idModules
  if (!account) return baseModules
  const appended = account === 'hmcts' ? [hmctsCard, hmctsPoliciesCard] : [dfeCard]
  return baseModules.map((mod, i) => (i === 0 ? { ...mod, cards: [...mod.cards, ...appended] } : mod))
}
