import { test, expect } from '@playwright/test';

test('should allow a user to sign up successfully', async ({ page }) => {
    await page.goto('/signup'); // Assuming you have a signup page

    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    await page.click('button[type="submit"]');

    // Expect a success message or redirection to a dashboard
    //   await expect(page.locator('.success-message')).toBeVisible();
    await expect(page).toHaveURL(/.*signup/);
});

test('should display an error message for invalid signup input', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'short');
    await page.click('button[type="submit"]');

    // Expect an error message to be visible
    //   await expect(page.locator('.error-message')).toBeVisible();
});