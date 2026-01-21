import { defineConfig } from 'rolldown'
import IsolatedDecl from 'unplugin-isolated-decl/rolldown'

export default defineConfig([
  {
    treeshake: true,
    input: 'src/index.ts',
    platform: 'node',
    output: [{ dir: 'dist', format: 'esm', entryFileNames: '[name].mjs', sourcemap: true, cleanDir: true }],
    plugins: [IsolatedDecl()],
  },
])
