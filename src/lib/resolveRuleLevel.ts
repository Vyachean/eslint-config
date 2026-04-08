export const resolveRuleLevel = (production: boolean): 'error' | 'warn' =>
  production ? 'error' : 'warn';
