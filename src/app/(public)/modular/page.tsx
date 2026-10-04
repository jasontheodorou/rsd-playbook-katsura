import { Suspense } from 'react'

import { Approaches } from './Approaches'
import './modular.css'
import './two-zones.css'
import './reading-room.css'
import './paper-desk.css'
import './two-zones-mantine.css'

export const metadata = { title: 'Shape your practice: three approaches' }

/** /modular: three approaches to Pathway two, built from what Foundations taught us. */
export default function ModularPage() {
  return (
    <Suspense>
      <Approaches />
    </Suspense>
  )
}
