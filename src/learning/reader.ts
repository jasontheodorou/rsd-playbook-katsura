import { cookies } from 'next/headers'

import { LEARNER_COOKIE, decodeLearnerCookie } from './cookie'
import { PROGRESS_COOKIE, decodeProgressCookie, progressStore } from './cookie-progress'
import { completedPages } from './progress'

/** The current anonymous learner id from the request cookie, or null. */
export const currentLearnerId = async (): Promise<string | null> => {
  const jar = await cookies()
  return decodeLearnerCookie(jar.get(LEARNER_COOKIE)?.value)
}

/** Completed page ids for the current request's learner. Empty set for a new visitor. */
export const currentCompleted = async (pageIdPrefix = ''): Promise<Set<string>> => {
  if (progressStore() === 'cookie') {
    const jar = await cookies()
    const all = decodeProgressCookie(jar.get(PROGRESS_COOKIE)?.value)
    return new Set([...all].filter((pageId) => pageId.startsWith(pageIdPrefix)))
  }
  const id = await currentLearnerId()
  return id ? completedPages(id, pageIdPrefix) : new Set()
}
