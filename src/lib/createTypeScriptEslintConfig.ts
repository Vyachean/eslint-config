import typescriptEslint from 'typescript-eslint';
import type { Linter } from 'eslint';
import { createGlobFileList } from './createGlobFileList';
import { resolveRuleLevel } from './resolveRuleLevel';

export const createTypeScriptEslintConfig = ({
  files,
  parserOptions,
  production,
  transformConfig,
}: {
  files?: string[];
  parserOptions?: Record<string, unknown>;
  production: boolean;
  transformConfig?: (config: Linter.Config) => Linter.Config;
}): Linter.Config[] => {
  const ruleLevel = resolveRuleLevel(production);
  const isTypeAware = parserOptions !== undefined;
  const targetFiles =
    files && files.length > 0 ? files : createGlobFileList({ ts: true });
  const baseConfig = isTypeAware
    ? production
      ? typescriptEslint.configs.strictTypeChecked
      : typescriptEslint.configs.recommendedTypeChecked
    : production
      ? typescriptEslint.configs.strict
      : typescriptEslint.configs.recommended;

  const applyTransform = (config: Linter.Config): Linter.Config =>
    transformConfig ? transformConfig(config) : config;

  const config: Linter.Config[] = [
    ...baseConfig.map((config) => {
      const existingFiles =
        'files' in config && Array.isArray(config.files)
          ? config.files.filter(
              (file): file is string => typeof file === 'string',
            )
          : [];

      return applyTransform({
        ...config,
        files: [...new Set([...existingFiles, ...targetFiles])],
      });
    }),
    applyTransform({
      files: targetFiles,
      ...(parserOptions
        ? {
            languageOptions: {
              parserOptions,
            },
          }
        : {}),
      rules: {
        'no-undef': 'off',
        'no-empty-function': 'off',
        'init-declarations': 'off',
        '@typescript-eslint/no-empty-function': [
          'warn',
          {
            allow: ['overrideMethods'],
          },
        ],
        '@typescript-eslint/init-declarations': 'error',
        '@typescript-eslint/no-unused-vars': ruleLevel,
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'never',
          },
        ],
        ...(isTypeAware
          ? {
              '@typescript-eslint/restrict-template-expressions': [
                ruleLevel,
                {
                  allowNumber: true,
                  allowAny: false,
                  allowBoolean: false,
                  allowNullish: false,
                  allowRegExp: false,
                  allowNever: false,
                },
              ],
            }
          : {}),
      },
    }),
  ];

  if (isTypeAware) {
    config.push(
      applyTransform({
        ...typescriptEslint.configs.disableTypeChecked,
        files: createGlobFileList({ js: true }),
      }),
    );
  }

  return config;
};
