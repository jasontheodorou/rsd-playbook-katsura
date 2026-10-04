import { Suspense } from 'react'

import '../modular/modular.css'
import './contents.css'
import './options.css'
import { Landings } from './Landings'

export const metadata = { title: 'Shape your practice: landing options' }

/** /landing2: three options for Shape your practice's landing page. */
export default function Landing2Page() {
  return (
    <Suspense>
      <Landings />
    </Suspense>
  )
}
