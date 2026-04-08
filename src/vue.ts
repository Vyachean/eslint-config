import type { Linter } from 'eslint';
import {
  createEslintConfig,
  type CreateEslintConfigOptions,
} from './lib/createEslintConfig';
import { createPrettierEslintConfig } from './lib/createPrettierEslintConfig';
import { createVueEslintConfig } from './lib/createVueConfig';

export type CreateVueEslintConfigOptions = CreateEslintConfigOptions;

export const config = (
  options: CreateVueEslintConfigOptions = {},
): Linter.Config[] => {
  const { production: productionOption, strict } = options;
  const production = productionOption ?? strict ?? true;

  return [
    ...createEslintConfig({ production }),
    ...createVueEslintConfig({
      production,
      ts: false,
    }),
    ...createPrettierEslintConfig({ includeBase: false, vue: true }),
  ];
};
