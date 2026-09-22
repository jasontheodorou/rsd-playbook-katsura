import { Open_Sans } from 'next/font/google'
import React from 'react'

import { TopBar } from './_chrome/TopBar'
import './styles.css'

// Self-hosted at build time, so no request to Google at run time.
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata = {
  title: 'The RSD Playbook',
  description: 'A design manual for Transform UK designers.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <TopBar />
        <main id="main" className="container page">
          {children}
        </main>
      </body>
    </html>
  )
}
