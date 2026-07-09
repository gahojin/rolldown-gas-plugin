import { existsSync } from 'node:fs'
import { copyFile } from 'node:fs/promises'
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
      // 出力フォーマットがIIFEでない場合は何もしない/出力フォーマット未指定の場合、IIFEとして処理する
      if (outputOptions.format && outputOptions.format !== 'iife') {
        return
      }
      outputOptions.format = 'iife'
      // 名前が指定されていない場合はデフォルトで '_' を設定
      outputOptions.name = outputOptions.name || '_'
      return outputOptions
    },
    async generateBundle(outputOptions, bundle) {
      // 出力フォーマットがIIFEでない場合は何もしない
      if (outputOptions.format !== 'iife') {
        return
      }
      const name = outputOptions.name
      if (!name) {
        throw new Error('❌ Output name is required for IIFE format.')
      }

      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') {
          const [entryPointFunctions, globalAssignments] = generateEntry(name, file.exports || [])
          file.code = `${entryPointFunctions}\n${file.code}\n${globalAssignments}`
        }
      }
    },
    async writeBundle(outputOptions) {
      // appscript.jsonコピー設定されている場合、ファイルコピーを行う
      if (appsScriptFile && existsSync(appsScriptFile)) {
        const outputDir = outputOptions.dir || (outputOptions.file ? dirname(outputOptions.file) : '')
        if (!outputDir) {
          return
        }
        try {
          const destPath = resolve(outputDir, 'appsscript.json')
          await copyFile(appsScriptFile, destPath)
          console.log(`✅ appsscript.json has been copied to ${outputDir}/`)
        } catch (err) {
          this.error(`❌ Error during copying appsscript.json: ${err}`)
        }
      }
    },
  }
}

export default plugin
