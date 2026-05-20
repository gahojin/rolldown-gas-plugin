import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
    benchmark: {
      include: ['src/**/*.bench.ts'],
    },
  },
})
