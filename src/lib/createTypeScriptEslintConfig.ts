import typescriptEslint from 'typescript-eslint';
import type { Linter } from 'eslint';
import { createGlobFileList } from './createGlobFileList';
import { resolveRuleLevel } from './resolveRuleLevel';

export const createTypeScriptEslintConfig = ({
  files,
  parserOptions,
  production,
}: {
  files?: string[];
  parserOptions?: Record<string, unknown>;
  production: boolean;
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

  const config: Linter.Config[] = [
    ...baseConfig.map((config) => {
      const existingFiles =
        'files' in config && Array.isArray(config.files)
          ? config.files.filter(
              (file): file is string => typeof file === 'string',
            )
          : [];

      return {
        ...config,
        files: [...new Set([...existingFiles, ...targetFiles])],
      };
    }),
    {
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
        '@typescript-eslint/no-empty-function': [
          'warn',
          {
            allow: ['overrideMethods'],
          },
        ],
        '@typescript-eslint/no-unused-vars': ruleLevel,
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
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
    },
  ];

  if (isTypeAware) {
    config.push({
      ...typescriptEslint.configs.disableTypeChecked,
      files: createGlobFileList({ js: true }),
    });
  }

  return config;
};
