import { Open_Sans } from 'next/font/google'
import React from 'react'

import '../(public)/styles.css'
import './gate.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata = {
  title: 'The RSD Playbook',
  robots: { index: false, follow: false },
}

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>{children}</body>
    </html>
  )
}
