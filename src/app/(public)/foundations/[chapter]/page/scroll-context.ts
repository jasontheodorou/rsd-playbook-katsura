'use client'

import { createContext, useContext, type RefObject } from 'react'

/**
 * The chapter page scrolls inside its own frame (.fc), not the window. Blocks that track scroll
 * (the stacking cards) read the frame from here, so their scroll progress follows the page.
 */
export const ChapterScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

export const useChapterScroll = () => useContext(ChapterScrollContext)
