import { TSESLint } from "@typescript-eslint/utils"
import typescriptEslint from 'typescript-eslint';
import { createGlobFileList } from './createGlobFileList.mjs';
import eslintPluginVue from 'eslint-plugin-vue';
import vueEslintParser from 'vue-eslint-parser';

/**
 * Create configuration for vue
 * @param {string} [project] absolute path to the tsconfig.json file
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
export const createVueEslintConfig = (project) => {
  const includeTs = typeof project === 'string';
  const languageOptions = includeTs
    ? {
      parser: vueEslintParser,
      sourceType: 'module',
      parserOptions: {
        parser: typescriptEslint.parser,
        project,
        extraFileExtensions: ['.vue'],
      },
    }
    : undefined;
  return typescriptEslint.config({
    files: createGlobFileList({
      vue: true,
      ts: includeTs,
    }),
    plugins: {
      vue: eslintPluginVue,
    },
    languageOptions,
    rules: {
      'vue/max-attributes-per-line': 'error',
    },
  });
};
