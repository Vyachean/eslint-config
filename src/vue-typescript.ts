import type { Linter } from 'eslint';
import { createEslintConfig, type CreateEslintConfigOptions } from './lib/createEslintConfig';
import { createTypeScriptEslintConfig } from './lib/createTypeScriptEslintConfig';
import { createPrettierEslintConfig } from './lib/createPrettierEslintConfig';
import { createVueEslintConfig } from './lib/createVueConfig';
import { createGlobFileList } from './lib/createGlobFileList';

export interface CreateVueTypeScriptEslintConfigOptions
  extends CreateEslintConfigOptions {
  tsParserOptions?: Record<string, unknown>;
}

export const config = (
  options: CreateVueTypeScriptEslintConfigOptions = {},
): Linter.Config[] => {
  const { production: productionOption, strict, tsParserOptions } = options;
  const production = productionOption ?? strict ?? true;

  return [
    ...createEslintConfig({ production }),
    ...createTypeScriptEslintConfig({
      files: createGlobFileList({
        ts: true,
        vue: true,
      }),
      production,
      parserOptions: tsParserOptions,
    }),
    ...createVueEslintConfig({
      production,
      ts: true,
      tsParserOptions,
    }),
    ...createPrettierEslintConfig({ includeBase: false, vue: true }),
  ];
};
