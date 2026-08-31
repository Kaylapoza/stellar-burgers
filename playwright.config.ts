/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

// Определите порт вашего локального сервера (например, 4000)
const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',

  // Явно указываем поиск файлов с расширением .pl.tsx и .test.tsx
  testMatch: ['**/*.pl.tsx', '**/*.test.tsx', '**/*.spec.tsx'],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // Порт в baseURL должен строго совпадать с портом webServer
    baseURL: BASE_URL,
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: {
    command: 'npm run start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240 * 1000 // Даем 4 минуты на запуск dev-сервера
  }
});
