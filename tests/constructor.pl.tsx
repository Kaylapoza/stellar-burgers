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
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          success: true,
          name: 'Краторный бургер',
          order: {
            number: 7777 // Этот номер мы  будем проверять в модалке
          }
        }
      });
    });

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

  test('должен добавлять булки и начинки в конструктор', async ({ page }) => {
    // 1. Находим изолированные секции по их data-testid
    const constructorSection = page.getByTestId('burger-constructor');
    const bunsCategory = page.getByTestId('buns-category');
    const mainsCategory = page.getByTestId('mains-category');

    // 2. Ищем кнопку "Добавить" СТРОГО внутри нужной секции
    await bunsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();
    await mainsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    // 3. Проверяем конструктор
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

    await expect(modal).toBeVisible(); //модалка открылась при клике
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

    await bunsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();
    await mainsCategory
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    orderButton.click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('7777');
    await expect(constructorSection).toContainText('Выберите булки');
    await expect(constructorSection).toContainText('Выберите начинку');
  });
});
