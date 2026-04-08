export const createVueTypeScriptParserOptions = (
  parserOptions: Record<string, unknown> = {},
): Record<string, unknown> => {
  const extraFileExtensions = Array.isArray(parserOptions.extraFileExtensions)
    ? parserOptions.extraFileExtensions.filter(
        (extension): extension is string => typeof extension === 'string',
      )
    : [];

  return {
    ...parserOptions,
    extraFileExtensions: [...new Set([...extraFileExtensions, '.vue'])],
  };
};
