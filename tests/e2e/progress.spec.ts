import { expect, test } from '@playwright/test'

test('a first visit sets no learner cookie', async ({ request }) => {
  const response = await request.get('/foundations')
  expect(response.headers()['set-cookie'] ?? '').not.toContain('katsura_learner')
})

test('marking a chapter read without JavaScript lights its card', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/foundations/what-we-do')
  await page.getByRole('button', { name: /Mark What we do as read/ }).click()
  await expect(page).toHaveURL(/\/foundations\/what-we-do$/)
  await page.goto('/foundations')
  await expect(page.getByRole('link', { name: 'What we do, read' })).toHaveAttribute('data-state', 'read')
  await expect(page.getByText('1 of 6 read')).toBeVisible()
  await page.getByRole('button', { name: 'Forget my progress' }).click()
  await expect(page.getByText('0 of 6 read')).toBeVisible()
  await context.close()
})

test('reaching the end of a chapter with JavaScript fills the mark', async ({ page }) => {
  await page.goto('/foundations/why-we-do-it')
  await page.locator('.chapter-end__mark').scrollIntoViewIfNeeded()
  await expect(page.locator('.chapter-end')).toHaveAttribute('data-state', 'read', { timeout: 5000 })
  await page.goto('/foundations')
  await expect(page.getByRole('link', { name: 'Why we do it, read' })).toBeVisible()
})

test('the Head, Heart and Hands hamburger returns to the foundations grid', async ({ page }) => {
  await page.goto('/foundations/head-heart-and-hands')
  await expect(page.locator('.p1v2__headline')).toHaveText('Head, heart and hands')
  await page.getByRole('button', { name: 'Back to the foundations' }).click()
  await page.waitForURL(/\/foundations$/)
  await expect(page.locator('.chapter-frame')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Explore the')
})
