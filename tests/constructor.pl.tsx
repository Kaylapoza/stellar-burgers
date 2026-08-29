import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров с моковыми ингредиентами из HAR', () => {
  // Настраиваем перехват запроса перед КАЖДЫМ тестом в этом блоке
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'fallback'
    });

    await page.goto('/');
  });

  test('Ингредиенты успешно загружаются из HAR и отображаются на странице', async ({
    page
  }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();
    await expect(firstIngredient).toBeVisible();
  });
});
