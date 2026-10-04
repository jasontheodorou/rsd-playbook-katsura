// Stand-in content for the /modular options, copied from the first build (rsd-playbook
// src/lib/content/types.ts) on 2 October 2026.
export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | {
      type: 'callout'
      variant: 'tool' | 'involve' | 'best-practice'
      body: string
      ctaLabel?: string
      ctaHref?: string
    }

export type ResourceTint = 'mist' | 'blush' | 'yellow'

export type ResourceItem = {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
}

export type ResourceGroup = {
  heading: string
  tint: ResourceTint
  items: ResourceItem[]
}

export type Card = {
  /** Discriminator. Optional for backwards compatibility — treat missing as 'card'. */
  kind?: 'card'
  id: string
  title: string
  minutes: number
  roles: string[]
  content: ContentBlock[]
  resources?: ResourceGroup[]
}

/**
 * Method — a first-class practical reference item.
 *
 * Sits alongside Card in a module's items list, using a fixed editorial
 * structure so every method is presented the same way. Reserved fields
 * (`progress`, `accountResources`) exist so future capability — completion
 * tracking, account-specific overlays — can slot in without a data-model
 * rewrite.
 */
export type Method = {
  kind: 'method'
  id: string
  title: string
  minutes: number
  roles: string[]
  /** One short paragraph — the definition. */
  whatItIs: string
  /** 2–4 short bullets — situations that call for the method. */
  whenToUse: string[]
  /** 3–6 practical steps or activities. */
  whatYouDo: string[]
  /** A short list of typical outputs. */
  whatYouProduce: string[]
  /** A short paragraph (string) or 3–5 bullets (string[]) describing a strong output. */
  whatGoodLooksLike: string | string[]
  /** IDs of 2–4 related methods for cross-linking. */
  relatedMethods?: string[]
  /** Optional existing resources (reuses the ResourceGroup structure). */
  resources?: ResourceGroup[]
  /**
   * Future — where account-specific resources (design systems, patterns)
   * will hang. Unused by the MVP renderer; typed here so the content
   * model doesn't need to change to add this later.
   */
  accountResources?: ResourceGroup[]
  /** Future — completion state placeholder. Unused by the MVP renderer. */
  progress?: 'not-started' | 'viewed' | 'worked-through' | 'practised'
  /**
   * Optional pointer to a real-world example of the method — rendered
   * at the end of the method page as a CTA card. Links out to the
   * example (a journey map, a service blueprint, a case study, etc).
   */
  bestPractice?: {
    image: string
    alt?: string
    description: string
    ctaLabel: string
    ctaHref: string
  }
}

export type ModuleItem = Card | Method

export type Module = {
  id: string
  title: string
  description: string
  cards: ModuleItem[]
}

export type Pathway = {
  id: string
  role: 'service-designer' | 'interaction-designer'
  title: string
  modules: Module[]
}
