import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.nuxt',
  'dist',
  'build',
  'out',
  '.turbo',
  'coverage',
  '.dart_tool',
  'target',
  'vendor',
  '.venv',
  '__pycache__',
]);

const SCANNABLE_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.vue', '.svelte', '.astro',
  '.css', '.scss', '.sass', '.less',
  '.html',
  '.dart',
  '.py',
  '.go',
  '.rs',
  '.json',
  '.md',
]);

export function isGitRepo(cwd = process.cwd()) {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function getGitRoot(cwd = process.cwd()) {
  try {
    return execSync('git rev-parse --show-toplevel', { cwd, encoding: 'utf8' }).trim();
  } catch {
    return cwd;
  }
}

/**
 * Returns list of modified/added files according to options
 */
export function getTargetFiles(cwd = process.cwd(), options = {}) {
  const root = getGitRoot(cwd);
  const inGit = isGitRepo(cwd);

  if (!inGit || options.all) {
    return scanAllFiles(root);
  }

  const filesSet = new Set();

  try {
    if (options.staged) {
      const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', { cwd: root, encoding: 'utf8' });
      staged.split('\n').map(s => s.trim()).filter(Boolean).forEach(f => filesSet.add(path.resolve(root, f)));
    } else {
      // Changed staged + unstaged
      const unstaged = execSync('git diff --name-only --diff-filter=ACMR', { cwd: root, encoding: 'utf8' });
      unstaged.split('\n').map(s => s.trim()).filter(Boolean).forEach(f => filesSet.add(path.resolve(root, f)));

      const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', { cwd: root, encoding: 'utf8' });
      staged.split('\n').map(s => s.trim()).filter(Boolean).forEach(f => filesSet.add(path.resolve(root, f)));

      // Untracked files
      const untracked = execSync('git status --porcelain', { cwd: root, encoding: 'utf8' });
      untracked.split('\n').forEach(line => {
        if (line.startsWith('?? ')) {
          const file = line.slice(3).trim();
          filesSet.add(path.resolve(root, file));
        }
      });
    }
  } catch {
    return scanAllFiles(root);
  }

  // Filter existing files with scannable extensions
  const result = [];
  for (const file of filesSet) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (SCANNABLE_EXTS.has(ext)) {
        result.push(file);
      }
    }
  }

  // If no files changed in git, fallback to scan root files (except ignored)
  if (result.length === 0 && !options.staged) {
    return scanAllFiles(root);
  }

  return result;
}

/**
 * Recursively scan all valid source files
 */
export function scanAllFiles(dir, maxDepth = 10, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  const files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.agents') continue;
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...scanAllFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SCANNABLE_EXTS.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch {}

  return files;
}
