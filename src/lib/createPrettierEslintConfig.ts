import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import type { Linter } from 'eslint';
import { createGlobFileList } from './createGlobFileList';

export const createPrettierEslintConfig = ({
  includeBase = true,
  vue,
}: {
  includeBase?: boolean;
  vue?: boolean;
} = {}): Linter.Config[] => {
  const config: Linter.Config[] = [];

  if (includeBase) {
    config.push(
      eslintPluginPrettierRecommended,
      {
        rules: {
          'prettier/prettier': 'warn',
        },
      },
    );
  }

  if (vue) {
    config.push({
      files: createGlobFileList({ vue: true }),
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
