import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, type UserConfigExport } from 'vitest/config'

const config: UserConfigExport = {
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    benchmark: {
      include: ['src/**/*.bench.ts'],
    },
  },
}

export default defineConfig(config)
