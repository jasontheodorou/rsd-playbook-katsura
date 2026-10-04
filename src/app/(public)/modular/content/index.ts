import { getModulesForUser, type AccountId, type RoleId } from './modules'
import type { ContentBlock, Module, ModuleItem } from './types'

export type { AccountId, RoleId }
export type { ContentBlock, Method, Module, ModuleItem, ResourceGroup } from './types'

export const ROLES: { id: RoleId; name: string }[] = [
  { id: 'service-designer', name: 'Service designer' },
  { id: 'interaction-designer', name: 'Interaction designer' },
]

export const ACCOUNTS: { id: AccountId; name: string }[] = [
  { id: 'hmcts', name: 'HMCTS' },
  { id: 'dfe', name: 'DfE' },
]

/** The first build's dead links: two have a real home here; the rest are dropped. */
const CTA_HOMES: Record<string, string> = {
  'View the Design Landscape': '/foundations/how-we-think',
}

const tidyBlock = (b: ContentBlock): ContentBlock => {
  if (b.type !== 'callout' || !b.ctaLabel) return b
  const href = b.ctaHref && b.ctaHref !== '#' ? b.ctaHref : CTA_HOMES[b.ctaLabel]
  return href ? { ...b, ctaHref: href } : { ...b, ctaLabel: undefined, ctaHref: undefined }
}

const tidyItem = (item: ModuleItem): ModuleItem => {
  if (item.kind === 'method') {
    // The best-practice examples were placeholders with dead links.
    const { bestPractice: _unused, ...rest } = item
    return rest
  }
  return { ...item, content: item.content.map(tidyBlock) }
}

export const modulesFor = (role: RoleId, account: AccountId | null): Module[] =>
  getModulesForUser(role, account).map((m) => ({ ...m, cards: m.cards.map(tidyItem) }))

