# eslint-config

Строгие flat-конфиги ESLint для JavaScript, TypeScript и Vue 3 с мягким режимом для локальной разработки и более строгим режимом для production.

## Установка

Базовый JavaScript-вариант:

```bash
npm i -D @vyachean/eslint-config eslint
```

Опциональные peer-зависимости ставятся только для нужного стека:

```bash
# TypeScript
npm i -D typescript typescript-eslint

# Vue
npm i -D eslint-plugin-vue vue-eslint-parser

# Vue + TypeScript
npm i -D typescript typescript-eslint eslint-plugin-vue vue-eslint-parser
```

## Использование

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

## Точки входа

- `@vyachean/eslint-config`: JavaScript-конфиг с `eslint` recommended rules, правилами для комментариев, интеграцией с Prettier и поддержкой `.gitignore`.
- `@vyachean/eslint-config/typescript`: базовый JavaScript-конфиг плюс TypeScript-правила. Type-aware правила включаются при передаче `tsParserOptions`.
- `@vyachean/eslint-config/vue`: базовый JavaScript-конфиг плюс Vue 3-правила и совместимость с Prettier для Vue.
- `@vyachean/eslint-config/vue-typescript`: базовый JavaScript-конфиг плюс Vue 3 и TypeScript-правила вместе.

## Опции

Базовые опции для всех entrypoint:

- `production?: boolean` включает более строгий production-режим. По умолчанию `true`.
- `strict?: boolean` пока поддерживается как deprecated alias для `production`.

Дополнительные опции:

- `typescript` и `vue-typescript`: `tsParserOptions?: Record<string, unknown>`

## Рекомендуемые варианты

- JavaScript для локальной разработки: `config({ production: false })`
- JavaScript для production-сборки: `config({ production: true })`
- TypeScript для локальной разработки: `config({ production: false })`
- TypeScript для production-сборки: `config({ production: true, tsParserOptions: { ... } })`
- Vue для локальной разработки: `config({ production: false })`
- Vue для production-сборки: `config({ production: true })`
- Vue + TypeScript для production-сборки: `config({ production: true, tsParserOptions: { ... } })`

Если в проекте есть `.gitignore`, конфиг импортирует из него ignore-паттерны и всегда игнорирует `dist`.
