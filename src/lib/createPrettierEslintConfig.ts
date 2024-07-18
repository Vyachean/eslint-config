import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import type { TSESLint } from '@typescript-eslint/utils';

export const createPrettierEslintConfig = (): TSESLint.FlatConfig.ConfigArray =>
  [
    eslintPluginPrettierRecommended,
    {
      rules: {
        'prettier/prettier': [
          'warn',
          {
            singleQuote: true,
          },
        ],
      },
    },
  ] as const;
