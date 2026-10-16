'use client'

import Link from 'next/link'
import { useState } from 'react'

import { CATEGORY_LABEL, findPattern, SOURCES, STATUS_LABEL } from './registry'
import type { LibraryPattern } from './types'

const TRIGGER_LABEL: Record<LibraryPattern['trigger'], string> = {
  mount: 'Shows as the page loads',
  inView: 'Plays when scrolled into view',
  scroll: 'Moves with the scroll position',
  press: 'Waits for the reader to choose',
}

/**
 * One pattern: the live pattern on a wide canvas with a "Play again" control, then what it does,
 * where it is used, how it behaves, and the developer's details folded away.
 */
export function PatternPage({ id }: { id: string }) {
  const pattern = findPattern(id)
  // Bumping the key remounts the demo, which replays its entrance.
  const [play, setPlay] = useState(0)
  if (!pattern)
    return (
      <div className="pl-page">
        <p className="pl-prose">
          There is no pattern at this address.{' '}
          <Link className="pl-link" href="/patterns">
            See all patterns
          </Link>
          .
        </p>
      </div>
    )

  const Demo = pattern.demo
  const source = SOURCES.find((s) => s.id === pattern.source)
  const replacedBy = pattern.replacedBy ? findPattern(pattern.replacedBy) : undefined
  const replayable = pattern.trigger !== 'press'
  const stage = pattern.stageWidth

  return (
    <div className="pl-page">
      <nav className="pl-crumb" aria-label="Breadcrumb">
        <Link href="/patterns">Patterns</Link>
        <span aria-hidden="true">›</span>
        <span>{pattern.name}</span>
      </nav>

      <div className={`pl-canvas pl-tint--${pattern.source}`}>
        <div className="pl-canvas__stage" key={play} style={stage ? { maxWidth: stage } : undefined}>
          <Demo />
        </div>
        {replayable && (
          <button type="button" className="pl-button pl-canvas__play" onClick={() => setPlay((k) => k + 1)}>
            Play again
          </button>
        )}
      </div>

      <div className="pl-body">
        <header className="pl-body__head">
          <ul className="pl-badges" aria-label="About this pattern">
            {source && <li className="pl-badge">{source.label}</li>}
            <li className="pl-badge">{CATEGORY_LABEL[pattern.category]}</li>
            <li className={`pl-badge pl-badge--${pattern.status}`}>{STATUS_LABEL[pattern.status]}</li>
          </ul>
          <h1 className="pl-name">{pattern.name}</h1>
          <p className="pl-lede">{pattern.description}</p>
        </header>

        <section className="pl-section">
          <h2 className="pl-section__title">What it does</h2>
          <p className="pl-prose">{pattern.whatItDoes}</p>
        </section>

        {pattern.status === 'superseded' && (
          <section className="pl-section">
            <h2 className="pl-section__title">What happened to it</h2>
            <p className="pl-prose">
              {replacedBy ? (
                <>
                  It was rebuilt in the current Playbook as{' '}
                  <Link className="pl-link" href={`/patterns/${replacedBy.id}`}>
                    {replacedBy.name}
                  </Link>
                  .
                </>
              ) : (
                'It has not been carried into the current Playbook.'
              )}
            </p>
          </section>
        )}

        <section className="pl-section">
          <h2 className="pl-section__title">Where it is used</h2>
          {pattern.whereUsed.length > 0 ? (
            <ul className="pl-list">
              {pattern.whereUsed.map((w) => (
                <li key={`${w.label}${w.ref}`}>
                  {w.href ? (
                    <Link className="pl-link" href={w.href}>
                      {w.label}
                    </Link>
                  ) : (
                    w.label
                  )}
                  {w.ref && <code className="pl-ref">{w.ref}</code>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="pl-prose pl-prose--quiet">Nowhere now. It is built and working, but no page uses it.</p>
          )}
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">How it behaves</h2>
          <ul className="pl-list">
            <li>{TRIGGER_LABEL[pattern.trigger]}</li>
            <li>
              {pattern.accessibility.reducedMotion === 'supported'
                ? 'With reduced motion on, it shows its finished state and nothing moves'
                : pattern.accessibility.reducedMotion === 'partial'
                  ? 'With reduced motion on, it reads fully, but some movement still runs'
                  : 'It does not respond to reduced motion'}
            </li>
            {pattern.accessibility.keyboard === true && <li>It can be used with a keyboard</li>}
            {pattern.accessibility.keyboard === false && <li>It needs a mouse or touch, and cannot be used with a keyboard</li>}
            {pattern.accessibility.autoplay && <li>It moves without being asked, until the reader first uses it</li>}
          </ul>
        </section>

        <section className="pl-section">
          <details className="pl-fold">
            <summary className="pl-fold__summary">
              Developer details
              <span className="pl-fold__count">
                {pattern.files.length} {pattern.files.length === 1 ? 'file' : 'files'}
              </span>
            </summary>
            <dl className="pl-dl">
              <dt>Built with</dt>
              <dd>{pattern.builtWith.join(', ')}</dd>
              <dt>Weight</dt>
              <dd>{pattern.weight}</dd>
              <dt>Packages</dt>
              <dd>{pattern.packages.length ? pattern.packages.join(', ') : 'None'}</dd>
              <dt>Files</dt>
              <dd>
                <ul className="pl-files">
                  {pattern.files.map((f) => (
                    <li key={f}>
                      <code>{f}</code>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </details>
        </section>

        {pattern.alsoConsidered && pattern.alsoConsidered.length > 0 && (
          <section className="pl-section">
            <details className="pl-fold">
              <summary className="pl-fold__summary">
                Also considered
                <span className="pl-fold__count">{pattern.alsoConsidered.length} not used</span>
              </summary>
              <p className="pl-prose pl-prose--quiet">
                Built while this pattern was designed, and set aside. Kept as a record.
              </p>
              {pattern.alsoConsidered.map((alt) => {
                const AltDemo = alt.demo
                return (
                  <div className="pl-alt" key={alt.name}>
                    <h3 className="pl-alt__name">{alt.name}</h3>
                    <p className="pl-prose pl-prose--quiet">{alt.note}</p>
                    {AltDemo && (
                      <div className={`pl-alt__demo pl-tint--${pattern.source}`}>
                        <AltDemo />
                      </div>
                    )}
                  </div>
                )
              })}
            </details>
          </section>
        )}

        <p className="pl-back">
          <Link className="pl-link" href="/patterns">
            All patterns
          </Link>
        </p>
      </div>
    </div>
  )
}
