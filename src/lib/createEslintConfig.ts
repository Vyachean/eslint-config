import { includeIgnoreFile } from '@eslint/compat';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createJavaScriptConfig } from './javaScriptConfig';
import type { Linter } from 'eslint';
import { createCommentsConfig } from './commentsConfig';
import { createPrettierEslintConfig } from './createPrettierEslintConfig';

const createIgnoreConfig = (): Linter.Config[] => {
  const gitignorePath = resolve(process.cwd(), '.gitignore');
  const ignoreConfig: Linter.Config[] = [
    {
      ignores: ['**/dist/**'],
    },
  ];

  if (existsSync(gitignorePath)) {
    ignoreConfig.unshift(
      includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    );
  }

  return ignoreConfig;
};

export interface CreateEslintConfigOptions {
  production?: boolean;
  /**
   * @deprecated Use `production` instead.
   */
  strict?: boolean;
}

export const createEslintConfig = (
  options: CreateEslintConfigOptions = {},
): Linter.Config[] => {
  const { production: productionOption, strict } = options;
  const production = productionOption ?? strict ?? true;
  const config: Linter.Config[] = [
    ...createIgnoreConfig(),
    ...createJavaScriptConfig(production),
    ...createCommentsConfig(production),
    ...createPrettierEslintConfig(),
  ];

  return config;
};
