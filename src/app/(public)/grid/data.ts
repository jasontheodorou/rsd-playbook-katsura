/** The five benefits (manual F1.10 to F1.14), for the discovery grid options. */
import type { DiagramItem } from '../foundations/[chapter]/components/Diagram'

export type Benefit = DiagramItem & { tone: string; deep: string }

export const BENEFITS: Benefit[] = [
  {
    id: 'effectiveness',
    label: 'Root causes',
    icon: 'plant',
    lead: 'Improves effectiveness by addressing root causes.',
    body: 'Well-designed services are successful when they solve real problems, not symptoms. They are built on insight ensuring that solutions actually address needs.',
    tone: '#faf0c8',
    deep: '#f1d46e',
  },
  {
    id: 'efficiency',
    label: 'Efficiency',
    icon: 'gauge',
    lead: 'Enhances efficiency and reduces waste.',
    body: 'Design-driven approaches make services more efficient by eliminating duplication, simplifying user interactions, and preventing “failure demand”.',
    tone: '#e1ebec',
    deep: '#cbd9da',
  },
  {
    id: 'trust',
    label: 'Trust',
    icon: 'shieldCheck',
    lead: 'Builds trust and legitimacy.',
    body: 'Successful services are those people trust and understand. Design builds the relationship by making services clear, fair and easy to use.',
    tone: '#f3e2d9',
    deep: '#d8b4a3',
  },
  {
    id: 'learning',
    label: 'Learning',
    icon: 'arrowsClockwise',
    lead: 'Strengthens organisational learning and adaptability.',
    body: 'Embedding learning, feedback, and iteration into delivery is essential for managing complexity and uncertainty, making it more likely services will be successful.',
    tone: '#ece6dd',
    deep: '#d9cfc1',
  },
  {
    id: 'prevention',
    label: 'Prevention',
    icon: 'umbrella',
    lead: 'Enables prevention and long-term value.',
    body: 'Design makes services successful not only by fixing today’s problems but by preventing tomorrow’s, delivering long-term savings and resilience.',
    tone: '#e6ecf3',
    deep: '#b9cfe0',
  },
]
