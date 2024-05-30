import typescriptEslint from 'typescript-eslint';
import { TSESLint } from '@typescript-eslint/utils';

/**
 * Create configuration for TS
 * @param {string} project -- absolute path to the tsconfig.json file
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
export const createTypeScriptEslintConfig = (project) =>
  typescriptEslint.config(...typescriptEslint.configs.strictTypeChecked, {
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
      // '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  });
