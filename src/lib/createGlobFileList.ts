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
  const globFilesList: string[] = [];
  if (js) {
    globFilesList.push(GLOB_JS);
  }
  if (ts) {
    globFilesList.push(GLOB_TS);
  }
  if (vue) {
    globFilesList.push(GLOB_VUE);
  }

  if (globFilesList.length === 0) {
    return [];
  }

  const extensionGroup =
    globFilesList.length === 1
      ? globFilesList[0]
      : `{${globFilesList.join(',')}}`;
  const globFiles = `*.${extensionGroup}`;

  const files = [globFiles, `**/${globFiles}`];

  return files;
};
