// @ts-expect-error
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import type { TSESLint } from '@typescript-eslint/utils';

export const commentsConfig: TSESLint.FlatConfig.ConfigArray = [
  comments.recommended,
  {
    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'warn',
      '@eslint-community/eslint-comments/require-description':
        process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
    },
  },
];
