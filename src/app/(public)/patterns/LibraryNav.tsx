'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/patterns', label: 'Patterns' },
  { href: '/patterns/where', label: 'Where they are used' },
  { href: '/patterns/about', label: 'About' },
]

/** The library's own navigation, under the site's top bar. A pattern page lights Patterns. */
export function LibraryNav() {
  const path = usePathname()
  const active = NAV.find((n) => n.href !== '/patterns' && path.startsWith(n.href))?.href ?? '/patterns'
  return (
    <nav className="pl-nav" aria-label="Pattern library">
      <span className="pl-nav__name">Pattern library</span>
      <ul className="pl-nav__list">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link className="pl-nav__link" href={n.href} aria-current={active === n.href ? 'page' : undefined}>
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
