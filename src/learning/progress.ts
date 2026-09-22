import config from '@payload-config'
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { and, asc, eq, like } from 'drizzle-orm'
import { getPayload } from 'payload'

import { learners, progressEvents } from './schema'

const db = async () => {
  const payload = await getPayload({ config })
  return (payload.db as unknown as PostgresAdapter).drizzle
}

export const ensureLearner = async (id: string): Promise<void> => {
  const d = await db()
  await d.insert(learners).values({ id }).onConflictDoNothing()
}

/**
 * Pages this learner has completed, as a set of page ids. A page counts as completed when the
 * latest completed/reset event for it is a completion. Derived on read, never stored.
 */
export const completedPages = async (learnerId: string, pageIdPrefix = ''): Promise<Set<string>> => {
  const d = await db()
  const rows = await d
    .select({ pageId: progressEvents.pageId, componentKey: progressEvents.componentKey, kind: progressEvents.kind })
    .from(progressEvents)
    .where(and(eq(progressEvents.learnerId, learnerId), like(progressEvents.pageId, `${pageIdPrefix}%`)))
    .orderBy(asc(progressEvents.occurredAt), asc(progressEvents.id))
  const state = new Map<string, boolean>()
  for (const row of rows) {
    if (row.componentKey !== 'chapter') continue
    if (row.kind === 'completed') state.set(row.pageId, true)
    if (row.kind === 'reset') state.set(row.pageId, false)
  }
  return new Set([...state].filter(([, done]) => done).map(([pageId]) => pageId))
}

export const recordCompletion = async (learnerId: string, pageId: string, completed: boolean): Promise<void> => {
  const d = await db()
  await d.insert(progressEvents).values({
    learnerId,
    pageId,
    componentKey: 'chapter',
    kind: completed ? 'completed' : 'reset',
  })
}

export const forgetLearner = async (learnerId: string): Promise<void> => {
  const d = await db()
  await d.delete(learners).where(eq(learners.id, learnerId))
}
