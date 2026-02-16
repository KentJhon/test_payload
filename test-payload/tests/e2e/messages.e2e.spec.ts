import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

const serverURL = 'http://localhost:3000'

test.describe('Messages Collection', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    const context = await browser.newContext()
    page = await context.newPage()
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to Messages list view', async () => {
    await page.goto(`${serverURL}/admin/collections/messages`)
    const heading = page.locator('h1', { hasText: 'Messages' }).first()
    await expect(heading).toBeVisible()
  })

  test('can open create message form', async () => {
    await page.goto(`${serverURL}/admin/collections/messages/create`)
    const senderField = page.locator('#field-sender')
    const contentField = page.locator('#field-content')
    await expect(senderField).toBeVisible()
    await expect(contentField).toBeVisible()
  })

  test('can create a new message', async () => {
    await page.goto(`${serverURL}/admin/collections/messages/create`)

    await page.fill('#field-sender', 'E2E Tester')
    await page.fill('#field-content', 'Hello from Playwright!')

    // Save the document
    await page.locator('button#action-save').click()

    // Wait for success toast
    const toast = page.locator('.Toastify', { hasText: 'successfully' })
    await expect(toast).toBeVisible({ timeout: 10000 })
  })

  test('created message appears in the list view', async () => {
    await page.goto(`${serverURL}/admin/collections/messages`)

    // Look for our message content in the table
    const row = page.locator('table tbody tr', { hasText: 'Hello from Playwright!' }).first()
    await expect(row).toBeVisible({ timeout: 10000 })
  })

  test('can edit an existing message', async () => {
    await page.goto(`${serverURL}/admin/collections/messages`)

    // Click into the message we created
    const row = page.locator('table tbody tr', { hasText: 'Hello from Playwright!' }).first()
    await row.locator('a').first().click()

    // Wait for the edit view to load
    const senderField = page.locator('#field-sender')
    await expect(senderField).toBeVisible({ timeout: 10000 })

    // Update the sender
    await senderField.clear()
    await senderField.fill('Updated Tester')

    await page.locator('button#action-save').click()

    const toast = page.locator('.Toastify', { hasText: 'successfully' })
    await expect(toast).toBeVisible({ timeout: 10000 })

    // Verify the field has the updated value
    await expect(senderField).toHaveValue('Updated Tester')
  })

  test('can delete a message', async () => {
    await page.goto(`${serverURL}/admin/collections/messages`)

    // Click into the message
    const row = page.locator('table tbody tr', { hasText: 'Hello from Playwright!' }).first()
    await row.locator('a').first().click()

    // Open the actions menu and delete via the kebab/popup menu
    const moreActions = page.locator('.doc-controls__popup .popup-button').first()
    await moreActions.click()

    const deleteButton = page.locator('button', { hasText: 'Delete' }).first()
    await expect(deleteButton).toBeVisible()
    await deleteButton.click()

    // Confirm deletion in the modal
    const confirmButton = page.locator('#confirm-delete')
    await expect(confirmButton).toBeVisible({ timeout: 5000 })
    await confirmButton.click()

    // Should redirect back to list view
    await expect(page).toHaveURL(/\/admin\/collections\/messages/, { timeout: 10000 })
  })
})
