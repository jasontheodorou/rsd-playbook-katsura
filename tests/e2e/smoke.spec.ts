import { expect, test } from '@playwright/test'

test('public page renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The RSD Playbook')
  await context.close()
})

test('admin loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin/)
})

test('jobs endpoint refuses callers without the secret', async ({ request }) => {
  const response = await request.post('/api/jobs/run')
  expect(response.status()).toBe(401)
})

test('the top bar title is identical on every page', async ({ page }) => {
  const measure = async (path: string) => {
    await page.goto(path)
    return page.locator('.topbar__title').evaluate((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return [Math.round(r.x * 10), Math.round(r.y * 10), Math.round(r.height * 10), cs.fontSize, cs.fontWeight, cs.color, cs.fontFamily].join('|')
    })
  }
  const home = await measure('/')
  for (const path of ['/foundations', '/foundations/head-heart-and-hands', '/foundations/how-we-deliver']) {
    expect(await measure(path)).toBe(home)
  }
})
