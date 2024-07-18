# eslint-config

Strict ESLint configuration for Vue projects with TypeScript.

## Installation

```bash
npm i -D @vyachean/eslint-config eslint
```

## Usage

```mjs
// eslint.config.mjs

import { config } from '@vyachean/eslint-config';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// to add TS support, specify the path to the tsconfig.json file
const tsConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  './tsconfig.json',
);

export default [
  ...config({
    // parserOptions for ts
    tsParserOptions: {
      project: tsConfigPath,

      // recommended for ts files, but doesn't work with vue yet
      EXPERIMENTAL_useProjectService: true,
    },
    vue: true, // to support vue files
  })
  // define rules
]

```