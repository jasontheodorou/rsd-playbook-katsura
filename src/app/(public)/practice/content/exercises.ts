/**
 * Shorter exercise wording (3 October 2026, Jason: some exercises are "VERY wordy"; cut each "as
 * much as possible without losing meaning"). Each entry replaces one asset's props from the plan,
 * keyed "course.card.component"; myp-demo.json stays an exact copy of the manual explorer's plan.
 * The manual's own words (the flip cards' principles) are not cut. Wording the components read
 * from is kept: quoted subject lines and messages, the crowd's people, and "a cognitive barrier".
 */
export const EXERCISES: Record<string, Record<string, unknown>> = {
  '1.1.slider': {
    label: 'Design from the edges inward',
    ends: ['Design for the average', 'Design from the edges'],
    stops: [
      {
        label: 'Designed for the average',
        state:
          'It suits people in the middle. Five people at the edges cannot use it: a wheelchair user, a second-language reader, a carer with five minutes, someone with low vision and someone with no smartphone.',
        value: 62,
        valueLabel: '62 of 100 can use it',
      },
      {
        label: 'Add step-free access',
        state: 'The wheelchair user can get in. So can parents with buggies.',
        value: 70,
        valueLabel: '70 of 100 can use it',
      },
      {
        label: 'Use plain words',
        state: 'The second-language reader can follow it. So can anyone tired or rushed.',
        value: 81,
        valueLabel: '81 of 100 can use it',
      },
      {
        label: 'Let people save and return',
        state: 'The carer can finish in two sittings.',
        value: 89,
        valueLabel: '89 of 100 can use it',
      },
      {
        label: 'Offer large text, phone and paper',
        state: 'The person with low vision and the person with no smartphone can now use it.',
        value: 96,
        valueLabel: '96 of 100 can use it',
      },
    ],
    lesson: 'Every change for someone at the edge helped people in the middle too.',
  },
  '1.2.slider': {
    label: 'Clear design cuts failure demand',
    ends: ['Original letter', 'Clear letter'],
    stops: [
      {
        label: 'The original letter',
        state:
          "Subject: 'Council Tax Reduction Scheme: notification of change in circumstances assessment.' The deadline is on page 2.",
        value: 240,
        valueLabel: '240 calls for every 1,000 letters',
      },
      {
        label: 'Plain words',
        state: "Jargon becomes 'We need to check your income'.",
        value: 180,
        valueLabel: '180 calls for every 1,000 letters',
      },
      {
        label: 'Deadline first',
        state: "The first line says 'Send us your payslips by 14 March.'",
        value: 120,
        valueLabel: '120 calls for every 1,000 letters',
      },
      {
        label: 'One clear action',
        state:
          "One action, with a link to do it online. Subject: 'Send us your payslips by 14 March to keep your discount.'",
        value: 70,
        valueLabel: '70 calls for every 1,000 letters',
      },
    ],
    lesson:
      'Most calls were failure demand: contact caused by something unclear. Clear design prevents them.',
  },
  '1.3.step': {
    label: 'From symptom to root cause',
    start: 'People miss their hospital appointments.',
    steps: [
      { button: 'Why?', text: 'They forget the date.' },
      { button: 'Why?', text: 'They rely on the reminder text, and many miss it.' },
      { button: 'Why?', text: 'It arrives at 10am, when many are at work.' },
      { button: 'Why?', text: 'The system sends every reminder in one morning batch.' },
      { button: 'Why?', text: 'The time was set years ago, and nobody owns it.' },
    ],
    end: 'More letters treat the symptom. Giving someone ownership of reminders, and testing an evening text, fixes the cause.',
  },
  '1.5.flip': {
    label: 'The five principles',
    cards: [
      {
        front: 'Human-Centred',
        icon: 'UserFocus',
        back: {
          cid: 'M3.3',
          text: 'Always use research and insight to inform design. Nothing should be left to guess work.',
          example: 'Every design decision points back to research.',
        },
      },
      {
        front: 'Participatory',
        icon: 'UsersThree',
        back: {
          cid: 'M3.4',
          text: 'Multi-disciplinary teams, working in the open, bringing clients, stakeholders, staff and customers, into the centre of the design.',
          example: 'Clients, staff and users share one workshop.',
        },
      },
      {
        front: 'Visualised',
        icon: 'Eye',
        back: {
          cid: 'M3.5',
          text: 'A picture tells a thousand words. Everything we produce should be a work of art - considered, cared for and something we are proud of.',
          example: 'The team can explain the journey from one wall.',
        },
      },
      {
        front: 'Holistic',
        icon: 'GlobeHemisphereWest',
        back: {
          cid: 'M3.6',
          text: 'Think beyond the product or service and look at the whole environment - how people engage with the service, how they feel and what challenges they face along the journey.',
          example: 'The map covers what happens before and after the screen.',
        },
      },
      {
        front: 'Iterative',
        icon: 'ArrowsClockwise',
        back: {
          cid: 'M3.7',
          text: 'Build, test, iterate and repeat. Continue for as long as time allows. It will lead to a better outcome.',
          example: 'Version 2 is planned before version 1 ships.',
        },
      },
    ],
  },
  '2.1.match': {
    label: 'From commitment to standard',
    left: [
      { id: 'm1', text: '1. We start with lived experience' },
      { id: 'm2', text: '2. We are evidence-based and outcome-driven' },
      { id: 'm3', text: '3. We must be inclusive and accessible by default' },
      { id: 'm4', text: '4. Our work is iterative' },
      { id: 'm5', text: '5. We strive to make the complex legible' },
      { id: 'm6', text: '6. We work across boundaries' },
      { id: 'm7', text: '7. Our goal is to prevent problems before they arise' },
      { id: 'm8', text: '8. We are partners with those we are designing for' },
      { id: 'm9', text: '9. We embrace innovation with intent and responsibility' },
    ],
    right: [
      { id: 's1', text: 'Insight built on lived experience' },
      { id: 's2', text: 'Accessibility-first' },
      { id: 's3', text: 'Ethical, equitable and legitimate' },
      { id: 's4', text: 'Design that spans the whole system' },
      { id: 's5', text: 'Iterative, adaptive and future-ready' },
      { id: 's6', text: 'Preventative design and system value' },
      { id: 's7', text: 'Co-design with communities' },
      { id: 's8', text: 'Transparency, evidence and impact' },
      { id: 's9', text: 'Fresh perspectives and innovations' },
    ],
    pairs: [
      { left: 'm1', right: 's1', why: 'Both start from real lives, including hidden groups.' },
      { left: 'm2', right: 's8', why: 'Both ask for evidence of impact, not guesswork.' },
      { left: 'm3', right: 's2', why: "Both say 'Nothing about us without us.'" },
      { left: 'm4', right: 's5', why: 'Both expect services to keep learning.' },
      { left: 'm5', right: 's3', why: 'Both cut failure demand with plain information.' },
      { left: 'm6', right: 's4', why: 'Both look at the whole ecosystem.' },
      { left: 'm7', right: 's6', why: 'Both focus on root causes and consequences.' },
      { left: 'm8', right: 's7', why: 'Both put co-design at the centre.' },
      { left: 'm9', right: 's9', why: 'Both test technology for its value to people.' },
    ],
    summary: 'Each commitment becomes a standard you can be measured against.',
  },
  '2.3.spot': {
    label: 'Find the barriers',
    scene:
      "A one-page form called 'Apply for a resident parking permit', with a vehicle question, a date question, an error message, a timeout warning and a Continue link.",
    hotspots: [
      {
        id: 'h1',
        label: 'The hint inside the box',
        problem: 'The question is grey placeholder text that disappears when you type.',
        excludes: 'People with memory or attention difficulties. A cognitive barrier.',
        fix: 'Put the question in a label above the box.',
        ref: 'WCAG 2.2: 3.3.2 Labels or Instructions',
      },
      {
        id: 'h2',
        label: 'The pale text',
        problem: 'Light grey text, about 2 to 1 contrast.',
        excludes: 'People with low vision, and anyone in bright sunlight.',
        fix: 'Use at least 4.5 to 1 contrast.',
        ref: 'WCAG 2.2: 1.4.3 Contrast (Minimum)',
      },
      {
        id: 'h3',
        label: 'The red box',
        problem: 'Only a red border shows the error.',
        excludes: 'People who cannot see red, and screen reader users.',
        fix: 'Add an error message in words, and a summary at the top.',
        ref: 'WCAG 2.2: 1.4.1 Use of Color',
      },
      {
        id: 'h4',
        label: "'Enter your VRM'",
        problem: "It says 'VRM', not 'vehicle registration number'.",
        excludes: 'Anyone who does not know the term. A cognitive barrier.',
        fix: "Ask 'What is your vehicle registration number?'",
        ref: 'WCAG 2.2: 3.1.3 Unusual Words (AAA)',
      },
      {
        id: 'h5',
        label: 'The 10-minute timeout',
        problem: "'Your session will end in 10 minutes', with no way to extend it.",
        excludes: 'Anyone who needs longer, such as disabled people and carers.',
        fix: 'Warn people and let them extend, or remove the limit.',
        ref: 'WCAG 2.2: 2.2.1 Timing Adjustable',
      },
      {
        id: 'h6',
        label: 'The tiny Continue link',
        problem: 'Continue is a small text link.',
        excludes: 'People with tremors, and touch screen users.',
        fix: 'Use a full-size button, at least 24 by 24 pixels.',
        ref: 'WCAG 2.2: 2.5.8 Target Size (Minimum)',
      },
    ],
  },
  '2.4.before': {
    label: 'Design for user error',
    before: {
      title: 'Before',
      content: "A date of birth with no year. Under it, in red: 'Invalid input.'",
    },
    after: {
      title: 'After',
      content: "Above the field: 'Date of birth must include a year.' The day and month are kept.",
    },
    notes: [
      'Says what is wrong.',
      'Says how to fix it.',
      'Sits next to the field.',
      'Keeps what was typed.',
    ],
  },
  '2.5.map': {
    label: 'One life, many services',
    centre: 'Sam, a single parent working part time',
    nodes: [
      {
        id: 'gp',
        name: 'GP surgery',
        moments: ["A child's asthma flares up", 'Sam needs a sick note'],
        asksFor: ['Proof of address', 'Date of birth'],
      },
      {
        id: 'school',
        name: 'School',
        moments: ["A child's asthma flares up", 'Applying for free school meals'],
        asksFor: ['Proof of address', 'Income details'],
      },
      {
        id: 'housing',
        name: 'Housing association',
        moments: ['The rent goes up', 'Reporting damp'],
        asksFor: ['Proof of address', 'Income details'],
      },
      {
        id: 'jobcentre',
        name: 'Jobcentre',
        moments: ['Starting a new part-time job', 'The rent goes up'],
        asksFor: ['Proof of address', 'Income details', 'Date of birth'],
      },
      {
        id: 'foodbank',
        name: 'Food bank charity',
        moments: ['Money runs out before payday'],
        asksFor: ['Income details'],
      },
    ],
    insight:
      'Sam repeats the same details to services that never talk. Designing for one works better when it fits the whole week.',
  },
  '2.7.check': {
    question: 'Which show how and why design improves outcomes? Choose all that apply.',
    multiple: true,
    options: [
      {
        text: 'A workshop fills a wall with sticky notes that nobody reads again.',
        correct: false,
        feedback: 'Design theatre: it looks like design but changes nothing.',
      },
      {
        text: 'A team tests a new letter with 2,000 people. Repeat calls fall by 18%.',
        correct: true,
        feedback: 'Yes. It tests a change and shows the effect.',
      },
      {
        text: 'A team runs a design sprint because a competitor did.',
        correct: false,
        feedback: 'Cargo-cult adoption: copying a method without knowing why.',
      },
      {
        text: 'Before moving a form online, a team keeps a phone route for the 12% who need it.',
        correct: true,
        feedback: 'Yes. It maps the consequences and avoids a new burden.',
      },
    ],
    after: 'Design earns trust when it shows what changed and why.',
  },
  '2.12.choose': {
    setup: 'You are interviewing someone about a parking permit.',
    prompt: "They ask: 'Who is this research for?' What do you say?",
    options: [
      {
        text: "'I can't really say. It's for a big organisation.'",
        outcome: 'They give shorter answers, unsure how their words will be used.',
        verdict: 'wrong',
      },
      {
        text: "'It's for the council, to make permits easier to get. You can stop at any time.'",
        outcome: 'They relax and tell you about the time it went wrong.',
        verdict: 'best',
      },
      {
        text: "'Don't worry, it's just a chat.'",
        outcome:
          'They carry on without understanding what they agreed to. That is not informed consent.',
        verdict: 'wrong',
      },
    ],
    lesson:
      "Be open about who the research is for and how the data will be used. If the client can't be named, say why, and still explain the purpose.",
  },
  '2.13.check': {
    question: 'A participant gets upset talking about their benefits claim. What do you do first?',
    multiple: false,
    options: [
      {
        text: 'Carry on with your questions.',
        correct: false,
        feedback: 'This puts your research before the person.',
      },
      {
        text: 'Pause, acknowledge their feelings and offer a break or to stop.',
        correct: true,
        feedback: 'Yes. Their wellbeing comes first, and they choose what happens next.',
      },
      {
        text: 'Move to another topic without comment.',
        correct: false,
        feedback: 'It ignores what happened and takes away their choice.',
      },
      {
        text: 'Advise them on their claim.',
        correct: false,
        feedback: 'Well meant, but outside your training. Point them to people who can help.',
      },
    ],
    after:
      'Then point them to support, leave out anything they ask you not to record, and debrief with a colleague.',
  },
}
