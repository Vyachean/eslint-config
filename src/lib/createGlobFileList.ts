export const GLOB_JS = '?(c|m)js';
export const GLOB_TS = '?(c|m)ts';
export const GLOB_VUE = 'vue';

/**
 * Generate a list of scanned files
 */
export const createGlobFileList = ({
  vue,
  ts,
  js,
}: {
  vue?: boolean;
  ts?: boolean;
  js?: boolean;
} = {}): string[] => {
  const globFilesList = [];
  if (js) {
    globFilesList.push(GLOB_JS);
  }
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
