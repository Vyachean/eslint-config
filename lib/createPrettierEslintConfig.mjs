import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export const createPrettierEslintConfig = () => [
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
