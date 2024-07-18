import type { TSESLint } from '@typescript-eslint/utils';

export const javaScriptConfig: TSESLint.FlatConfig.ConfigArray = [
  {
    rules: {
      'no-console': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'no-warning-comments': 'warn',
    },
  },
];
