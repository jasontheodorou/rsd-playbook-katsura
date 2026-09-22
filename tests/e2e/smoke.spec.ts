import { expect, test } from '@playwright/test'

test('public page renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('katsura')
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
