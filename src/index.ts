import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Plugin } from 'rolldown'

type Options = {
  appsScriptFile?: string
}

const generateEntry = (name: string, exports: string[]): [string, string] => {
  const entryPointFunctions = exports.map((exp) => `function ${exp}() {}`).join('\n')
  const globalAssignments = exports.map((exp) => `this.${exp} = ${name}.${exp};`).join('\n')
  return [entryPointFunctions, globalAssignments]
}

const plugin = ({ appsScriptFile }: Options = {}): Plugin => {
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
      if (outputOptions.format !== 'iife') {
        return
      }
      const name = outputOptions.name
      if (!name) {
        throw new Error('❌ Output name is required for IIFE format.')
      }

      Object.values(bundle)
        .filter((file) => file.type === 'chunk')
        .forEach((chunk) => {
          const code = chunk.code
          const [entryPointFunctions, globalAssignments] = generateEntry(name, chunk.exports || [])
          chunk.code = `${entryPointFunctions}\n${code}\n${globalAssignments}`
        })
    },
    writeBundle(outputOptions) {
      // 設定未設定時、エラー発生時は何もしない
      // 出力フォーマットがIIFEでない場合は何もしない
      if (!appsScriptFile || outputOptions.format !== 'iife') {
        return
      }

      const outputFile = outputOptions.file
      const outputDir = outputOptions.dir ?? (outputFile ? dirname(outputFile) : null)
      if (outputDir) {
        const destPath = resolve(__dirname, outputDir, 'appsscript.json')
        if (existsSync(appsScriptFile)) {
          try {
            copyFileSync(appsScriptFile, destPath)
            console.log(`✅ appsscript.json has been copied to ${outputDir}/`)
          } catch (err) {
            console.error('❌ Error during copying appsscript.json:', err)
          }
        }
      }
    },
  }
}

export default plugin
