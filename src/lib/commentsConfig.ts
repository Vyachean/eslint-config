// @ts-expect-error -- eslint-plugin-eslint-comments is missing typing
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import type { TSESLint } from '@typescript-eslint/utils';

export const commentsConfig: TSESLint.FlatConfig.ConfigArray = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- eslint-plugin-eslint-comments is missing typing
  comments.recommended,
  {
    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'warn',
      '@eslint-community/eslint-comments/require-description':
        process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
    },
  },
] as const;
