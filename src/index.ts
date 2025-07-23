import { generate } from 'gas-entry-generator'
import type { Plugin } from 'rolldown'

const exportsRegex = /exports\./g

const plugin = (): Plugin => {
  return {
    name: 'rolldown-gas-plugin',
    generateBundle(outputOptions, bundle) {
      const name = outputOptions.name
      const minify = outputOptions.minify

      Object.values(bundle)
        .filter((file) => file.type === 'chunk')
        .map((chunk) => {
          const originalCode = chunk.code
          const code = minify ? originalCode.replaceAll(exportsRegex, '\nexports.') : originalCode
          const codePrefix = name ? '' : 'var _ = '
          const gas = generate(code, {
            comment: false,
            exportsIdentifierName: name ?? '_',
            autoGlobalExports: true,
            globalIdentifierName: 'this',
          })
          chunk.code = `${gas.entryPointFunctions}\n${codePrefix}${originalCode}\n${gas.globalAssignments}`
        })
    },
  }
}

export default plugin
