import { BodyText } from '../foundations/[chapter]/components/BodyText'
import { StackingCards, type StackCard } from './StackingCards'
import './options.css'

export const metadata = { title: 'Stacking cards. The RSD Playbook' }

/**
 * The stacking cards pattern, pared back: identical cards in tones of the page's own warm paper,
 * with the page's ink and body text colours, so the stack reads clearly without competing.
 */

const CARDS: StackCard[] = [
  {
    id: 'purpose',
    tone: 1,
    content: (
      <div className="stack__text stack__text--wide">
        <span className="stack__eyebrow">Who we are</span>
        <p className="stack__title">We exist to turn uncertainty into clarity and possibility.</p>
        <BodyText>
          <p>
            Enabling better, collective decisions through deep understanding of people, place,
            systems and contexts, to create environments for design to thrive.
          </p>
        </BodyText>
      </div>
    ),
  },
  {
    id: 'how',
    tone: 2,
    content: (
      <>
        <div className="stack__text">
          <span className="stack__eyebrow">How we work</span>
          <p className="stack__title">Evidence, empathy and iteration.</p>
          <BodyText>
            <p>
              We do this through evidence, empathy and iteration. We design with purpose, so that
              our work leads to real-world outcomes that are meaningful, fair and lasting.
            </p>
          </BodyText>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="stack__media"
          src="/photos/window-conversation.jpg"
          alt="Two colleagues talking by a tall office window, one holding a laptop."
        />
      </>
    ),
  },
  {
    id: 'commitments',
    tone: 3,
    content: (
      <>
        <div className="stack__text">
          <span className="stack__eyebrow">In practice</span>
          <p className="stack__title">Four commitments.</p>
          <BodyText>
            <p>In practice, this comes down to four commitments:</p>
          </BodyText>
        </div>
        <ol className="stack__slots">
          {['01', '02', '03', '04'].map((n) => (
            <li key={n} className="stack__slot">
              <span className="stack__slot-n">{n}</span>
              <span className="stack__slot-text">Commitment to come</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
]

export default function OptionsPage() {
  return (
    <div className="opt">
      <header className="opt-grid opt-intro">
        <h1 className="opt-intro__title">Stacking cards</h1>
        <p className="opt-intro__lede">
          Identical cards that pin and fold over one another as you scroll, in tones of the page’s
          own paper. Scroll back up to uncover each one again.
        </p>
      </header>
      <div className="opt-grid opt-demo">
        <StackingCards cards={CARDS} />
      </div>
    </div>
  )
}
