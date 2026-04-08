import typescriptEslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';
import eslintPluginVue from 'eslint-plugin-vue';
import { createGlobFileList } from './createGlobFileList';
import type { Linter } from 'eslint';
import { resolveRuleLevel } from './resolveRuleLevel';
import { createVueTypeScriptParserOptions } from './createVueTypeScriptParserOptions';

export const createVueEslintConfig = ({
  production,
  ts,
  tsParserOptions,
}: {
  production: boolean;
  ts: boolean;
  tsParserOptions?: Record<string, unknown>;
}): Linter.Config[] => {
  const files = createGlobFileList({ vue: true });
  const ruleLevel = resolveRuleLevel(production);

  const config: Linter.Config[] = [
    ...(production
      ? eslintPluginVue.configs['flat/recommended']
      : eslintPluginVue.configs['flat/strongly-recommended']),
  ];

  if (ts) {
    config.push({
      files,
      languageOptions: {
        parser: vueEslintParser,
        sourceType: 'module',
        parserOptions: {
          parser: typescriptEslint.parser,
          ...createVueTypeScriptParserOptions(tsParserOptions),
        },
      },
    });
  }

  config.push({
    files,
    rules: {
      'vue/require-explicit-emits': ruleLevel,
      'vue/v-on-event-hyphenation': [ruleLevel, 'always', { autofix: true }],
      'vue/no-unused-components': ruleLevel,
      'vue/no-required-prop-with-default': ruleLevel,
      'vue/no-v-html': ruleLevel,
      'vue/require-default-prop': 0,
      ...(ts
        ? {
            'vue/block-lang': [
              'error',
              {
                script: {
                  lang: 'ts',
                },
              },
            ],
          }
        : {}),
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
      'vue/max-attributes-per-line': 'off',
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
      'vue/no-ref-object-reactivity-loss': ruleLevel,
      'vue/no-root-v-if': 'error',
      'vue/no-setup-props-reactivity-loss': 'error',
      'vue/no-static-inline-styles': 'error',
      'vue/no-template-target-blank': 'warn',
      'vue/no-undef-components': ['error'],
      'vue/no-unused-emit-declarations': 'error',
      'vue/no-unused-properties': [
        ruleLevel,
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
      'vue/prefer-define-options': ruleLevel,
      'vue/prefer-prop-type-boolean-first': 'warn',
      'vue/prefer-separate-static-class': 'warn',
      'vue/prefer-true-attribute-shorthand': 'warn',
      'vue/prefer-use-template-ref': ruleLevel,
      'vue/require-emit-validator': 'error',
      'vue/this-in-template': ruleLevel,
      'vue/require-expose': ruleLevel,
      ...(ts
        ? {
            'vue/require-typed-object-prop': 'error',
            'vue/require-typed-ref': 'error',
          }
        : {}),
      'vue/no-import-compiler-macros': 'error',
      'vue/v-for-delimiter-style': 'warn',
      'vue/multi-word-component-names': 'warn',
      'vue/no-unused-vars': ruleLevel,

      // Keep Vue rules focused on correctness and best practices.
      // Formatting-related rules are delegated to Prettier.
      'vue/camelcase': 'warn',
      'vue/dot-notation': 'warn',
      'vue/eqeqeq': 'warn',
      'vue/no-console': 'error',
      'vue/no-constant-condition': 'warn',
      'vue/no-empty-pattern': 'error',
      'vue/no-irregular-whitespace': 'error',
      'vue/no-loss-of-precision': 'error',
      'vue/no-restricted-syntax': 'warn',
      'vue/no-sparse-arrays': 'warn',
      'vue/no-useless-concat': 'warn',
      'vue/object-shorthand': 'warn',
      'vue/prefer-template': 'warn',
      'vue/require-explicit-slots': ruleLevel,
      'vue/v-bind-style': ['warn', 'shorthand', { sameNameShorthand: 'never' }],
    },
  });

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
