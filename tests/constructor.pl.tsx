import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров с моковыми ингредиентами из HAR', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/auth/user'
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders'
    });

    await page.goto('/');
  });

  test('Ингредиенты успешно загружаются из HAR и отображаются на странице', async ({
    page
  }) => {
    const firstIngredient = page.locator('a[href^="/ingredients/"]').first();
    await expect(firstIngredient).toBeVisible();
  });

  test('должен добавлять булки и начинки в конструктор', async ({ page }) => {
    const constructorSection = page.getByTestId('burger-constructor');
    const bunsCategory = page.getByTestId('buns-category');
    const mainsCategory = page.getByTestId('mains-category');

    await bunsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();
    await mainsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    await expect(constructorSection).not.toContainText('Выберите булки');
    await expect(constructorSection).not.toContainText('Выберите начинку');
  });

  test('модальное окно открывается по клику на карточку', async ({ page }) => {
    const modal = page.getByTestId('modal');
    const card = page.getByTestId('ingredient-link').first();
    const ingredientName = await card
      .locator('p.text_type_main-default')
      .textContent();

    await card.click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText(ingredientName!);
  });

  test('модальное окно закрывается по клику на крестик', async ({ page }) => {
    const modal = page.getByTestId('modal');
    const card = page.getByTestId('ingredient-link').first();
    const modalCloseBtn = page.getByTestId('modal-close-button');

    await card.click();
    await modalCloseBtn.click();

    await expect(modal).not.toBeVisible();
  });

  test('модальное окно закрывается по клику на оверлей', async ({ page }) => {
    const modal = page.getByTestId('modal');
    const card = page.getByTestId('ingredient-link').first();
    const overlay = page.getByTestId('modal-overlay');

    await card.click();
    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
  });

  test('Сборка бургера и клик по оформлению', async ({ page }) => {
    const constructorSection = page.getByTestId('burger-constructor');
    const bunsCategory = page.getByTestId('buns-category');
    const mainsCategory = page.getByTestId('mains-category');
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    const modal = page.getByTestId('modal');

    // 1. Добавляем ингредиенты
    await bunsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();
    await mainsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    // 2. Проверяем, что кнопуля доступна и ингредиенты действительно в конструкторе
    await expect(constructorSection).not.toContainText('Выберите булки');
    await expect(constructorSection).not.toContainText('Выберите начинку');

    // 3. Кликаем оформление
    await orderButton.click();

    // 4. Проверяем появление модалки с 7777
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('7777');
    await expect(constructorSection).toContainText('Выберите булки');
    await expect(constructorSection).toContainText('Выберите начинку');
  });
});
