import { createTypeScriptEslintConfig } from './createTypeScriptEslintConfig.mjs';
import { createVueEslintConfig } from './createVueConfig.mjs';
import { javaScriptConfig } from './javaScriptConfig.mjs';
import { TSESLint } from '@typescript-eslint/utils';
import { commentsConfig } from './commentsConfig.mjs';
import { createPrettierEslintConfig } from './createPrettierEslintConfig.mjs';

/**
 * Create configuration
 * @param {object} options linter selection options
 * @param {boolean} [options.vue] enable support for .vue files
 * @param {string} [options.tsConfigPath] absolute path to tsconfig.json for TS support
 * @returns {TSESLint.FlatConfig.ConfigArray}
 */
export const createEslintConfig = (options = {}) => {
  const { tsConfigPath, vue } = options;
  const includeTs = typeof tsConfigPath === 'string';
  const config = [...javaScriptConfig];

  if (includeTs) {
    config.push(...createTypeScriptEslintConfig(tsConfigPath, vue));
  }
  if (vue) {
    config.push(...createVueEslintConfig(tsConfigPath));
  }
  config.push(...commentsConfig, ...createPrettierEslintConfig());

  return config;
};
