import { config } from './dist/index.js';

export default [
  ...config({
    tsParserOptions: {
      EXPERIMENTAL_useProjectService: true,
    },
  }),
];
