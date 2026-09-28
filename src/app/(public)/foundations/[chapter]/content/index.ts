import type { ChapterContent } from '../page/types'
import { headHeartAndHands } from './head-heart-and-hands'
import { howWeDeliver } from './how-we-deliver'
import { howWeThink } from './how-we-think'
import { whatWeCareAbout } from './what-we-care-about'
import { whyDesignMatters } from './why-design-matters'
import { whoWeAre } from './who-we-are'

/**
 * Every Foundations chapter built to the gold standard, by slug. A chapter listed here renders
 * with FoundationsChapter; to add one, write its content file and add it here.
 */
export const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  'who-we-are': whoWeAre,
  'why-design-matters': whyDesignMatters,
  'head-heart-and-hands': headHeartAndHands,
  'how-we-think': howWeThink,
  'what-we-care-about': whatWeCareAbout,
  'how-we-deliver': howWeDeliver,
}
