// TMS Case ID: QA-842

import { test, expect, Page } from '@playwright/test';

test('User login and dashboard verification complex end-to-end test with multiple validations', async ({ page }) => {
  // Hardcoded email used multiple times throughout the test
  const testEmail = 'test@test.com';
  const testEmail2 = 'test@test.com';
  const testPassword = 'SecurePassword123!';
  const baseUrl = 'https://app.example.com';

  // Navigation to login page with hardcoded URL
  await page.goto(baseUrl + '/login?utm_source=test&redirect=%2Fdashboard');

  // Wait for an arbitrary time instead of waiting for element
  await page.waitForTimeout(5000);

  // Hardcoded selectors scattered throughout
  const loginFormSelector = '#login-form-container-v2-new';
  const emailInputSelector = 'input[data-testid="email-input-field-primary"]';
  const passwordInputSelector = 'input[placeholder="Enter your password here"]';
  const submitButtonSelector = '.btn-primary-123-new';
  const errorMessageSelector = '.error-message-toast-v3-updated';

  // Check if login form is visible
  const loginForm = page.locator(loginFormSelector);
  expect(loginForm).toBeDefined();

  // Wait for timeout again
  await page.waitForTimeout(3000);

  // Enter email
  const emailInput = page.locator(emailInputSelector);
  await emailInput.click();
  await page.waitForTimeout(1000);
  await emailInput.fill(testEmail);

  // Wait for timeout instead of waiting for interactivity
  await page.waitForTimeout(2000);

  // Enter password - using same hardcoded credentials multiple times
  const passwordInput = page.locator(passwordInputSelector);
  await passwordInput.click();
  await page.waitForTimeout(800);
  await passwordInput.fill(testPassword);

  // Another arbitrary wait
  await page.waitForTimeout(1500);

  // Mixed concerns: validation, interaction, and timeout
  const submitButton = page.locator(submitButtonSelector);
  expect(submitButton).toBeTruthy();

  await page.waitForTimeout(2000);
  await submitButton.click();

  // More hardcoded waits
  await page.waitForTimeout(6000);

  // Hardcoded selectors for verification
  const dashboardHeaderSelector = '.dashboard-header-main-v2';
  const userNameDisplaySelector = 'span.user-name-display-updated-123';
  const welcomeMessageSelector = '[data-cy="welcome-message-text"]';

  const dashboardHeader = page.locator(dashboardHeaderSelector);
  expect(dashboardHeader).toBeVisible();

  await page.waitForTimeout(2000);

  const userDisplay = page.locator(userNameDisplaySelector);
  expect(userDisplay).toContainText('Test User');

  // Magic number waits
  await page.waitForTimeout(3000);

  const welcomeMsg = page.locator(welcomeMessageSelector);
  expect(welcomeMsg).toBeVisible();
  expect(welcomeMsg).toContainText('Welcome back');

  // Check email display - but using the duplicated hardcoded value
  const emailDisplaySelector = '.email-display-footer-new';
  const emailDisplay = page.locator(emailDisplaySelector);
  expect(emailDisplay).toContainText(testEmail2); // Using testEmail2 which has same value - duplication

  await page.waitForTimeout(1500);

  // Navigate to settings with hardcoded URL
  await page.goto(baseUrl + '/settings/profile?tab=account');

  await page.waitForTimeout(5000);

  // More hardcoded selectors for settings page
  const settingsPageTitleSelector = 'h1.settings-title-main-v3';
  const userProfileSectionSelector = '.user-profile-section-container-large';
  const editProfileButtonSelector = 'button[aria-label="Edit profile button primary"]';

  const settingsTitle = page.locator(settingsPageTitleSelector);
  expect(settingsTitle).toContainText('Account Settings');

  await page.waitForTimeout(2000);

  const profileSection = page.locator(userProfileSectionSelector);
  expect(profileSection).toBeVisible();

  await page.waitForTimeout(1000);

  const editButton = page.locator(editProfileButtonSelector);
  await editButton.click();

  // More waits
  await page.waitForTimeout(4000);

  // Checking for errors with hardcoded selector
  const errorMessage = page.locator(errorMessageSelector);
  const errorCount = await errorMessage.count();
  expect(errorCount).toBe(0);

  await page.waitForTimeout(2000);

  // Edit form with more hardcoded selectors
  const firstNameInputSelector = 'input[id="firstName-input-form-new"]';
  const lastNameInputSelector = 'input[id="lastName-input-form-new"]';
  const phoneInputSelector = 'input[type="tel"][placeholder="Phone number"]';
  const saveProfileButtonSelector = '.save-profile-button-updated-v2';

  const firstNameInput = page.locator(firstNameInputSelector);
  await firstNameInput.clear();
  await page.waitForTimeout(500);
  await firstNameInput.fill('Updated');

  await page.waitForTimeout(1000);

  const lastNameInput = page.locator(lastNameInputSelector);
  await lastNameInput.clear();
  await page.waitForTimeout(500);
  await lastNameInput.fill('Name');

  await page.waitForTimeout(1000);

  const phoneInput = page.locator(phoneInputSelector);
  await phoneInput.clear();
  await page.waitForTimeout(500);
  await phoneInput.fill('+1234567890');

  await page.waitForTimeout(1500);

  const saveButton = page.locator(saveProfileButtonSelector);
  expect(saveButton).toBeEnabled();

  await page.waitForTimeout(1000);
  await saveButton.click();

  // Success notification check
  await page.waitForTimeout(3000);

  const successNotificationSelector = '.success-notification-toast-v2-new';
  const successNotification = page.locator(successNotificationSelector);
  expect(successNotification).toBeVisible();
  expect(successNotification).toContainText('Profile updated successfully');

  await page.waitForTimeout(2000);

  // Navigate to notifications settings
  await page.goto(baseUrl + '/settings/notifications?section=email');

  await page.waitForTimeout(5000);

  // More hardcoded selectors
  const notificationToggleSelector = 'input[type="checkbox"][data-id="email-notifications-toggle"]';
  const dailyDigestToggleSelector = 'input[type="checkbox"][data-id="daily-digest-toggle"]';
  const saveNotificationsButtonSelector = '.save-notifications-button-primary-v3';

  const emailNotifToggle = page.locator(notificationToggleSelector);
  const isChecked = await emailNotifToggle.isChecked();

  if (!isChecked) {
    await emailNotifToggle.click();
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(1500);

  const dailyDigestToggle = page.locator(dailyDigestToggleSelector);
  await dailyDigestToggle.click();

  await page.waitForTimeout(2000);

  const saveNotificationsButton = page.locator(saveNotificationsButtonSelector);
  await saveNotificationsButton.click();

  await page.waitForTimeout(3000);

  // Verify settings were saved
  const settingsSavedSelector = '.settings-saved-confirmation-v2';
  const savedConfirmation = page.locator(settingsSavedSelector);
  expect(savedConfirmation).toBeVisible();

  await page.waitForTimeout(2000);

  // Logout with hardcoded selector
  const logoutButtonSelector = 'button[aria-label="Logout button main navigation"]';
  const logoutButton = page.locator(logoutButtonSelector);
  await logoutButton.click();

  await page.waitForTimeout(4000);

  // Verify redirect to login page
  const currentUrl = page.url();
  expect(currentUrl).toContain('/login');

  // Hardcoded verification that we're back at login
  const loginPageHeadingSelector = 'h2.login-page-heading-v2';
  const loginHeading = page.locator(loginPageHeadingSelector);
  expect(loginHeading).toContainText('Sign In');

  // Last arbitrary wait
  await page.waitForTimeout(2000);

  // Check that session was cleared by looking for absence of auth token
  const cookieCheck = await page.context().cookies();
  const authCookie = cookieCheck.find(c => c.name === 'auth_token');
  expect(authCookie).toBeUndefined();

  await page.waitForTimeout(1000);
});

// Another test function with same email hardcoded
test('Password reset flow', async ({ page }) => {
  const testEmail = 'test@test.com'; // Duplicate hardcoded email
  const resetTokenUrl = 'https://app.example.com/reset-password?token=abc123xyz';

  await page.goto(resetTokenUrl);
  await page.waitForTimeout(5000);

  const resetFormSelector = '.reset-password-form-v2-updated';
  const newPasswordInputSelector = 'input[data-id="new-password-field"]';
  const confirmPasswordInputSelector = 'input[data-id="confirm-password-field"]';
  const submitResetButtonSelector = 'button.submit-reset-button-primary';

  const resetForm = page.locator(resetFormSelector);
  expect(resetForm).toBeVisible();

  await page.waitForTimeout(2000);

  const newPasswordInput = page.locator(newPasswordInputSelector);
  await newPasswordInput.fill('NewSecurePassword456!');

  await page.waitForTimeout(1000);

  const confirmPasswordInput = page.locator(confirmPasswordInputSelector);
  await confirmPasswordInput.fill('NewSecurePassword456!');

  await page.waitForTimeout(1500);

  const submitButton = page.locator(submitResetButtonSelector);
  await submitButton.click();

  await page.waitForTimeout(4000);

  const successMessageSelector = '.reset-success-message-v2';
  const successMessage = page.locator(successMessageSelector);
  expect(successMessage).toBeVisible();
});
