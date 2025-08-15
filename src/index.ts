import type { Plugin } from 'rolldown'

const generateEntry = (name: string, exports: string[]): [string, string] => {
  const entryPointFunctions = exports.map((exp) => `function ${exp}() {}`).join('\n')
  const globalAssignments = exports.map((exp) => `this.${exp} = ${name}.${exp};`).join('\n')
  return [entryPointFunctions, globalAssignments]
}

const plugin = (): Plugin => {
  return {
    name: 'rolldown-gas-plugin',
    outputOptions: (outputOptions) => {
      // 出力フォーマットがIIFEでない場合は何もしない
      if (!outputOptions.format || outputOptions.format !== 'iife') {
        return
      }
      // 名前が指定されていない場合はデフォルトで '_' を設定
      if (!outputOptions.name) {
        outputOptions.name = '_'
      }
      return outputOptions
    },
    generateBundle(outputOptions, bundle) {
      // 出力フォーマットがIIFEでない場合は何もしない
      if (!outputOptions.format || outputOptions.format !== 'iife') {
        return
      }
      const name = outputOptions.name
      if (!name) {
        throw new Error('Output name is required for IIFE format.')
      }

      Object.values(bundle)
        .filter((file) => file.type === 'chunk')
        .forEach((chunk) => {
          const code = chunk.code
          const [entryPointFunctions, globalAssignments] = generateEntry(name, chunk.exports || [])
          chunk.code = `${entryPointFunctions}\n${code}\n${globalAssignments}`
        })
    },
  }
}

export default plugin
