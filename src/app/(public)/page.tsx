import Link from 'next/link'
import type { ComponentType } from 'react'

import { ArrowRight, ArrowUpRight, BookOpen, Sparkles } from './_chrome/icons'

export const dynamic = 'force-dynamic'

/**
 * Home page, carried over from the reference build's HomePage. Static for now; the two
 * pathway destinations arrive with the read model. Renders with no JavaScript.
 */
export default function HomePage() {
  return (
    <div className="home">
      <div className="home__hero">
        <p className="eyebrow">Research and design</p>
        <h1 className="home__headline">
          The RSD <span className="accent-underline accent-underline--thick">Playbook</span>
        </h1>
        <p className="home__lede">What good design looks like at Transform</p>
      </div>

      <div className="home__pathways">
        <p className="eyebrow eyebrow--lg">Select a pathway</p>
        <div className="pathway-grid">
          <PathwayCard
            eyebrow="Pathway one"
            beforeWord="Explore the "
            accentWord="foundations"
            lede="Learn the principles behind how we research and design services."
            Icon={BookOpen}
            cta="Start exploring"
            href="/foundations"
          />
          <PathwayCard
            eyebrow="Pathway two"
            beforeWord="Master your "
            accentWord="practice"
            lede="Find the methods and tools for each stage of your work."
            Icon={Sparkles}
            cta="Go deeper"
            href="/practice"
          />
        </div>
      </div>
    </div>
  )
}

type PathwayCardProps = {
  eyebrow: string
  beforeWord: string
  accentWord: string
  lede: string
  Icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  cta: string
  href: string
}

function PathwayCard({ eyebrow, beforeWord, accentWord, lede, Icon, cta, href }: PathwayCardProps) {
  return (
    <Link href={href} className="pathway-card" aria-label={`${beforeWord}${accentWord}. ${cta}`}>
      <ArrowUpRight size={18} className="pathway-card__arrow" />
      <div className="pathway-card__body">
        <Icon size={28} strokeWidth={1.75} className="pathway-card__icon" />
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="pathway-card__title">
          {beforeWord}
          <span className="accent-underline">{accentWord}</span>
        </h2>
        <p className="pathway-card__lede">{lede}</p>
      </div>
      <span className="button-primary">
        {cta}
        <ArrowRight size={15} />
      </span>
    </Link>
  )
}
