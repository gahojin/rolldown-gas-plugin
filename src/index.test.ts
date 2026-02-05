import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'rolldown'
import { beforeAll, describe, expect, test } from 'vitest'
import gasPlugin from './index'

describe('test', async () => {
  const distPath = resolve(__dirname, './dist')

  beforeAll(async () => {
    await rm(distPath, { force: true, recursive: true })
  })

  test('minify:false', async () => {
    const outfilePath = resolve(distPath, 'test1.js')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        format: 'iife',
        file: outfilePath,
        minify: false,
      },
      plugins: [gasPlugin()],
    })

    const outfile = await readFile(outfilePath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('minify:false with name=a', async () => {
    const outfilePath = resolve(distPath, 'test1.js')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        name: 'a',
        format: 'iife',
        file: outfilePath,
        minify: false,
      },
      plugins: [gasPlugin()],
    })

    const outfile = await readFile(outfilePath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('minify:true', async () => {
    const outfilePath = resolve(distPath, 'test2.js')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        format: 'iife',
        file: outfilePath,
        minify: true,
      },
      plugins: [gasPlugin()],
    })

    const outfile = await readFile(outfilePath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('minify:true with name=a', async () => {
    const outfilePath = resolve(distPath, 'test2.js')

    await build({
      input: resolve(__dirname, './fixtures/main.ts'),
      output: {
        name: 'a',
        format: 'iife',
        file: outfilePath,
        minify: true,
      },
      plugins: [gasPlugin()],
    })

    const outfile = await readFile(outfilePath, { encoding: 'utf8' })
    expect(outfile).toMatchSnapshot()
  })

  test('appsscript.json copy', async () => {
    const testPath = resolve(__dirname, 'dummy_appsscript.json')
    const outfilePath = resolve(distPath, 'test2.js')
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
})
