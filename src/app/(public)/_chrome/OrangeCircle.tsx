/** The one place orange is allowed as a fill: a circle. Carried over from the reference build. */
export function OrangeCircle({ size = 12 }: { size?: number }) {
  return <span aria-hidden className="orange-circle" style={{ width: size, height: size }} />
}
