import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  detectFramework,
  detectPackageManager,
  installCmd,
  devInstallCmd,
  runCmd,
  dlxCmd,
  writeFileSafe,
  readFileSafe,
  fileExists,
} from './utils.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gebeta-test-'));
}

function writePkg(dir: string, deps: Record<string, Record<string, string>>) {
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(deps, null, 2));
}

// ─── detectFramework ──────────────────────────────────────────────────────────

describe('detectFramework', () => {
  it('returns null when no package.json exists', () => {
    expect(detectFramework(tempDir())).toBeNull();
  });

  it('detects next', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { next: '^14.0.0' } });
    expect(detectFramework(dir)).toBe('next');
  });

  it('detects react', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { react: '^19.0.0' } });
    expect(detectFramework(dir)).toBe('react');
  });

  it('detects vue', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { vue: '^3.0.0' } });
    expect(detectFramework(dir)).toBe('vue');
  });

  it('detects react-native', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { 'react-native': '0.80.0' } });
    expect(detectFramework(dir)).toBe('react-native');
  });

  it('prefers react-native over react when both present', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { react: '^19', 'react-native': '0.80.0' } });
    expect(detectFramework(dir)).toBe('react-native');
  });

  it('returns null for a plain Node project (no known framework dep)', () => {
    const dir = tempDir();
    writePkg(dir, { dependencies: { express: '^4' } });
    expect(detectFramework(dir)).toBeNull();
  });
});

// ─── detectPackageManager ─────────────────────────────────────────────────────

describe('detectPackageManager', () => {
  it('detects pnpm from pnpm-lock.yaml', () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '');
    expect(detectPackageManager(dir)).toBe('pnpm');
  });

  it('detects yarn from yarn.lock', () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'yarn.lock'), '');
    expect(detectPackageManager(dir)).toBe('yarn');
  });

  it('detects bun from bun.lock', () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'bun.lock'), '');
    expect(detectPackageManager(dir)).toBe('bun');
  });

  it('detects npm from package-lock.json', () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'package-lock.json'), '{}');
    expect(detectPackageManager(dir)).toBe('npm');
  });

  it('detects from packageManager field in package.json', () => {
    const dir = tempDir();
    writePkg(dir, { packageManager: 'pnpm@9.0.0' } as never);
    expect(detectPackageManager(dir)).toBe('pnpm');
  });

  it('walks up directories to find a lockfile', () => {
    const parent = tempDir();
    fs.writeFileSync(path.join(parent, 'pnpm-lock.yaml'), '');
    const child = path.join(parent, 'packages', 'app');
    fs.mkdirSync(child, { recursive: true });
    expect(detectPackageManager(child)).toBe('pnpm');
  });
});

// ─── Command builders ─────────────────────────────────────────────────────────

describe('installCmd', () => {
  it('pnpm', () => expect(installCmd('pnpm', ['a', 'b'])).toBe('pnpm add a b'));
  it('yarn', () => expect(installCmd('yarn', ['a'])).toBe('yarn add a'));
  it('npm', () => expect(installCmd('npm', ['a'])).toBe('npm add a'));
  it('bun', () => expect(installCmd('bun', ['a'])).toBe('bun add a'));
});

describe('devInstallCmd', () => {
  it('includes -D flag', () => {
    expect(devInstallCmd('pnpm', ['typescript'])).toContain('-D');
  });
});

describe('runCmd', () => {
  it('yarn run is just yarn <script>', () => expect(runCmd('yarn', 'dev')).toBe('yarn dev'));
  it('pnpm run', () => expect(runCmd('pnpm', 'dev')).toBe('pnpm run dev'));
});

describe('dlxCmd', () => {
  it('pnpm uses dlx', () => expect(dlxCmd('pnpm', 'create-vite')).toBe('pnpm dlx create-vite'));
  it('npm uses npx', () => expect(dlxCmd('npm', 'create-vite')).toBe('npx create-vite'));
  it('bun uses bunx', () => expect(dlxCmd('bun', 'create-vite')).toBe('bunx create-vite'));
});

// ─── File helpers ─────────────────────────────────────────────────────────────

describe('writeFileSafe', () => {
  it('creates a new file', () => {
    const dir = tempDir();
    const file = path.join(dir, 'test.txt');
    expect(writeFileSafe(file, 'hello')).toBe(true);
    expect(fs.readFileSync(file, 'utf-8')).toBe('hello');
  });

  it('skips if file exists and overwrite is false', () => {
    const dir = tempDir();
    const file = path.join(dir, 'test.txt');
    fs.writeFileSync(file, 'original');
    expect(writeFileSafe(file, 'new')).toBe(false);
    expect(fs.readFileSync(file, 'utf-8')).toBe('original');
  });

  it('overwrites if overwrite is true', () => {
    const dir = tempDir();
    const file = path.join(dir, 'test.txt');
    fs.writeFileSync(file, 'original');
    writeFileSafe(file, 'updated', true);
    expect(fs.readFileSync(file, 'utf-8')).toBe('updated');
  });

  it('creates nested directories', () => {
    const dir = tempDir();
    const file = path.join(dir, 'a', 'b', 'c.txt');
    writeFileSafe(file, 'deep');
    expect(fs.existsSync(file)).toBe(true);
  });
});

describe('readFileSafe', () => {
  it('returns content for existing file', () => {
    const dir = tempDir();
    const file = path.join(dir, 'f.txt');
    fs.writeFileSync(file, 'content');
    expect(readFileSafe(file)).toBe('content');
  });

  it('returns null for missing file', () => {
    expect(readFileSafe('/nonexistent/path/file.txt')).toBeNull();
  });
});

describe('fileExists', () => {
  it('returns true for existing file', () => {
    const dir = tempDir();
    const file = path.join(dir, 'x.txt');
    fs.writeFileSync(file, '');
    expect(fileExists(file)).toBe(true);
  });

  it('returns false for missing file', () => {
    expect(fileExists('/nonexistent/file.txt')).toBe(false);
  });
});
