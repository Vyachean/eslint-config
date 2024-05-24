import typescriptEslint from 'typescript-eslint';
import { createGlobFileList } from './createGlobFileList.mjs';
import { TSESLint } from "@typescript-eslint/utils"

/**
 * Create configuration for TS
 * @param {string} project -- absolute path to the tsconfig.json file
 * @param {boolean} [includeVue] -- add support for .vue files
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
export const createTypeScriptEslintConfig = (project, includeVue = false) =>
  typescriptEslint.config(typescriptEslint.configs.base, {
    files: createGlobFileList({
      ts: true,
      vue: includeVue,
    }),
    languageOptions: {
      parser: typescriptEslint.parser,
      sourceType: 'module',
      parserOptions: {
        project,
      },
    },
    rules: {
      'no-undef': 'error',
      '@typescript-eslint/array-type': 'error',
    },
  });
