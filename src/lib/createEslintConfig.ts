import { createTypeScriptEslintConfig } from './createTypeScriptEslintConfig';
import { createVueEslintConfig } from './createVueConfig';
import { javaScriptConfig } from './javaScriptConfig';
import type { TSESLint } from '@typescript-eslint/utils';
import { commentsConfig } from './commentsConfig';
import { createPrettierEslintConfig } from './createPrettierEslintConfig';

/**
 * Create configuration
 */
export const createEslintConfig = (
  options: {
    vue?: boolean;
    tsParserOptions?: TSESLint.ParserOptions;
  } = {},
): TSESLint.FlatConfig.ConfigArray => {
  const { tsParserOptions, vue } = options;
  const config: TSESLint.FlatConfig.ConfigArray = [...javaScriptConfig];

  if (tsParserOptions) {
    config.push(...createTypeScriptEslintConfig(tsParserOptions));
  }
  if (vue) {
    config.push(...createVueEslintConfig(tsParserOptions));
  }
  config.push(...commentsConfig, ...createPrettierEslintConfig());

  return config;
};
