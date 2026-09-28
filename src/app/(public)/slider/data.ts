/** The four design watch-outs (manual F1.23, F1.24, F1.25, F1.6), for the slider options. */
export type WatchOut = {
  id: string
  icon: 'question' | 'repeat' | 'mask' | 'scales'
  lead: string
  body: string
  /** The failure end and the good-practice end of the balance slider, from the watch-out's words. */
  from: string
  to: string
  /** A one- or two-word label under the scrubber's stop. */
  short: string
}

export const WATCHOUTS: WatchOut[] = [
  {
    id: 'ambiguity',
    short: 'Ambiguity',
    icon: 'question',
    lead: 'Ambiguity about what “design” means.',
    body: 'It is often used interchangeably with “develop”, “consult”, or “innovate.” Lack of clarity causes misalignment, superficial practice and disillusionment.',
    from: 'Vague',
    to: 'Clear',
  },
  {
    id: 'loops',
    short: 'Endless loops',
    icon: 'repeat',
    lead: 'Endless research and design loops.',
    body: 'Without delivery we create scepticism and backlash. The promise of transformational results relies on contextual grounding and delivered outcomes.',
    from: 'Endless research',
    to: 'Delivered outcomes',
  },
  {
    id: 'theatre',
    short: 'Design theatre',
    icon: 'mask',
    lead: 'Design theatre, over substance.',
    body: 'Teams copy the design rituals (e.g. Post-Its, workshops and prototypes) without its underlying purpose or discipline — mistaking form for substance.',
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
