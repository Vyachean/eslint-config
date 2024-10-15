import { config } from './dist/index.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default [
  ...config({
    tsParserOptions: {
      projectService: true,
      tsconfigRootDir: currentDirectory,
    },
  }),
];
