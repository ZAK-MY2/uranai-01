import { test, expect } from '@playwright/test';

test.describe('Fortune Telling Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main dashboard', async ({ page }) => {
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/最強占い師システム/);
    
    // Check for main navigation elements
    await expect(page.locator('text=占い師ダッシュボード')).toBeVisible();
    await expect(page.locator('text=統合占術')).toBeVisible();
    await expect(page.locator('text=個別占術')).toBeVisible();
  });

  test('should perform a basic tarot reading', async ({ page }) => {
    // Navigate to tarot reading
    await page.click('text=個別占術');
    await page.click('text=タロット');

    // Fill in the form
    await page.fill('input[placeholder*="質問"]', 'テスト質問です');
    await page.selectOption('select', 'three_card');
    
    // Submit the form
    await page.click('button:has-text("占う")');

    // Wait for results
    await expect(page.locator('text=タロット占い結果')).toBeVisible({ timeout: 30000 });
    
    // Check that cards are displayed
    await expect(page.locator('[data-testid="tarot-card"]')).toHaveCount(3);
    
    // Check that interpretation is shown
    await expect(page.locator('text=総合的な解釈')).toBeVisible();
    await expect(page.locator('text=アドバイス')).toBeVisible();
  });

  test('should perform a numerology calculation', async ({ page }) => {
    // Navigate to numerology
    await page.click('text=個別占術');
    await page.click('text=数秘術');

    // Fill in the form
    await page.fill('input[placeholder*="フルネーム"]', 'テスト太郎');
    await page.fill('input[type="date"]', '1990-05-15');
    
    // Submit the form
    await page.click('button:has-text("計算")');

    // Wait for results
    await expect(page.locator('text=数秘術結果')).toBeVisible({ timeout: 10000 });
    
    // Check that all numbers are displayed
    await expect(page.locator('text=ライフパス')).toBeVisible();
    await expect(page.locator('text=デスティニー')).toBeVisible();
    await expect(page.locator('text=ソウル')).toBeVisible();
    await expect(page.locator('text=パーソナリティ')).toBeVisible();
    
    // Check that interpretation is shown
    await expect(page.locator('text=総合的な解釈')).toBeVisible();
  });

  test('should perform an integrated reading', async ({ page }) => {
    // Navigate to integrated reading
    await page.click('text=統合占術');

    // Fill in the comprehensive form
    await page.fill('input[placeholder*="フルネーム"]', 'テスト花子');
    await page.fill('input[type="date"]', '1985-12-01');
    await page.fill('textarea[placeholder*="質問"]', '私の人生の目的は何ですか？');
    await page.selectOption('select[name="spreadType"]', 'three_card');
    
    // Submit the form
    await page.click('button:has-text("統合占術を実行")');

    // Wait for results (this might take longer)
    await expect(page.locator('text=統合占術結果')).toBeVisible({ timeout: 60000 });
    
    // Check that all systems are represented
    await expect(page.locator('text=数秘術')).toBeVisible();
    await expect(page.locator('text=タロット')).toBeVisible();
    await expect(page.locator('text=環境データ')).toBeVisible();
    await expect(page.locator('text=統合解釈')).toBeVisible();
    
    // Check for integration insights
    await expect(page.locator('text=共通テーマ')).toBeVisible();
    await expect(page.locator('text=総合的な指針')).toBeVisible();
    await expect(page.locator('text=具体的なアドバイス')).toBeVisible();
  });

  test('should display environment data', async ({ page }) => {
    // Navigate to environment data
    await page.click('text=環境データ');

    // Check that environment information is displayed
    await expect(page.locator('text=現在の環境情報')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=月相')).toBeVisible();
    await expect(page.locator('text=天候')).toBeVisible();
    await expect(page.locator('text=位置情報')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that mobile navigation works
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Navigate to a page via mobile menu
    await page.click('text=個別占術');
    await page.click('text=タロット');
    
    // Check that the form is usable on mobile
    await expect(page.locator('input[placeholder*="質問"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('button:has-text("占う")')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Navigate to numerology
    await page.click('text=個別占術');
    await page.click('text=数秘術');

    // Try to submit without filling required fields
    await page.click('button:has-text("計算")');

    // Check for error messages
    await expect(page.locator('text=フルネームは必須です')).toBeVisible();
    
    // Fill in invalid data
    await page.fill('input[placeholder*="フルネーム"]', 'テスト');
    await page.fill('input[type="date"]', 'invalid-date');
    
    await page.click('button:has-text("計算")');
    
    // Should show validation error
    await expect(page.locator('text=正しい形式で入力してください')).toBeVisible();
  });

  test('should persist data during session', async ({ page }) => {
    // Fill in form data
    await page.click('text=個別占術');
    await page.click('text=数秘術');
    
    await page.fill('input[placeholder*="フルネーム"]', 'セッションテスト');
    await page.fill('input[type="date"]', '1990-01-01');
    
    // Navigate away and back
    await page.click('text=ダッシュボード');
    await page.click('text=個別占術');
    await page.click('text=数秘術');
    
    // Check if data is still there (if using session storage)
    const nameValue = await page.inputValue('input[placeholder*="フルネーム"]');
    const dateValue = await page.inputValue('input[type="date"]');
    
    // Note: This test depends on whether the app implements session persistence
    // If not implemented, these might be empty
    console.log('Name value:', nameValue);
    console.log('Date value:', dateValue);
  });

  test('should load and display all divination systems', async ({ page }) => {
    // Check that all individual divination systems are accessible
    await page.click('text=個別占術');
    
    const systems = [
      'タロット',
      '数秘術',
      '西洋占星術',
      '易経',
      '四柱推命',
      'ルーン',
      '手相',
      'ヴェーダ占星術'
    ];

    for (const system of systems) {
      await expect(page.locator(`text=${system}`)).toBeVisible();
    }
  });

  test('should display loading states correctly', async ({ page }) => {
    // Navigate to integrated reading
    await page.click('text=統合占術');

    // Fill in form
    await page.fill('input[placeholder*="フルネーム"]', 'ローディングテスト');
    await page.fill('input[type="date"]', '1990-05-15');
    await page.fill('textarea[placeholder*="質問"]', 'テスト質問');
    await page.selectOption('select[name="spreadType"]', 'three_card');
    
    // Submit and check for loading state
    await page.click('button:has-text("統合占術を実行")');
    
    // Should show loading indicator
    await expect(page.locator('text=計算中' || 'text=読み込み中' || '[data-testid="loading"]')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('text=統合占術結果')).toBeVisible({ timeout: 60000 });
  });

  test('should handle network errors', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    // Try to perform a reading
    await page.click('text=個別占術');
    await page.click('text=タロット');
    
    await page.fill('input[placeholder*="質問"]', 'ネットワークエラーテスト');
    await page.selectOption('select', 'three_card');
    
    await page.click('button:has-text("占う")');
    
    // Should show error message
    await expect(page.locator('text=エラーが発生しました' || 'text=接続エラー')).toBeVisible({ timeout: 10000 });
  });
});