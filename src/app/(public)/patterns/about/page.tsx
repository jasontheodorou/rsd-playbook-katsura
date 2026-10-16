'use client'

import Link from 'next/link'

import { PATTERNS } from '../registry'

/** What the library is and how it stays true. Short, so a colleague can go straight to the patterns. */
export default function AboutPage() {
  const count = (s: string) => PATTERNS.filter((p) => p.status === s).length
  return (
    <div className="pl-page">
      <header className="pl-head">
        <h1 className="pl-title">
          About this library
          <span className="pl-stop" aria-hidden="true" />
        </h1>
        <p className="pl-lede">
          The back room of the RSD Playbook. It holds the patterns the Playbook is built from, each one running
          live.
        </p>
      </header>

      <div className="pl-body pl-body--flush">
        <section className="pl-section">
          <h2 className="pl-section__title">What is in it</h2>
          <ul className="pl-list">
            <li>{count('live')} patterns on pages of the Playbook now.</li>
          </ul>
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">What is not</h2>
          <p className="pl-prose">
            Body text, titles, the spacing scale and the grid are left out. They are in the design rules. The option
            pages made while choosing a design are left out too.
          </p>
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">How it stays true</h2>
          <p className="pl-prose">
            Every demo uses the same component as its page, with the same words and photographs. Where a pattern is
            used is worked out from the pages’ own content. Change a chapter or a course and this library changes
            with it.
          </p>
        </section>

        <p className="pl-back">
          <Link className="pl-link" href="/patterns">
            Go to the patterns
          </Link>
        </p>
      </div>
    </div>
  )
}
