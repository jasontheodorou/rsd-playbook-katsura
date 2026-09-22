import { describe, expect, it } from 'vitest'

import config from '@/payload.config'

describe('payload config', () => {
  it('builds with no database connection', async () => {
    const resolved = await config
    const slugs = resolved.collections.map((c) => c.slug)
    expect(slugs).toEqual(expect.arrayContaining(['users', 'media']))
    expect(resolved.graphQL.disable).toBe(true)
  })
})
