# eslint-config

Strict ESLint flat configs for JavaScript, TypeScript, and Vue 3 with a relaxed development mode and a stricter production mode.

## Installation

Base JavaScript setup:

```bash
npm i -D @vyachean/eslint-config eslint
```

Add the optional peer dependencies only for the stack you use:

```bash
# TypeScript
npm i -D typescript typescript-eslint

# Vue
npm i -D eslint-plugin-vue vue-eslint-parser

# Vue + TypeScript
npm i -D typescript typescript-eslint eslint-plugin-vue vue-eslint-parser
```

## Usage

### JavaScript

```mjs
// eslint.config.mjs
import { config } from '@vyachean/eslint-config';

export default [
  ...config({
    production: process.env.NODE_ENV === 'production',
  }),
];
```

### TypeScript

```mjs
// eslint.config.mjs
import { config } from '@vyachean/eslint-config/typescript';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default [
  ...config({
    production: process.env.NODE_ENV === 'production',
    tsParserOptions: {
      projectService: true,
      tsconfigRootDir: currentDirectory,
    },
  }),
];
```

### Vue

```mjs
// eslint.config.mjs
import { config } from '@vyachean/eslint-config/vue';

export default [
  ...config({
    production: process.env.NODE_ENV === 'production',
  }),
];
```

### Vue + TypeScript

```mjs
// eslint.config.mjs
import { config } from '@vyachean/eslint-config/vue-typescript';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default [
  ...config({
    production: process.env.NODE_ENV === 'production',
    tsParserOptions: {
      projectService: true,
      tsconfigRootDir: currentDirectory,
    },
  }),
];
```

## Entry points

- `@vyachean/eslint-config`: JavaScript config with ESLint recommended rules, comment rules, Prettier integration, and `.gitignore` support.
- `@vyachean/eslint-config/typescript`: JavaScript base config plus TypeScript rules. Type-aware rules are enabled when `tsParserOptions` is provided.
- `@vyachean/eslint-config/vue`: JavaScript base config plus Vue 3 rules and Vue-specific Prettier compatibility.
- `@vyachean/eslint-config/vue-typescript`: JavaScript base config plus Vue 3 and TypeScript rules together.

Prettier integration uses `singleQuote: true`.

## Options

Base options for all entry points:

- `production?: boolean` enables stricter production severity. Defaults to `true`.
- `strict?: boolean` is still supported as a deprecated alias for `production`.

Additional options:

- `typescript` and `vue-typescript`: `tsParserOptions?: Record<string, unknown>`

## Recommended setup

- JavaScript local development: `config({ production: false })`
- JavaScript production builds: `config({ production: true })`
- TypeScript local development: `config({ production: false })`
- TypeScript production builds: `config({ production: true, tsParserOptions: { ... } })`
- Vue local development: `config({ production: false })`
- Vue production builds: `config({ production: true })`
- Vue + TypeScript production builds: `config({ production: true, tsParserOptions: { ... } })`

The config imports ignore patterns from the current project's `.gitignore` when that file exists and always ignores `dist`.

## Project checks

For this repository itself:

```bash
pnpm typecheck
pnpm lint
pnpm check
```
