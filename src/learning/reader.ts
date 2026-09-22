import { cookies } from 'next/headers'

import { LEARNER_COOKIE, decodeLearnerCookie } from './cookie'
import { completedPages } from './progress'

/** The current anonymous learner id from the request cookie, or null. */
export const currentLearnerId = async (): Promise<string | null> => {
  const jar = await cookies()
  return decodeLearnerCookie(jar.get(LEARNER_COOKIE)?.value)
}

/** Completed page ids for the current request's learner. Empty set for a new visitor. */
export const currentCompleted = async (pageIdPrefix = ''): Promise<Set<string>> => {
  const id = await currentLearnerId()
  return id ? completedPages(id, pageIdPrefix) : new Set()
}
