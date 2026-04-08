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
    config.push(eslintPluginPrettierRecommended, {
      rules: {
        'prettier/prettier': ['warn', { singleQuote: true }],
      },
    });
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
        // Formatting-only Vue rules are disabled here because Prettier owns template layout.
        'vue/html-closing-bracket-newline': 'off',
        'vue/html-closing-bracket-spacing': 'off',
        'vue/html-comment-content-newline': 'off',
        'vue/html-comment-content-spacing': 'off',
        'vue/html-comment-indent': 'off',
        'vue/html-indent': 'off',
        'vue/html-quotes': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/mustache-interpolation-spacing': 'off',
        'vue/no-multi-spaces': 'off',
        'vue/no-spaces-around-equal-signs-in-attribute': 'off',
        'vue/padding-line-between-tags': 'off',
        'vue/padding-lines-in-component-definition': 'off',
        'vue/singleline-html-element-content-newline': 'off',
      },
    });
  }

  return config;
};
