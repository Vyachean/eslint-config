import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import type { TSESLint } from '@typescript-eslint/utils';

export const createPrettierEslintConfig = ({
  vue,
}: {
  vue?: boolean;
}): TSESLint.FlatConfig.ConfigArray => {
  const config: TSESLint.FlatConfig.ConfigArray = [
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
  ];

  if (vue) {
    config.push({
      rules: {
        'vue/html-self-closing': [
          'warn',
          {
            html: {
              void: 'any',
            },
          },
        ],
      },
    });
  }

  return config;
};
