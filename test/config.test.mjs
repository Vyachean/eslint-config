import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ESLint } = require('eslint');
const { config: jsConfig, createGlobFileList } = require('../dist/index.js');
const { config: typeScriptConfig } = require('../dist/typescript.js');
const { config: vueConfig } = require('../dist/vue.js');
const { config: vueTypeScriptConfig } = require('../dist/vue-typescript.js');

const createProject = async (files) => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-config-'));

  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      const filePath = join(cwd, relativePath);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    }),
  );

  return cwd;
};

const lintPaths = async ({ cwd, filePaths, options, configFactory = jsConfig }) => {
  const eslint = new ESLint({
    cwd,
    overrideConfigFile: true,
    overrideConfig: configFactory(options),
  });

  return eslint.lintFiles(filePaths.map((filePath) => join(cwd, filePath)));
};

const lintFile = async ({ cwd, filePath, options, configFactory }) => {
  const [result] = await lintPaths({
    cwd,
    filePaths: [filePath],
    options,
    configFactory,
  });

  return result.messages;
};

const findRule = (messages, ruleId) =>
  messages.find((message) => message.ruleId === ruleId);

test('creates valid glob patterns for combined file groups', () => {
  assert.deepEqual(createGlobFileList(), []);
  assert.deepEqual(createGlobFileList({ ts: true }), [
    '*.?(c|m)ts',
    '**/*.?(c|m)ts',
  ]);
  assert.deepEqual(createGlobFileList({ js: true, ts: true }), [
    '*.{?(c|m)js,?(c|m)ts}',
    '**/*.{?(c|m)js,?(c|m)ts}',
  ]);
});

test('supports javascript-only loose mode', async (t) => {
  const cwd = await createProject({
    'index.js': "console.log('hello');\n",
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.js',
    options: { production: false },
  });

  assert.equal(findRule(messages, 'no-console')?.severity, 1);
});

test('supports javascript-only production mode for production builds', async (t) => {
  const cwd = await createProject({
    'index.js': "console.log('hello');\n",
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.js',
    options: { production: true },
  });

  assert.equal(findRule(messages, 'no-console')?.severity, 2);
});

test('includes eslint recommended rules for javascript', async (t) => {
  const cwd = await createProject({
    'index.js': 'function demo() {\n  return missingValue;\n}\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.js',
    options: { production: true },
  });

  assert.equal(findRule(messages, 'no-undef')?.severity, 2);
});

test('does not force a custom prettier quote style', async (t) => {
  const cwd = await createProject({
    'index.js': 'const message = "hello";\nexport { message };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.js',
    options: { production: true },
  });

  assert.equal(findRule(messages, 'prettier/prettier'), undefined);
});

test('supports typescript without type-aware parser options', async (t) => {
  const cwd = await createProject({
    'index.ts': 'const value: any = 1;\nexport { value };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.ts',
    options: { production: false },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/no-explicit-any')?.severity,
    1,
  );
  assert.equal(
    findRule(messages, '@typescript-eslint/restrict-template-expressions'),
    undefined,
  );
});

test('supports type-aware typescript rules', async (t) => {
  const cwd = await createProject({
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          strict: true,
        },
        include: ['**/*.ts'],
      },
      null,
      2,
    ),
    'index.ts':
      'const flag = true;\nconst label = `${flag}`;\nexport { label };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.ts',
    options: {
      production: true,
      tsParserOptions: {
        projectService: true,
        tsconfigRootDir: cwd,
      },
    },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/restrict-template-expressions')
      ?.severity,
    2,
  );
  assert.equal(
    findRule(messages, '@typescript-eslint/no-explicit-any'),
    undefined,
  );
});

test('supports type-aware typescript rules in relaxed mode', async (t) => {
  const cwd = await createProject({
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          strict: true,
        },
        include: ['**/*.ts'],
      },
      null,
      2,
    ),
    'index.ts':
      'const flag = true;\nconst label = `${flag}`;\nexport { label };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.ts',
    options: {
      production: false,
      tsParserOptions: {
        projectService: true,
        tsconfigRootDir: cwd,
      },
    },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/restrict-template-expressions')
      ?.severity,
    1,
  );
});

test('requires initializing typed variables in typescript', async (t) => {
  const cwd = await createProject({
    'index.ts': 'let result: string;\nresult = "done";\nexport { result };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.ts',
    options: { production: true },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/init-declarations')?.severity,
    2,
  );
  assert.equal(findRule(messages, 'init-declarations'), undefined);
});

test('forbids type assertions in typescript', async (t) => {
  const cwd = await createProject({
    'index.ts': 'const value = "hello" as string;\nexport { value };\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.ts',
    options: { production: true },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/consistent-type-assertions')
      ?.severity,
    2,
  );
});

test('does not apply typescript-only rules to javascript sidecar files', async (t) => {
  const cwd = await createProject({
    'build.js': "const fs = require('node:fs');\nmodule.exports = fs;\n",
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'build.js',
    options: { production: true },
    configFactory: typeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/no-require-imports'),
    undefined,
  );
});

test('supports vue with javascript', async (t) => {
  const cwd = await createProject({
    'Component.vue': `<script setup>\nconsole.log('hello');\n</script>\n\n<template>\n  <button type="button">Click</button>\n</template>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: { production: false },
    configFactory: vueConfig,
  });

  assert.equal(findRule(messages, 'vue/block-lang'), undefined);
  assert.equal(findRule(messages, 'no-console')?.severity, 1);
});

test('supports vue relaxed mode for development feedback', async (t) => {
  const cwd = await createProject({
    'Component.vue': `<template>\n  <div v-html="content" />\n</template>\n\n<script setup>\nconst content = '<strong>Hello</strong>';\n</script>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: { production: false },
    configFactory: vueConfig,
  });

  assert.equal(findRule(messages, 'vue/no-v-html')?.severity, 1);
});

test('supports vue production mode for production builds', async (t) => {
  const cwd = await createProject({
    'Component.vue': `<template>\n  <div v-html="content" />\n</template>\n\n<script setup>\nconst content = '<strong>Hello</strong>';\n</script>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: { production: true },
    configFactory: vueConfig,
  });

  assert.equal(findRule(messages, 'vue/no-v-html')?.severity, 2);
});

test('keeps vue formatting rules compatible with prettier', async (t) => {
  const cwd = await createProject({
    'Component.vue': `<template><div class=\"a\" id=\"b\">{{ value }}</div></template>\n<script setup>\nconst value = 'hello'\n</script>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: { production: true },
    configFactory: vueConfig,
  });

  assert.equal(findRule(messages, 'vue/max-attributes-per-line'), undefined);
});

test('supports vue with typescript', async (t) => {
  const cwd = await createProject({
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          strict: true,
        },
        include: ['**/*.ts', '**/*.vue'],
      },
      null,
      2,
    ),
    'Component.vue': `<script setup lang="ts">\nconst value: any = 1;\nconst label = String(value);\n</script>\n\n<template>\n  <button type="button">{{ label }}</button>\n</template>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: {
      production: true,
      tsParserOptions: {
        projectService: true,
        tsconfigRootDir: cwd,
      },
    },
    configFactory: vueTypeScriptConfig,
  });

  assert.equal(findRule(messages, 'vue/block-lang'), undefined);
  assert.equal(
    findRule(messages, '@typescript-eslint/no-explicit-any')?.severity,
    1,
  );
});

test('applies typescript assertion rules inside vue script setup', async (t) => {
  const cwd = await createProject({
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          strict: true,
        },
        include: ['**/*.ts', '**/*.vue'],
      },
      null,
      2,
    ),
    'Component.vue': `<script setup lang="ts">\nconst value = "hello" as string;\n</script>\n\n<template>\n  <div>{{ value }}</div>\n</template>\n`,
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'Component.vue',
    options: {
      production: true,
      tsParserOptions: {
        projectService: true,
        tsconfigRootDir: cwd,
      },
    },
    configFactory: vueTypeScriptConfig,
  });

  assert.equal(
    findRule(messages, '@typescript-eslint/consistent-type-assertions')
      ?.severity,
    2,
  );
});

test('ignores dist output when linting a type-aware project root', async (t) => {
  const cwd = await createProject({
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          strict: true,
        },
        include: ['src/**/*.ts'],
      },
      null,
      2,
    ),
    'src/index.ts': 'export const value = 1;\n',
    'dist/index.d.ts': 'export declare const value: number;\n',
    'dist/index.js': 'exports.value = 1;\n',
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const results = await lintPaths({
    cwd,
    filePaths: ['.'],
    options: {
      production: true,
      tsParserOptions: {
        projectService: true,
        tsconfigRootDir: cwd,
      },
    },
    configFactory: typeScriptConfig,
  });

  const lintedFiles = results.map((result) => result.filePath);
  const messages = results.flatMap((result) => result.messages);

  assert.equal(
    lintedFiles.some((filePath) => filePath.includes(`${join(cwd, 'dist')}`)),
    false,
  );
  assert.equal(
    messages.some((message) => message.message.includes('project service')),
    false,
  );
});

test(
  'ignores files listed in .gitignore',
  { concurrency: false },
  async (t) => {
    const previousCwd = process.cwd();
    const cwd = await createProject({
      '.gitignore': 'generated.js\n',
      'generated.js': "console.log('generated');\n",
      'index.js': "console.log('source');\n",
    });
    t.after(async () => {
      process.chdir(previousCwd);
      await rm(cwd, { recursive: true, force: true });
    });

    process.chdir(cwd);

    try {
      const results = await lintPaths({
        cwd,
        filePaths: ['.'],
        options: {
          production: true,
        },
      });

      const lintedFiles = results.map((result) => result.filePath);

      assert.equal(
        lintedFiles.some((filePath) => filePath.endsWith('generated.js')),
        false,
      );
      assert.equal(
        lintedFiles.some((filePath) => filePath.endsWith('index.js')),
        true,
      );
    } finally {
      process.chdir(previousCwd);
    }
  },
);

test('keeps backward compatibility with the deprecated strict alias', async (t) => {
  const cwd = await createProject({
    'index.js': "console.log('hello');\n",
  });
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const messages = await lintFile({
    cwd,
    filePath: 'index.js',
    options: { strict: true },
  });

  assert.equal(findRule(messages, 'no-console')?.severity, 2);
});
