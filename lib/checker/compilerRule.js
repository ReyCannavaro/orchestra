import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Runs stack-specific compiler and linter checks
 */
export function runCompilerCheck(cwd = process.cwd(), options = {}) {
  if (options.skipCompiler || options.fast) {
    return { skipped: true, reason: 'Fast mode enabled (--fast / --skip-compiler)' };
  }

  const results = [];

  // 1. TypeScript Check
  const tsConfigPath = path.join(cwd, 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    try {
      execSync('npx tsc --noEmit', { cwd, stdio: 'pipe', encoding: 'utf8' });
      results.push({ name: 'TypeScript Typecheck', passed: true, details: '0 type errors' });
    } catch (err) {
      const output = err.stdout || err.stderr || err.message;
      results.push({
        name: 'TypeScript Typecheck',
        passed: false,
        error: output.split('\n').slice(0, 8).join('\n'),
      });
    }
  }

  // 2. Flutter / Dart Check
  const pubspecPath = path.join(cwd, 'pubspec.yaml');
  if (fs.existsSync(pubspecPath)) {
    try {
      execSync('dart analyze', { cwd, stdio: 'pipe', encoding: 'utf8' });
      results.push({ name: 'Dart / Flutter Analyze', passed: true, details: 'Clean static analysis' });
    } catch (err) {
      const output = err.stdout || err.stderr || err.message;
      results.push({
        name: 'Dart / Flutter Analyze',
        passed: false,
        error: output.split('\n').slice(0, 8).join('\n'),
      });
    }
  }

  // 3. ESLint Check (if present in package.json scripts)
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.scripts && pkg.scripts.lint && options.runLinter) {
        try {
          execSync('npm run lint', { cwd, stdio: 'pipe', encoding: 'utf8' });
          results.push({ name: 'Project Linter (npm run lint)', passed: true, details: 'Passed' });
        } catch (err) {
          const output = err.stdout || err.stderr || err.message;
          results.push({
            name: 'Project Linter (npm run lint)',
            passed: false,
            error: output.split('\n').slice(0, 8).join('\n'),
          });
        }
      }
    } catch {}
  }

  return { skipped: results.length === 0, results };
}
