import fs from 'node:fs';
import path from 'node:path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
  type Framework,
  type PackageManager,
  detectFramework,
  detectPackageManager,
  installCmd,
  runCmd,
  dlxCmd,
  writeFileSafe,
  readFileSafe,
  fileExists,
  exec,
  validateApiKey,
} from './utils.js';
import {
  type Feature,
  type TemplateConfig,
  envTemplate,
  envExampleTemplate,
  reactAppTemplate,
  nextPageTemplate,
  vanillaMainTemplate,
  vanillaHtmlTemplate,
  vueAppTemplate,
  reactNativeAppTemplate,
  nodeIndexTemplate,
  nodeTsConfigTemplate,
  FRAMEWORK_PACKAGES,
  FRAMEWORK_LABELS,
  ALL_FEATURES,
  NODE_FEATURES,
} from './templates.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cancel(msg = 'Setup cancelled.'): never {
  p.cancel(msg);
  process.exit(0);
}

function isCancel(v: unknown): v is symbol {
  return typeof v === 'symbol';
}

function guard<T>(v: T | symbol): T {
  if (isCancel(v)) cancel();
  return v as T;
}

// ─── Scaffolders ──────────────────────────────────────────────────────────────

function scaffoldVite(projectName: string, template: string, pm: PackageManager, cwd: string) {
  const cmd = `${pm === 'bun' ? 'bun create vite' : `${dlxCmd(pm, 'create-vite@latest')}`} ${projectName} --template ${template}`;
  exec(cmd, cwd);
}

function scaffoldNext(projectName: string, typescript: boolean, pm: PackageManager, cwd: string) {
  const tsFlag = typescript ? '' : '--no-typescript';
  const base = pm === 'pnpm'
    ? `pnpm create next-app@latest`
    : pm === 'bun'
    ? `bunx create-next-app@latest`
    : `npx create-next-app@latest`;
  exec(`${base} ${projectName} --app ${tsFlag} --no-eslint --no-tailwind --no-src-dir --no-import-alias`, cwd);
}

function scaffoldVue(projectName: string, typescript: boolean, pm: PackageManager, cwd: string) {
  // create-vue is the official scaffold — gives router, Pinia, etc. options
  const base = pm === 'pnpm'
    ? `pnpm create vue@latest`
    : pm === 'bun'
    ? `bunx create-vue@latest`
    : `npx create-vue@latest`;
  const tsFlag = typescript ? '--ts' : '--no-ts';
  // Run non-interactively with sensible defaults
  exec(`${base} ${projectName} ${tsFlag} --no-router --no-pinia --no-vitest --no-eslint`, cwd);
}

function initBareProject(targetDir: string, projectName: string, typescript: boolean) {
  fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });
  const pkg = {
    name: projectName,
    version: '0.0.1',
    private: true,
    type: 'module',
    scripts: {
      start: typescript ? 'tsx src/index.ts' : 'node src/index.mjs',
      dev: typescript ? 'tsx watch src/index.ts' : 'node --watch src/index.mjs',
    },
  };
  writeFileSafe(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  if (typescript) {
    writeFileSafe(path.join(targetDir, 'tsconfig.json'), nodeTsConfigTemplate());
  }
}

// ─── Env / gitignore ─────────────────────────────────────────────────────────

function writeEnv(cfg: TemplateConfig, targetDir: string) {
  const envPath = path.join(targetDir, '.env');
  const existing = readFileSafe(envPath);
  if (existing) {
    if (!existing.includes('GEBETA')) {
      fs.appendFileSync(envPath, '\n' + envTemplate(cfg), 'utf-8');
      p.log.success('.env updated with Gebeta key');
    } else {
      p.log.warn('.env already has a GEBETA key — skipped');
    }
  } else {
    writeFileSafe(envPath, envTemplate(cfg));
    p.log.success('.env created');
  }

  writeFileSafe(path.join(targetDir, '.env.example'), envExampleTemplate(cfg));
  p.log.success('.env.example created');

  const giPath = path.join(targetDir, '.gitignore');
  const gi = readFileSafe(giPath) ?? '';
  if (!gi.includes('.env')) {
    fs.appendFileSync(giPath, gi.endsWith('\n') ? '' : '\n');
    fs.appendFileSync(giPath, '# Gebeta Maps secrets\n.env\n');
    p.log.success('.env added to .gitignore');
  }
}

// ─── Starter files ────────────────────────────────────────────────────────────

function writeStarterFile(cfg: TemplateConfig, targetDir: string) {
  const { framework, typescript } = cfg;

  if (framework === 'react') {
    const ext = typescript ? 'tsx' : 'jsx';
    const written = writeFileSafe(path.join(targetDir, 'src', `App.${ext}`), reactAppTemplate(cfg), true);
    if (written) p.log.success(`src/App.${ext} written`);
  } else if (framework === 'next') {
    const ext = typescript ? 'tsx' : 'jsx';
    fs.mkdirSync(path.join(targetDir, 'app', 'map'), { recursive: true });
    const written = writeFileSafe(path.join(targetDir, 'app', 'map', `page.${ext}`), nextPageTemplate(cfg));
    if (written) p.log.success(`app/map/page.${ext} written`);
  } else if (framework === 'vanilla') {
    const ext = typescript ? 'ts' : 'js';
    writeFileSafe(path.join(targetDir, 'src', `main.${ext}`), vanillaMainTemplate(cfg), true);
    p.log.success(`src/main.${ext} written`);
    if (!fileExists(path.join(targetDir, 'index.html'))) {
      writeFileSafe(path.join(targetDir, 'index.html'), vanillaHtmlTemplate(cfg));
      p.log.success('index.html written');
    }
  } else if (framework === 'vue') {
    writeFileSafe(path.join(targetDir, 'src', 'App.vue'), vueAppTemplate(cfg), true);
    p.log.success('src/App.vue written');
  } else if (framework === 'react-native') {
    writeFileSafe(path.join(targetDir, 'App.tsx'), reactNativeAppTemplate(cfg), true);
    p.log.success('App.tsx written');
  } else if (framework === 'node') {
    const ext = typescript ? 'ts' : 'mjs';
    fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });
    writeFileSafe(path.join(targetDir, 'src', `index.${ext}`), nodeIndexTemplate(cfg));
    p.log.success(`src/index.${ext} written`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  p.intro(`${pc.bgGreen(pc.black(' Gebeta Maps '))} ${pc.dim('Project Setup')}`);

  const cwd = process.cwd();
  const existingFramework = detectFramework(cwd);
  const detectedPm = detectPackageManager(cwd);
  const isExistingProject = fileExists(path.join(cwd, 'package.json'));

  // ── Mode ──────────────────────────────────────────────────────────────────
  let targetDir = cwd;
  let isNewProject = false;
  let projectName = 'my-gebeta-app';

  if (!isExistingProject) {
    const mode = guard(await p.select({
      message: 'What would you like to do?',
      options: [
        { value: 'new', label: 'Create a new project' },
        { value: 'existing', label: 'Add Gebeta Maps to this directory' },
      ],
    }));
    isNewProject = mode === 'new';
  }

  if (isNewProject) {
    const name = guard(await p.text({
      message: 'Project name',
      placeholder: 'my-gebeta-app',
      validate: v => /^[a-z0-9-_]+$/i.test(v) ? undefined : 'Use only letters, numbers, dashes, underscores',
    }));
    projectName = name;
    targetDir = path.join(cwd, projectName);
  } else {
    projectName = path.basename(targetDir);
  }

  // ── Prompts group ─────────────────────────────────────────────────────────
  const answers = await p.group(
    {
      framework: () => p.select<{ value: Framework; label: string }[], Framework>({
        message: 'Framework',
        initialValue: existingFramework ?? 'react',
        options: (Object.entries(FRAMEWORK_LABELS) as [Framework, string][]).map(([value, label]) => ({
          value,
          label,
          hint: value === existingFramework ? 'detected' : undefined,
        })),
      }),

      typescript: () => p.confirm({
        message: 'Use TypeScript?',
        initialValue: true,
      }),

      features: ({ results }) => {
        const fw = results.framework as Framework;
        const available = fw === 'node'
          ? ALL_FEATURES.filter(f => (NODE_FEATURES as string[]).includes(f.value))
          : ALL_FEATURES;

        return p.multiselect<{ value: Feature; label: string; hint: string }[], Feature>({
          message: 'Features to include',
          options: available.map(f => ({ ...f, label: `${f.label}  ${pc.dim(f.hint)}` })),
          initialValues: ['geocoding'],
          required: false,
        });
      },

      pm: () => p.select<{ value: PackageManager; label: string }[], PackageManager>({
        message: 'Package manager',
        initialValue: detectedPm,
        options: [
          { value: 'pnpm', label: 'pnpm' },
          { value: 'npm', label: 'npm' },
          { value: 'yarn', label: 'yarn' },
          { value: 'bun', label: 'bun' },
        ],
      }),

      apiKey: () => p.password({
        message: 'Gebeta Maps API key',
        validate: v => v.length > 0 ? undefined : 'Required — get one at https://gebeta.app/dashboard',
      }),
    },
    { onCancel: () => cancel() },
  );

  const { framework, typescript, features, pm, apiKey } = answers as {
    framework: Framework;
    typescript: boolean;
    features: Feature[];
    pm: PackageManager;
    apiKey: string;
  };

  // ── Validate API key ──────────────────────────────────────────────────────
  const s = p.spinner();
  s.start('Validating API key…');
  const valid = await validateApiKey(apiKey);
  if (!valid) {
    s.stop(pc.yellow('API key returned 401/403 — double-check at gebeta.app/dashboard'));
    const proceed = guard(await p.confirm({ message: 'Continue anyway?', initialValue: false }));
    if (!proceed) cancel('Exiting. Get a valid key at https://gebeta.app/dashboard');
  } else {
    s.stop('API key validated');
  }

  const cfg: TemplateConfig = { framework, typescript, features: features ?? [], apiKey, projectName };

  // ── Scaffold new project ──────────────────────────────────────────────────
  if (isNewProject) {
    p.log.step('Scaffolding project…');
    try {
      if (framework === 'react') {
        scaffoldVite(projectName, typescript ? 'react-ts' : 'react', pm, cwd);
      } else if (framework === 'next') {
        scaffoldNext(projectName, typescript, pm, cwd);
      } else if (framework === 'vanilla') {
        scaffoldVite(projectName, typescript ? 'vanilla-ts' : 'vanilla', pm, cwd);
      } else if (framework === 'vue') {
        scaffoldVue(projectName, typescript, pm, cwd);
      } else {
        initBareProject(targetDir, projectName, typescript);
      }
      p.log.success('Project scaffolded');
    } catch (e) {
      p.log.error(`Scaffolding failed: ${(e as Error).message}`);
      cancel();
    }
  }

  // ── Install packages ──────────────────────────────────────────────────────
  const pkgs = FRAMEWORK_PACKAGES[framework];
  s.start(`Installing ${pkgs.join(', ')}…`);
  try {
    exec(installCmd(pm, pkgs), targetDir);
    s.stop('Packages installed');
  } catch (e) {
    s.stop(pc.red('Install failed'));
    p.log.warn(`Run manually: ${pc.cyan(installCmd(pm, pkgs))}`);
  }

  // React Native iOS setup
  if (framework === 'react-native') {
    const setupScript = path.join(targetDir, 'node_modules/@gebeta/react-native/scripts/setup-ios.js');
    if (fileExists(setupScript)) {
      p.log.step('Patching iOS Podfile…');
      try {
        exec(`node ${setupScript}`, targetDir);
        p.log.success('Podfile patched');
      } catch {
        p.log.warn('iOS setup skipped — run: node node_modules/@gebeta/react-native/scripts/setup-ios.js');
      }
    }
  }

  // ── Write files ───────────────────────────────────────────────────────────
  p.log.step('Writing config files…');
  writeEnv(cfg, targetDir);
  writeStarterFile(cfg, targetDir);

  // ── Next steps ────────────────────────────────────────────────────────────
  const nextSteps: string[] = [];
  if (isNewProject) nextSteps.push(`cd ${projectName}`);
  nextSteps.push(runCmd(pm, framework === 'node' ? 'start' : 'dev'));

  p.note(nextSteps.join('\n'), 'Next steps');

  if (framework === 'react-native') {
    p.note(`cd ios && pod install\n${runCmd(pm, 'ios')}`, 'iOS');
  }

  p.outro(
    `${pc.green('Done!')}  Docs: ${pc.underline('https://gebeta.app/docs')}  ·  Keys: ${pc.underline('https://gebeta.app/dashboard')}`,
  );
}

main().catch(err => {
  p.log.error(String(err));
  process.exit(1);
});
