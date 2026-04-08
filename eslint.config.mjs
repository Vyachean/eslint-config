import { config } from './dist/typescript.js';
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
  {
    files: ['eslint.config.mjs', 'test/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
];
