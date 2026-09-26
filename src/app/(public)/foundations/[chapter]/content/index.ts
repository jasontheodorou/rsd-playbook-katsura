import type { ChapterContent } from '../page/types'
import { whyDesignMatters } from './why-design-matters'
import { whoWeAre } from './who-we-are'

/**
 * Every Foundations chapter built to the gold standard, by slug. A chapter listed here renders
 * with FoundationsChapter; to add one, write its content file and add it here.
 */
export const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  'who-we-are': whoWeAre,
  'why-design-matters': whyDesignMatters,
}
