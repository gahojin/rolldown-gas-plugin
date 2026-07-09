import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'rolldown'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import gasPlugin from './index.js'

describe('test', async () => {
  const distPath = resolve(__dirname, './dist')

  beforeAll(async () => {
    await rm(distPath, { force: true, recursive: true })
  })

  test.each([
    { name: 'minify:false', options: { minify: false } },
    { name: 'minify:false with name=a', options: { name: 'a', minify: false } },
    { name: 'minify:true', options: { minify: true } },
    { name: 'minify:true with name=a', options: { name: 'a', minify: true } },
  ])('$name', async ({ options }) => {
    const outfilePath = resolve(distPath, `${options.name || 'default'}_${options.minify}.js`)

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        format: 'iife',
        file: outfilePath,
        ...options,
      },
      plugins: [gasPlugin()],
    })

    const outfile = await readFile(outfilePath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('appsscript.json copy', async () => {
    const testPath = resolve(__dirname, 'dummy_appsscript.json')
    const outfilePath = resolve(distPath, 'test_copy.js')
    const destAppscriptPath = resolve(distPath, 'appsscript.json')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        name: 'a',
        format: 'iife',
        file: outfilePath,
        minify: true,
      },
      plugins: [gasPlugin({ appsScriptFile: testPath })],
    })

    const outfile = await readFile(destAppscriptPath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('appsscript.json not copied when file missing', async () => {
    const testPath = resolve(__dirname, 'non_existent_appsscript.json')
    const outfilePath = resolve(distPath, 'test_no_copy.js')
    const destAppscriptPath = resolve(distPath, 'appsscript.json')

    // Explicitly remove manifest if it exists from previous tests
    await rm(destAppscriptPath, { force: true })

    const consoleSpy = vi.spyOn(console, 'log')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        name: 'a',
        format: 'iife',
        file: outfilePath,
        minify: true,
      },
      plugins: [gasPlugin({ appsScriptFile: testPath })],
    })

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('✅ appsscript.json has been copied'))
    expect(existsSync(destAppscriptPath)).toBe(false)
    consoleSpy.mockRestore()
  })
  test('appsscript.json not copied when output destination is missing', async () => {
    const testPath = resolve(__dirname, 'dummy_appsscript.json')
    const consoleSpy = vi.spyOn(console, 'log')
    const cwdManifest = resolve(process.cwd(), 'appsscript.json')

    // Clean up any existing CWD manifest before run
    await rm(cwdManifest, { force: true })

    // Simulate missing output.dir and output.file
    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        name: 'a',
        format: 'iife',
        // Both dir and file are missing
      },
      plugins: [gasPlugin({ appsScriptFile: testPath })],
    })

    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('✅ appsscript.json has been copied'))

    // Check if it was copied to CWD
    expect(existsSync(cwdManifest)).toBe(false)

    // Post-test cleanup
    await rm(cwdManifest, { force: true })

    consoleSpy.mockRestore()
  })
})
