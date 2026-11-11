import { defineConfig } from 'vitest/config';

// Pruebas de la API contra una base de datos MySQL REAL de pruebas (natas_drip_test).
//   npm run test:api
export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/tests/**/*.spec.js'],
    globalSetup: ['server/tests/setup-global.js'],
    env: { DB_NAME: 'natas_drip_test' },
    fileParallelism: false,
    testTimeout: 20000,
  },
});
