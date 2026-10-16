// Copied from the-rsd-playbook src/pathway1/ParticipationModel.tsx for the pattern library's record of the original build.
'use client'

import { ConnectorPattern, type ConnectorItem } from './Connector'

/* The interactive read of part2.svg for the Closing page. Copy deliberately
   picks up this page's own language — "builds knowledge through doing",
   "experience the process themselves", "embedded into the culture" — so the
   four moments expand on what the prose already says rather than restating it.

   Colours are deepened from the artwork's own fills: the drawing's pale
   tints are legible as shapes but too faint for a 2px rule or a hairline
   wire on the cream page ground. */

const MOMENTS: ConnectorItem[] = [
  {
    key: 'clay',
    colour: '#C08F73',
    title: 'Invite people in',
    body: [
      'Participation begins with an invitation, not a consultation at the end.',
      'People join while the work is still taking shape, when what they tell us can still change the outcome.',
    ],
  },
  {
    key: 'paleblue',
    colour: '#4E87A6',
    title: 'Listen properly',
    body: [
      'We take the time to understand what people actually need, including the things they find hard to put into words.',
      'Dialogue, rather than a form to fill in.',
    ],
  },
  {
    key: 'yellow',
    colour: '#D9B133',
    title: 'Make it together',
    body: [
      'Participants experience the process themselves — walking through scenarios, mapping services, bringing concepts to life.',
      'Doing the work together is what turns our understanding into shared understanding.',
    ],
  },
  {
    key: 'palegrey',
    colour: '#93AFB2',
    title: 'Let it take root',
    body: [
      'Because the model builds knowledge as it goes, capability stays with the organisation.',
      'The change becomes part of the culture rather than something that leaves when we do.',
    ],
  },
]

export function ParticipationModel() {
  return (
    <div className="p1v2__participation">
      <span className="ly-panel__eyebrow">The participation model</span>
      <p className="p1v2__participation-lede">
        Four moments, and what each one asks of us. Select one to read more.
      </p>
      <ConnectorPattern items={MOMENTS} className="spw-conn--inline" />
    </div>
  )
}
