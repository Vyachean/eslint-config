export const GLOB_JS = '?(c|m)js';
export const GLOB_TS = '?(c|m)ts';
export const GLOB_VUE = 'vue';

/**
 * Generate a list of scanned files
 * @param {object} [options]
 * @param {boolean} [options.ts] include .ts files
 * @param {boolean} [options.vue] include .vue files
 * @returns {string[]}
 */
export const createGlobFileList = ({ vue, ts } = {}) => {
  const globFilesList = [GLOB_JS];
  if (ts) {
    globFilesList.push(GLOB_TS);
  }
  if (vue) {
    globFilesList.push(GLOB_VUE);
  }
  const globFiles = `*.${globFilesList.join(',')}`;

  const files = [globFiles, `**/${globFiles}`];

  return files;
};
