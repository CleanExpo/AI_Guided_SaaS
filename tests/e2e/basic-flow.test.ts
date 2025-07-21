import { test, expect } from '@playwright/test'

test.describe('Basic User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Guided SaaS/)
    await expect(page.locator('h1')).toContainText(/Welcome/)
  })

  test('should navigate to project generator', async ({ page }) => {
    // Click on get started or create project button
    await page.click('text=Get Started')
    
    // Should be on project creation page
    await expect(page).toHaveURL(/\/projects|\/new/)
    await expect(page.locator('h1,h2')).toContainText(/Create|Project/)
  })

  test('should show AI chat interface', async ({ page }) => {
    // Navigate to chat or find chat component
    const chatButton = page.locator('text=Chat')
    if (await chatButton.isVisible()) {
      await chatButton.click()
    }
    
    // Check for chat interface elements
    await expect(page.locator('[data-testid=chat-input], textarea')).toBeVisible()
  })

  test('should handle client requirements input', async ({ page }) => {
    // Navigate to requirements capture
    await page.goto('http://localhost:3000/requirements')
    
    // Fill in requirements
    const textarea = page.locator('textarea')
    await textarea.fill('I need a simple blog with user authentication')
    
    // Submit button should be enabled
    const submitButton = page.locator('button[type=submit]')
    await expect(submitButton).toBeEnabled()
  })

  test('should check API health', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/api/health')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.status).toBe('healthy')
  })
})