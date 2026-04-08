import type { Linter } from 'eslint';
import {
  createEslintConfig,
  type CreateEslintConfigOptions,
} from './lib/createEslintConfig';
import { createTypeScriptEslintConfig } from './lib/createTypeScriptEslintConfig';

export interface CreateTypeScriptEslintConfigOptions extends CreateEslintConfigOptions {
  tsParserOptions?: Record<string, unknown>;
}

export const config = (
  options: CreateTypeScriptEslintConfigOptions = {},
): Linter.Config[] => {
  const { production: productionOption, strict, tsParserOptions } = options;
  const production = productionOption ?? strict ?? true;

  return [
    ...createEslintConfig({ production }),
    ...createTypeScriptEslintConfig({
      production,
      parserOptions: tsParserOptions,
    }),
  ];
};
