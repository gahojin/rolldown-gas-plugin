import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig([
  {
    treeshake: true,
    input: 'src/index.ts',
    external: ['rolldown'],
    platform: 'node',
    output: [{ dir: 'dist', format: 'es', sourcemap: true, cleanDir: true }],
    plugins: [dts()],
  },
])
