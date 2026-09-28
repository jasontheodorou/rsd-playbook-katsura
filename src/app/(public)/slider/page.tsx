import '../accordions/accordions.css'
import { WATCHOUTS } from './data'
import { Balance, Scrubber } from './Sliders'
import './slider.css'

export const metadata = { title: 'Watch-out sliders. The RSD Playbook' }

/**
 * Two slider components for the design watch-outs, to sit between the "Common features" boxout and
 * "Design cannot succeed in a vacuum" on Why design matters. Refined look, chapter 02's washes.
 */
export default function SliderPage() {
  return (
    <div className="accp">
      <aside className="accp-rail" aria-hidden="true">
        <span className="accp-rail__number">02</span>
        <span className="accp-rail__track" />
      </aside>
      <div className="accp-main">
        <header className="accp-intro">
          <h1 className="accp-intro__title">Watch-out sliders</h1>
          <p className="accp-intro__lede">
            Two ways to let readers slide through the design watch-outs, in the refined look used by
            the benefits diagram.
          </p>
        </header>
        <section className="accp-design" aria-labelledby="sl-1">
          <div className="accp-design__head">
            <span className="accp-design__id">01</span>
            <h2 id="sl-1" className="accp-design__name">
              Scrubber
            </h2>
            <p className="accp-design__rule">
              One track with four stops. Drag the handle, use the arrow keys or pick a label; the
              panel shows that watch-out in the manual&rsquo;s words.
            </p>
          </div>
          <div className="accp-design__demo">
            <Scrubber items={WATCHOUTS} />
          </div>
        </section>
        <section className="accp-design" aria-labelledby="sl-2">
          <div className="accp-design__head">
            <span className="accp-design__id">02</span>
            <h2 id="sl-2" className="accp-design__name">
              Balance
            </h2>
            <p className="accp-design__rule">
              Four sliders, each from a failure to good practice, with ends taken from the
              watch-outs&rsquo; own words. Slide one past the middle to reveal the watch-out behind
              it.
            </p>
          </div>
          <div className="accp-design__demo">
            <Balance items={WATCHOUTS} />
          </div>
        </section>
        <section className="accp-design" aria-labelledby="sl-3">
          <div className="accp-design__head">
            <span className="accp-design__id">03</span>
            <h2 id="sl-3" className="accp-design__name">
              Balance, compact
            </h2>
            <p className="accp-design__rule">
              Balance made simpler, smaller and subtler: no icons or row cards, a thin track and
              small handle, a quiet line of prompt and count, at the body text&rsquo;s width.
            </p>
          </div>
          <div className="accp-design__demo">
            <Balance items={WATCHOUTS} compact />
          </div>
        </section>
      </div>
    </div>
  )
}
