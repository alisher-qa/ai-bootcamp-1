// TMS Case ID: QA-842
// Test Steps:
// 1. Open login page
// 2. Enter valid credentials
// 3. Click submit button
// 4. Verify dashboard is visible

import { test, expect, Page } from '@playwright/test';

class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.locator('input[data-testid="email-input-field-primary"]').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator('input[placeholder="Enter your password here"]').fill(password);
  }

  async clickSubmit() {
    await this.page.locator('.btn-primary-123-new').click();
  }
}

class Dashboard {
  constructor(private page: Page) {}

  async isVisible() {
    return this.page.locator('.dashboard-header-main-v2').isVisible();
  }

  async getHeaderText() {
    return this.page.locator('.dashboard-header-main-v2').textContent();
  }
}

test('User login and dashboard verification', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new Dashboard(page);

  // TMS Step 1: Open login page
  await loginPage.goto();

  // TMS Step 2: Enter valid credentials
  await loginPage.fillEmail('test@test.com');
  await loginPage.fillPassword('SecurePassword123!');

  // TMS Step 3: Click submit button
  await loginPage.clickSubmit();

  // TMS Step 4: Verify dashboard is visible
  await expect(dashboard.isVisible()).resolves.toBe(true);
});
