import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import type { Linter } from 'eslint';
import { resolveRuleLevel } from './resolveRuleLevel';

export const createCommentsConfig = (production: boolean): Linter.Config[] => {
  const ruleLevel = resolveRuleLevel(production);

  return [
    comments.recommended,
    {
      rules: {
        '@eslint-community/eslint-comments/no-unused-disable': 'warn',
        '@eslint-community/eslint-comments/require-description': ruleLevel,
      },
    },
  ] as const;
};
