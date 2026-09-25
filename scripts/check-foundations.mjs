#!/usr/bin/env node
/**
 * Checks a Foundations chapter against the gold standard (docs/DESIGN-RULES.md). It loads the page
 * with the spacing overlay on, reads every named gap at 1440px and 1024px, and fails on any gap
 * that is not on the scale: 96 (top), 48 (title to statement), 64 (block to block and chapter end)
 * or 32 (paragraph to paragraph). A photograph's plane (one grid gap) is allowed as it is.
 *
 * Usage: node scripts/check-foundations.mjs who-we-are [more slugs]
 * Needs the dev server on localhost:3019 and Playwright.
 */
import { chromium } from 'playwright'

const slugs = process.argv.slice(2)
if (!slugs.length) {
  console.error('Usage: node scripts/check-foundations.mjs <slug> [slug …]')
  process.exit(2)
}

const SCALE = new Set([96, 64, 48, 32])
const browser = await chromium.launch()
let failures = 0

for (const slug of slugs) {
  for (const width of [1440, 1024]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    await page.addInitScript(() => localStorage.setItem('katsura:spacing', 'on'))
    await page.goto(`http://localhost:3019/foundations/${slug}`, { waitUntil: 'load' })
    await page.waitForTimeout(2500)
    const gaps = await page.evaluate(() =>
      [...document.querySelectorAll('.spacing-overlay__box')].map((b) => {
        const [id, rest] = b.title.split(': ')
        const px = parseFloat(b.querySelector('.spacing-overlay__tag').textContent.split('·')[1])
        return { id, label: rest.split(',')[0], px }
      }),
    )
    const bad = gaps.filter(
      (g) => g.id.startsWith('V') && !/plane/i.test(g.label) && !SCALE.has(Math.round(g.px)),
    )
    const widths = await page.evaluate(() => {
      const text = [...document.querySelectorAll('.fc__block--text')].map((e) => e.getBoundingClientRect())
      const main = document.querySelector('.fc__main').getBoundingClientRect()
      const others = [...document.querySelectorAll('.fc__block:not(.fc__block--text)')].map((e) => e.getBoundingClientRect())
      return {
        offLeft: [...text, ...others].filter((r) => Math.abs(r.left - main.left) > 0.5).length,
        offRight: others.filter((r) => Math.abs(r.right - main.right) > 0.5).length,
      }
    })
    const ok = !bad.length && !widths.offLeft && !widths.offRight
    if (!ok) failures++
    console.log(`${ok ? 'PASS' : 'FAIL'} ${slug} at ${width}px: ${gaps.filter((g) => g.id.startsWith('V')).length} gaps checked`)
    for (const g of bad) console.log(`  ${g.id} ${g.label}: ${g.px}px is not on the scale`)
    if (widths.offLeft) console.log(`  ${widths.offLeft} block(s) not starting on column 2`)
    if (widths.offRight) console.log(`  ${widths.offRight} block(s) not ending on column 12`)
    await page.close()
  }
}

await browser.close()
process.exit(failures ? 1 : 0)
