import React from 'react'

import './styles.css'

export const metadata = {
  title: 'katsura',
  description: 'A design manual for Transform UK designers.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
