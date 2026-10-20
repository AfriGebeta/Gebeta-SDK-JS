import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawn } from 'node:child_process';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Framework = 'react' | 'next' | 'vue' | 'vanilla' | 'react-native' | 'node';
export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

// ─── Framework detection ──────────────────────────────────────────────────────

export function detectFramework(cwd: string): Framework | null {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  if (deps['react-native'] || deps['@react-native-community/cli']) return 'react-native';
  if (deps['next']) return 'next';
  if (deps['vue']) return 'vue';
  if (deps['react']) return 'react';
  return null;
}

// ─── Package manager detection ────────────────────────────────────────────────

const LOCKFILES: Array<{ file: string; pm: PackageManager }> = [
  { file: 'pnpm-lock.yaml', pm: 'pnpm' },
  { file: 'bun.lockb', pm: 'bun' },
  { file: 'bun.lock', pm: 'bun' },
  { file: 'yarn.lock', pm: 'yarn' },
  { file: 'package-lock.json', pm: 'npm' },
];

function detectPmInDir(dir: string): PackageManager | null {
  for (const { file, pm } of LOCKFILES) {
    if (fs.existsSync(path.join(dir, file))) return pm;
  }
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { packageManager?: string };
      if (typeof pkg.packageManager === 'string') {
        const name = pkg.packageManager.split('@')[0] as PackageManager;
        if (['pnpm', 'yarn', 'npm', 'bun'].includes(name)) return name;
      }
    } catch {}
  }
  return null;
}

export function detectPackageManager(cwd: string): PackageManager {
  let current = path.resolve(cwd);
  while (true) {
    const pm = detectPmInDir(current);
    if (pm) return pm;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  // Fall back to npm_config_user_agent set by dlx runners
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm';
}

// ─── Install commands ─────────────────────────────────────────────────────────

export function installCmd(pm: PackageManager, pkgs: string[]): string {
  const base = pm === 'yarn' ? 'yarn add' : `${pm} add`;
  return `${base} ${pkgs.join(' ')}`;
}

export function devInstallCmd(pm: PackageManager, pkgs: string[]): string {
  const flag = pm === 'npm' ? '-D' : pm === 'yarn' ? '-D' : '-D';
  const base = pm === 'yarn' ? 'yarn add' : `${pm} add`;
  return `${base} ${flag} ${pkgs.join(' ')}`;
}

export function runCmd(pm: PackageManager, script: string): string {
  return pm === 'yarn' ? `yarn ${script}` : `${pm} run ${script}`;
}

export function dlxCmd(pm: PackageManager, pkg: string): string {
  switch (pm) {
    case 'pnpm': return `pnpm dlx ${pkg}`;
    case 'yarn': return `yarn dlx ${pkg}`;
    case 'bun': return `bunx ${pkg}`;
    default: return `npx ${pkg}`;
  }
}

// ─── File helpers ─────────────────────────────────────────────────────────────

/** Write a file creating parent dirs. Returns false if file existed and was skipped. */
export function writeFileSafe(filePath: string, content: string, overwrite = false): boolean {
  if (fs.existsSync(filePath) && !overwrite) return false;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

export function readFileSafe(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// ─── Shell helpers ────────────────────────────────────────────────────────────

export function exec(command: string, cwd: string): void {
  execSync(command, { cwd, stdio: 'inherit' });
}

export function spawnAndWaitFor(
  command: string,
  args: string[],
  cwd: string,
  waitFor: string,
  timeoutMs = 120_000,
): Promise<import('node:child_process').ChildProcess> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], shell: true });
    let output = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`Timed out waiting for "${waitFor}"`));
    }, timeoutMs);

    child.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      if (output.includes(waitFor)) { clearTimeout(timer); resolve(child); }
    });
    child.stderr?.on('data', (data: Buffer) => process.stderr.write(data.toString()));
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (!output.includes(waitFor)) reject(new Error(`Process exited (${code}) before "${waitFor}"`));
    });
  });
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export async function validateApiKey(key: string): Promise<boolean> {
  try {
    const url = `https://mapapi.gebeta.app/api/v1/route/geocoding?name=addis&api_key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    return res.status !== 401 && res.status !== 403;
  } catch {
    return true; // offline → let them proceed
  }
}
