import typescriptEslint from 'typescript-eslint';
import type { TSESLint } from '@typescript-eslint/utils';
import { createGlobFileList } from './createGlobFileList';

/**
 * Create configuration for TS
 */
export const createTypeScriptEslintConfig = (
  parserOptions?: TSESLint.ParserOptions,
): TSESLint.FlatConfig.Config[] => [
  ...typescriptEslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions,
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
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowRegExp: false,
          allowNever: false,
        },
      ],
    },
  },
  {
    ...typescriptEslint.configs.disableTypeChecked,
    files: createGlobFileList({
      js: true,
    }),
  },
];
