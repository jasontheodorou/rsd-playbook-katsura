import { index, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import type { PostgresSchemaHook } from '@payloadcms/drizzle/postgres'

/**
 * Learner progress lives in its own tables, not Payload collections, so anonymous writes never
 * pass through collection access rules. Registered through Payload's afterSchemaInit so the
 * tables share the same migrations as everything else.
 */
export const learners = pgTable('learners', {
  id: text('id').primaryKey(),
  identitySubject: text('identity_subject').unique(),
  mergedInto: text('merged_into'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const progressEvents = pgTable(
  'progress_events',
  {
    id: serial('id').primaryKey(),
    learnerId: text('learner_id')
      .notNull()
      .references(() => learners.id, { onDelete: 'cascade' }),
    pageId: text('page_id').notNull(),
    componentKey: text('component_key').notNull(),
    contentHash: text('content_hash'),
    kind: text('kind').notNull(),
    value: jsonb('value'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('progress_events_learner_page_idx').on(table.learnerId, table.pageId)],
)

export const addLearningTables: PostgresSchemaHook = ({ schema }) => {
  schema.tables.learners = learners
  schema.tables.progress_events = progressEvents
  return schema
}
