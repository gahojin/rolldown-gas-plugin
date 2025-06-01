# rolldown-gas-plugin

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40gahojin-inc%2Frolldown-gas-plugin?activeTab=versions)](https://www.npmjs.com/package/@gahojin-inc/rolldown-gas-plugin)

rolldown plugin for Google Apps Script.

This is inspired by [esbuild-gas-plugin](https://github.com/mahaker/esbuild-gas-plugin).

## インストール

```
npm install -D @gahojin-inc/rolldown-gas-plugin
// or
yarn add -D @gahojin-inc/rolldown-gas-plugin
// or
pnpm add -D @gahojin-inc/rolldown-gas-plugin
```

## 使い方

```
// rolldown.config.ts
import { defineConfig } from 'rolldown'
import gasPlugin from '@gahojin-inc/rolldown-gas-plugin'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'iife',
        name: '_',
        entryFileNames: '[name].js',
        minify: false,
      },
    ],
    plugins: [gasPlugin()],
  },
])
```

## ライセンス

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

```
Copyright 2025, GAHOJIN, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
