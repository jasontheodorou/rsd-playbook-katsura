'use client'

import { BlockView } from '../../foundations/[chapter]/page/FoundationsChapter'
import type { Block } from '../../foundations/[chapter]/page/types'
import '../../foundations/[chapter]/page/foundations-chapter.css'

/**
 * One Foundations block on the chapter page's own grid: the same container, 12 columns, rail
 * column left empty, and the block on its usual columns. The block is rendered by the chapter
 * page's own BlockView, so the library shows exactly what a chapter shows.
 */
export function BlockStage({ block, firstFan = true }: { block: Block; firstFan?: boolean }) {
  return (
    <div className="fc pl-fc">
      <div className="container fc__grid pl-fc__grid">
        <div className="fc__main">
          <div className={`fc__block fc__block--${block.kind} pl-fc__block`} data-block={0}>
            <BlockView block={block} firstFan={firstFan} />
          </div>
        </div>
      </div>
    </div>
  )
}
