'use client'

import { List } from '@mantine/core'
import '@mantine/core/styles/List.css'
import type { ReactNode } from 'react'

/* Mantine's compound components (List.Item) cannot be reached from a server
   component, so the card body passes its parts here. */

/** A run of bullets: Mantine List with a soft coloured marker. Each item keeps its content ID. */
export function PcList({ items }: { items: { cid: string; node: ReactNode }[] }) {
  return (
    <List className="pc-list" spacing={10} icon={<span className="pc-dot" aria-hidden />}>
      {items.map((x) => (
        <List.Item key={x.cid} data-cid={x.cid}>
          {x.node}
        </List.Item>
      ))}
    </List>
  )
}
