import type { ReactNode } from 'react'

import './body-text.css'

/**
 * The Foundations body text: paragraphs of reading copy, one step below the statement. The
 * component owns the gap between its own paragraphs; the page owns the gap above and below it.
 */
export function BodyText({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`body-text ${className}`.trim()}>{children}</div>
}
