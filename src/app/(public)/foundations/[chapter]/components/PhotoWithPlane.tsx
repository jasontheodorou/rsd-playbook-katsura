import './photo-with-plane.css'

/**
 * A landscape photograph (2:1) with a pale plane one grid gap below and to the right. The figure's
 * padding holds the plane, so the plane's outer edge lands on the right edge of the columns the
 * photograph spans.
 */
export function PhotoWithPlane({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <figure className={`pwp ${className}`.trim()}>
      <span className="pwp__plane" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pwp__img" src={src} alt={alt} />
    </figure>
  )
}
