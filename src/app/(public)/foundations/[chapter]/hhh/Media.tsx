export type MediaShape =
  '16-9' | '21-9' | 'square' | 'landscape' | 'portrait' | 'portrait-tall' | 'circle'

/** Image slot with a fixed aspect shape. Ported from the reference build's Layouts.tsx, without the placeholder fallback. */
export function Media({ shape, src, alt = '' }: { shape: MediaShape; src: string; alt?: string }) {
  return (
    <div className={`ly-media ly-media--${shape}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="ly-media__img" loading="lazy" />
    </div>
  )
}
