import typescriptEslint from 'typescript-eslint';
import { TSESLint } from '@typescript-eslint/utils';
import { createGlobFileList } from './createGlobFileList.mjs';

/**
 * Create configuration for TS
 * @param {string} project -- absolute path to the tsconfig.json file
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
export const createTypeScriptEslintConfig = (project) =>
  typescriptEslint.config(
    ...typescriptEslint.configs.strictTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project,
        },
      },
      rules: {
        'no-undef': 'off',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': [
          'warn',
          {
            allow: ['overrideMethods'],
          },
        ],
        '@typescript-eslint/no-unused-vars':
          process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/consistent-type-imports': 'warn',
      },
    },
    {
      ...typescriptEslint.configs.disableTypeChecked,
      files: createGlobFileList({
        js: true,
      }),
    },
  );
