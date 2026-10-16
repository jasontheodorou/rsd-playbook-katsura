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
          About this <span className="pl-title__end">library<span className="pl-stop" aria-hidden="true" /></span>
        </h1>
        <p className="pl-lede">
          This library shows the patterns used to build the RSD Playbook. Each one works here as it does on its
          page.
        </p>
      </header>

      <div className="pl-body pl-body--flush">
        <section className="pl-section">
          <h2 className="pl-section__title">What is in it</h2>
          <p className="pl-prose">{count('live')} patterns, all used on pages of the Playbook now.</p>
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">What is not</h2>
          <p className="pl-prose">
            Text styles, spacing and the page grid are not included. They are in the design rules. Early design options
            are not included either.
          </p>
        </section>

        <section className="pl-section">
          <h2 className="pl-section__title">How it stays up to date</h2>
          <p className="pl-prose">
            Each example uses the same code, words and photos as its page. The list of where each pattern is used comes
            from the pages themselves. When a chapter or course changes, this library changes too.
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
