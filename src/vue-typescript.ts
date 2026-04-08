import type { Linter } from 'eslint';
import {
  createEslintConfig,
  type CreateEslintConfigOptions,
} from './lib/createEslintConfig';
import { createTypeScriptEslintConfig } from './lib/createTypeScriptEslintConfig';
import { createPrettierEslintConfig } from './lib/createPrettierEslintConfig';
import { createVueEslintConfig } from './lib/createVueConfig';
import { createGlobFileList } from './lib/createGlobFileList';
import typescriptEslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';
import { createVueTypeScriptParserOptions } from './lib/createVueTypeScriptParserOptions';

export interface CreateVueTypeScriptEslintConfigOptions extends CreateEslintConfigOptions {
  tsParserOptions?: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

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
      }),
      production,
      parserOptions: tsParserOptions,
    }),
    ...createTypeScriptEslintConfig({
      files: createGlobFileList({
        vue: true,
      }),
      production,
      parserOptions: createVueTypeScriptParserOptions(tsParserOptions),
      transformConfig: (config) => {
        const existingLanguageOptions = config.languageOptions ?? {};
        const parser =
          'parser' in existingLanguageOptions &&
          existingLanguageOptions.parser !== undefined
            ? existingLanguageOptions.parser
            : typescriptEslint.parser;
        const existingParserOptions =
          'parserOptions' in existingLanguageOptions &&
          isRecord(existingLanguageOptions.parserOptions)
            ? existingLanguageOptions.parserOptions
            : {};

        return {
          ...config,
          languageOptions: {
            ...existingLanguageOptions,
            parser: vueEslintParser,
            sourceType: 'module',
            parserOptions: createVueTypeScriptParserOptions({
              ...existingParserOptions,
              ...tsParserOptions,
              parser,
            }),
          },
        };
      },
    }),
    ...createVueEslintConfig({
      production,
      ts: true,
      tsParserOptions,
    }),
    ...createPrettierEslintConfig({ includeBase: false, vue: true }),
  ];
};
