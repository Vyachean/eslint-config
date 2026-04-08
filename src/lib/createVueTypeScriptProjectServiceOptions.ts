const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const createVueTypeScriptProjectServiceOptions = (
  parserOptions?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  if (!parserOptions) {
    return parserOptions;
  }

  const projectService = parserOptions.projectService;

  if (projectService === undefined || projectService === false) {
    return parserOptions;
  }

  if (projectService === true) {
    return {
      ...parserOptions,
      projectService: {
        loadTypeScriptPlugins: true,
      },
    };
  }

  if (!isRecord(projectService)) {
    return parserOptions;
  }

  return {
    ...parserOptions,
    projectService: {
      loadTypeScriptPlugins: true,
      ...projectService,
    },
  };
};
