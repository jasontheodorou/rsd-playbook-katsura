'use client'

import { useState } from 'react'

import { useHydrated } from '../progress'
import { Frame } from './Frame'

type Node = { id: string; name: string; moments: string[]; asksFor: string[] }
export type MapProps = { label: string; centre: string; nodes: Node[]; insight: string }

/**
 * Map explorer: the centre with its nodes around it. Selecting a node shows its moments and what it
 * asks for, with anything another node also asks for marked "also asked by …", worked out from the
 * data. After three nodes have been looked at, the insight appears.
 */
export function MapExplorer({ label, centre, nodes, insight }: MapProps) {
  const hydrated = useHydrated()
  const [sel, setSel] = useState<string | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const alsoBy = (node: Node, item: string) =>
    nodes.filter((n) => n.id !== node.id && n.asksFor.includes(item)).map((n) => n.name)

  if (!hydrated)
    return (
      <Frame kind="map" label={label}>
        <p>{centre}</p>
        <table className="pc-table">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">Moments</th>
              <th scope="col">Asks for</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n) => (
              <tr key={n.id}>
                <th scope="row">{n.name}</th>
                <td>{n.moments.join('; ')}</td>
                <td>{n.asksFor.join('; ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="pc-ix__lesson">{insight}</p>
      </Frame>
    )

  const choose = (id: string) => {
    setSel(id)
    setSeen((s) => (s.includes(id) ? s : [...s, id]))
  }
  const node = nodes.find((n) => n.id === sel)
  return (
    <Frame kind="map" label={label} className="pc-map">
      <div className="pc-map__stage" style={{ ['--n' as string]: nodes.length }}>
        <p className="pc-map__centre">{centre}</p>
        <ul className="pc-map__nodes">
          {nodes.map((n, k) => (
            <li key={n.id} style={{ ['--k' as string]: k }}>
              <button
                type="button"
                className="pc-map__node"
                aria-pressed={sel === n.id}
                data-seen={seen.includes(n.id)}
                onClick={() => choose(n.id)}
              >
                {n.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="pc-map__detail" aria-live="polite">
        {node ? (
          <>
            <p className="pc-map__name">{node.name}</p>
            <p className="pc-map__sub">Moments</p>
            <ul>
              {node.moments.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="pc-map__sub">Asks for</p>
            <ul>
              {node.asksFor.map((a) => {
                const also = alsoBy(node, a)
                return (
                  <li key={a}>
                    {a}
                    {also.length > 0 && (
                      <span className="pc-map__also">also asked by {also.join(', ')}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <p className="pc-ix__how">
            Choose a service to see when it touches this life and what it asks for.
          </p>
        )}
      </div>
      {seen.length >= 3 && <p className="pc-ix__lesson">{insight}</p>}
    </Frame>
  )
}
