import { readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { build } from 'rolldown'
import { beforeAll, describe, expect, test } from 'vitest'
import gasPlugin from './index'

describe('test', async () => {
  const distPath = resolve(__dirname, './dist')

  beforeAll(() => {
    rmSync(distPath, { force: true, recursive: true })
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

    const outfile = readFileSync(outfilePath, { encoding: 'utf8' })
    expect(outfile).toEqual(`function main1() {}
function main2() {}
function main3() {}
var _ = (function(exports) {


//#region src/fixtures/echo.ts
const echo = (message) => message;
const main3 = () => {
	console.log(echo("hello world."));
};

//#endregion
//#region src/fixtures/main.ts
const plus = (x, y) => x + y;
const minus = (x, y) => x - y;
const main1 = () => {
	console.log(echo(\`1 + 2 = \${plus(1, 2)}\`));
};
const main2 = () => {
	console.log(echo(\`3 - 1 = \${minus(3, 1)}\`));
};

//#endregion
exports.main1 = main1;
exports.main2 = main2;
exports.main3 = main3;
return exports;
})({});
this.main1 = _.main1;
this.main2 = _.main2;
this.main3 = _.main3;`)
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

    const outfile = readFileSync(outfilePath, { encoding: 'utf8' })
    expect(outfile).toEqual(`function main1() {}
function main2() {}
function main3() {}
var a = (function(exports) {


//#region src/fixtures/echo.ts
const echo = (message) => message;
const main3 = () => {
	console.log(echo("hello world."));
};

//#endregion
//#region src/fixtures/main.ts
const plus = (x, y) => x + y;
const minus = (x, y) => x - y;
const main1 = () => {
	console.log(echo(\`1 + 2 = \${plus(1, 2)}\`));
};
const main2 = () => {
	console.log(echo(\`3 - 1 = \${minus(3, 1)}\`));
};

//#endregion
exports.main1 = main1;
exports.main2 = main2;
exports.main3 = main3;
return exports;
})({});
this.main1 = a.main1;
this.main2 = a.main2;
this.main3 = a.main3;`)
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

    const outfile = readFileSync(outfilePath, { encoding: 'utf8' })
    expect(outfile).toEqual(`function main1() {}
function main2() {}
function main3() {}
var _=function(exports){let t=e=>e,n=()=>{console.log(t(\`hello world.\`))},r=(e,t)=>e+t,i=(e,t)=>e-t,a=()=>{console.log(t(\`1 + 2 = \${r(1,2)}\`))},o=()=>{console.log(t(\`3 - 1 = \${i(3,1)}\`))};return exports.main1=a,exports.main2=o,exports.main3=n,exports}({});
this.main1 = _.main1;
this.main2 = _.main2;
this.main3 = _.main3;`)
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

    const outfile = readFileSync(outfilePath, { encoding: 'utf8' })
    expect(outfile).toEqual(`function main1() {}
function main2() {}
function main3() {}
var a=function(exports){let t=e=>e,n=()=>{console.log(t(\`hello world.\`))},r=(e,t)=>e+t,i=(e,t)=>e-t,o=()=>{console.log(t(\`1 + 2 = \${r(1,2)}\`))},s=()=>{console.log(t(\`3 - 1 = \${i(3,1)}\`))};return exports.main1=o,exports.main2=s,exports.main3=n,exports}({});
this.main1 = a.main1;
this.main2 = a.main2;
this.main3 = a.main3;`)
  })
})
