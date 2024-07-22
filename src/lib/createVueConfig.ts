import type { TSESLint } from '@typescript-eslint/utils';
import typescriptEslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';
// @ts-expect-error -- eslint-plugin-vue is missing typing
import eslintPluginVue from 'eslint-plugin-vue';
import { createGlobFileList } from './createGlobFileList';

/**
 * Create configuration for vue
 */
export const createVueEslintConfig = (
  tsParserOptions?: TSESLint.ParserOptions,
): TSESLint.FlatConfig.ConfigArray => {
  const files = createGlobFileList({ vue: true });

  const configParserWithTS = tsParserOptions
    ? [
        {
          files,
          languageOptions: {
            parser: vueEslintParser,
            sourceType: 'module',
            parserOptions: {
              parser: typescriptEslint.parser,
              extraFileExtensions: ['.vue'],
              ...tsParserOptions,
            },
          },
        },
        {
          rules: {
            // [no-unsafe-*] doesn't work with vue files https://github.com/vuejs/vue-eslint-parser/issues/104
            '@typescript-eslint/no-unsafe-argument': 'off',
          },
        },
      ]
    : [];

  const config: TSESLint.FlatConfig.ConfigArray = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- eslint-plugin-vue is missing typing
    ...eslintPluginVue.configs['flat/recommended'],
    ...configParserWithTS,
    {
      rules: {
        'vue/max-attributes-per-line': 'error',
        'vue/no-unused-components':
          process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
        'vue/require-default-prop': 0,
        'vue/block-lang': [
          'error',
          {
            script: {
              lang: 'ts',
            },
          },
        ],
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
        'vue/component-options-name-casing': ['warn', 'PascalCase'],
        'vue/custom-event-name-casing': ['warn', 'camelCase'],
        'vue/html-button-has-type': ['error'],
        'vue/html-comment-content-newline': ['warn'],
        'vue/html-comment-content-spacing': ['warn'],
        'vue/html-comment-indent': ['warn', 2],
        'vue/match-component-file-name': [
          'error',
          {
            extensions: ['jsx', 'tsx', 'vue'],
            shouldMatchCase: true,
          },
        ],
        'vue/match-component-import-name': 'error',
        'vue/max-lines-per-block': [
          'warn',
          {
            template: 300,
            script: 300,
            skipBlankLines: true,
          },
        ],
        'vue/new-line-between-multi-line-property': 'warn',
        'vue/next-tick-style': 'error',
        'vue/no-boolean-default': ['error', 'default-false'],
        'vue/no-deprecated-model-definition': 'error',
        'vue/no-duplicate-attr-inheritance': 'error',
        'vue/no-empty-component-block': 'warn',
        'vue/no-multiple-objects-in-class': 'warn',
        'vue/no-ref-object-reactivity-loss': 'warn', // сменить на error
        'vue/no-root-v-if': 'error',
        'vue/no-setup-props-reactivity-loss': 'error',
        'vue/no-static-inline-styles': 'error',
        'vue/no-template-target-blank': 'warn',
        'vue/no-undef-components': ['error'],
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-unused-properties': [
          process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
          {
            groups: ['props', 'setup'],
          },
        ],
        'vue/no-unused-refs': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-text': 'error',
        'vue/padding-line-between-blocks': 'warn',
        'vue/padding-line-between-tags': 'warn',
        'vue/padding-lines-in-component-definition': 'warn',
        'vue/prefer-prop-type-boolean-first': 'warn',
        'vue/prefer-separate-static-class': 'warn',
        'vue/prefer-true-attribute-shorthand': 'warn',
        'vue/require-emit-validator': 'error',
        // 'vue/require-prop-comment': [
        //   'warn',
        //   {
        //     type: 'JSDoc',
        //   },
        // ],
        'vue/require-typed-object-prop': 'error',
        'vue/require-typed-ref': 'error',
        'vue/script-indent': 'off',
        'vue/v-for-delimiter-style': 'warn',
        'vue/multi-word-component-names': 'warn',
        'vue/no-unused-vars':
          process.env.NODE_ENV !== 'production' ? 'warn' : 'error',

        // Extension Rules
        'vue/array-bracket-newline': 'warn',
        'vue/array-bracket-spacing': 'warn',
        'vue/array-element-newline': 'off', // conflict prettier
        'vue/arrow-spacing': 'warn',
        'vue/block-spacing': 'warn',
        'vue/brace-style': 'warn',
        'vue/camelcase': 'warn',
        'vue/comma-dangle': 'off', // conflict prettier
        'vue/comma-spacing': 'warn',
        'vue/comma-style': 'warn',
        'vue/dot-location': 'warn',
        'vue/dot-notation': 'warn',
        'vue/eqeqeq': 'warn',
        'vue/func-call-spacing': 'warn',
        'vue/key-spacing': 'warn',
        'vue/keyword-spacing': 'warn',
        'vue/multiline-ternary': 'off', // conflict prettier
        'vue/no-console': 'error',
        'vue/no-constant-condition': 'warn',
        'vue/no-empty-pattern': 'error',
        'vue/no-extra-parens': 'warn',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': 'warn',
        'vue/no-sparse-arrays': 'warn',
        'vue/no-useless-concat': 'warn',
        'vue/object-curly-newline': 'warn',
        'vue/object-curly-spacing': 'off', // conflict prettier
        'vue/object-property-newline': 'off', // conflict prettier
        'vue/object-shorthand': 'warn',
        'vue/operator-linebreak': 'warn',
        'vue/prefer-template': 'warn',
        'vue/quote-props': 'off', // conflict prettier
        'vue/space-in-parens': 'warn',
        'vue/space-infix-ops': 'warn',
        'vue/space-unary-ops': 'warn',
        'vue/template-curly-spacing': 'warn',

        // rules has not been released yet
        'vue/require-explicit-slots':
          process.env.NODE_ENV !== 'production' ? 'warn' : 'error',
      },
    },
  ] as const;

  config.forEach(({ languageOptions }) => {
    if (
      languageOptions &&
      'parser' in languageOptions &&
      languageOptions.parser === undefined
    ) {
      delete languageOptions.parser;
    }
  });

  return config;
};
