import { defineConfig } from 'rolldown'
import IsolatedDecl from 'unplugin-isolated-decl/rolldown'

export default defineConfig([
  {
    external: ['gas-entry-generator'],
    treeshake: true,
    input: 'src/index.ts',
    output: [
      { format: 'esm', entryFileNames: '[name].mjs', sourcemap: true },
      { format: 'cjs', entryFileNames: '[name].cjs', sourcemap: true, exports: 'named' },
    ],
    plugins: [IsolatedDecl()],
  },
])
