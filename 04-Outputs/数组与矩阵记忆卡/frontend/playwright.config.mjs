import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:18765',
    browserName: 'chromium',
    channel: process.env.SHIYI_BROWSER_CHANNEL || undefined,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: '../.venv/bin/python ../tests/browser_server.py',
    url: 'http://127.0.0.1:18765/api/session',
    reuseExistingServer: false,
    timeout: 20000,
  },
});
