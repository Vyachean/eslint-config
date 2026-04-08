import js from '@eslint/js';
import type { Linter } from 'eslint';
import { resolveRuleLevel } from './resolveRuleLevel';

export const createJavaScriptConfig = (
  production: boolean,
): Linter.Config[] => {
  const ruleLevel = resolveRuleLevel(production);

  return [
    js.configs.recommended,
    {
      rules: {
        'no-console': ruleLevel,
        'object-shorthand': ruleLevel,
        'prefer-template': ruleLevel,
        'no-warning-comments': ruleLevel,
      },
    },
  ];
};
