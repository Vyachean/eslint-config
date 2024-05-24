# eslint-config

Строгая конфигурация ESLinter для Vue проектов c Typescript.

## Установка

```bash
npm i -D @vyachean/eslint-config eslint
```

## Использование

```mjs
// eslint.config.mjs

import { config } from '@vyachean/eslint-config';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// для добавлении поддержки TS указываем путь к файлу tsconfig.json
const tsConfigPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  './tsconfig.json',
);

export default [
  ...config({
    tsConfigPath,
    vue: true, // для поддержки vue файлов
  })
  // определение правил
]

```