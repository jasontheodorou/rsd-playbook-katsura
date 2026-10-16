'use client'

import Link from 'next/link'
import { useState } from 'react'

import { CATEGORY_LABEL, findPattern, SOURCES, STATUS_LABEL } from './registry'
import type { LibraryPattern } from './types'

const TRIGGER_LABEL: Record<LibraryPattern['trigger'], string> = {
  mount: 'It shows when the page loads',
  inView: 'It plays when you scroll to it',
  scroll: 'It moves as you scroll',
  press: 'It waits for you to use it',
}

/**
 * One pattern: the live pattern on a wide canvas with a "Play again" control, then what it does,
 * where it is used and how it behaves.
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="pl-prose pl-prose--quiet">Not used on any page.</p>
          )}
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">How it behaves</h2>
          <ul className="pl-list">
            <li>{TRIGGER_LABEL[pattern.trigger]}</li>
            <li>
              {pattern.accessibility.reducedMotion === 'supported'
                ? 'If you turn off animation on your device, it stays still'
                : pattern.accessibility.reducedMotion === 'partial'
                  ? 'If you turn off animation on your device, some parts still move'
                  : 'It still moves if you turn off animation on your device'}
            </li>
            {pattern.accessibility.keyboard === true && <li>You can use it with a keyboard</li>}
            {pattern.accessibility.keyboard === false && <li>You need a mouse or touch screen to use it</li>}
            {pattern.accessibility.autoplay && <li>It moves on its own until you first use it</li>}
          </ul>
        </section>


        {pattern.alsoConsidered && pattern.alsoConsidered.length > 0 && (
          <section className="pl-section">
            <details className="pl-fold">
              <summary className="pl-fold__summary">
                Also considered
                <span className="pl-fold__count">{pattern.alsoConsidered.length} not used</span>
              </summary>
              <p className="pl-prose pl-prose--quiet">
                Other versions tried while this one was designed.
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
      </div>
    </div>
  )
}
