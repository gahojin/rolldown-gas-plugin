import { defineConfig } from 'rolldown'
import IsolatedDecl from 'unplugin-isolated-decl/rolldown'

export default defineConfig([
  {
    treeshake: true,
    input: 'src/index.ts',
    output: [
      { dir: 'dist', format: 'esm', entryFileNames: '[name].mjs', sourcemap: true, cleanDir: true },
      { dir: 'dist', format: 'cjs', entryFileNames: '[name].cjs', sourcemap: true, exports: 'named' },
    ],
    plugins: [IsolatedDecl()],
  },
])
