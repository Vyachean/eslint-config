import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';

export const commentsConfig = [
  comments.recommended,
  {
    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'warn',
      '@eslint-community/eslint-comments/require-description':
        process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
    },
  },
];
