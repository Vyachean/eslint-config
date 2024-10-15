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
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default [
  ...config({
    // parserOptions for ts
    tsParserOptions: {
      projectService: true,
      tsconfigRootDir: currentDirectory,
    },
    vue: true, // to support vue files
  })
  // define rules
]

```