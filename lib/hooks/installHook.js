import fs from 'node:fs';
import path from 'node:path';
import { colors } from '../utils/colors.js';

/**
 * Installs Orchestra pre-commit hook into .git/hooks/pre-commit
 */
export function installGitHook(cwd = process.cwd()) {
  const gitDir = path.join(cwd, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log(`${colors.red}Error: No .git directory found at ${cwd}.${colors.reset}`);
    console.log(`${colors.dim}Make sure you run this command inside the root of a Git repository.${colors.reset}`);
    return 1;
  }

  const hooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const preCommitPath = path.join(hooksDir, 'pre-commit');

  const hookScript = `#!/bin/sh
# 🎻 ORCHESTRA PRE-COMMIT QUALITY GUARDRAIL
# Enforces anti-slop, zero truncation, and configuration integrity.

# Windows NVM & Common Node.js path fallbacks
if [ -d "/c/nvm4w/nodejs" ]; then
  export PATH="/c/nvm4w/nodejs:$PATH"
fi
if [ -d "C:/nvm4w/nodejs" ]; then
  export PATH="C:/nvm4w/nodejs:$PATH"
fi
if [ -d "/c/Program Files/nodejs" ]; then
  export PATH="/c/Program Files/nodejs:$PATH"
fi

NODE_CMD=""
if command -v node >/dev/null 2>&1; then
  NODE_CMD="node"
elif command -v node.exe >/dev/null 2>&1; then
  NODE_CMD="node.exe"
elif [ -f "C:/nvm4w/nodejs/node.exe" ]; then
  NODE_CMD="C:/nvm4w/nodejs/node.exe"
elif [ -f "/c/nvm4w/nodejs/node.exe" ]; then
  NODE_CMD="/c/nvm4w/nodejs/node.exe"
elif [ -f "C:/Program Files/nodejs/node.exe" ]; then
  NODE_CMD="C:/Program Files/nodejs/node.exe"
fi

if [ -z "$NODE_CMD" ]; then
  echo "⚠ Warning: Node.js runtime not found in Git hook environment. Bypassing pre-commit check."
  exit 0
fi

echo ""
echo "🎻 Running Orchestra Pre-Commit Guardrails..."
"$NODE_CMD" ./bin/index.js check --staged --fast
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "✖ Commit rejected by Orchestra Guardrails!"
  echo "  Fix the flagged issues above or run with --fix before committing."
  echo ""
  exit $EXIT_CODE
fi

exit 0
`;

  try {
    fs.writeFileSync(preCommitPath, hookScript, { encoding: 'utf8', mode: 0o755 });
    console.log(`\n${colors.green}✔ Successfully installed Orchestra Git pre-commit hook!${colors.reset}`);
    console.log(`  Path: ${colors.cyan}${preCommitPath}${colors.reset}`);
    console.log(`  ${colors.dim}Now every 'git commit' will be automatically guarded against AI slop and code truncation.${colors.reset}\n`);
    return 0;
  } catch (err) {
    console.log(`${colors.red}Failed to install pre-commit hook:${colors.reset} ${err.message}`);
    return 1;
  }
}

/**
 * Generates .github/workflows/orchestra-check.yml
 */
export function initCIWorkflow(cwd = process.cwd()) {
  const workflowDir = path.join(cwd, '.github', 'workflows');
  fs.mkdirSync(workflowDir, { recursive: true });

  const workflowPath = path.join(workflowDir, 'orchestra-check.yml');

  const workflowContent = `name: Orchestra Quality Gatekeeper

on:
  push:
    branches: [ main, dev, master ]
  pull_request:
    branches: [ main, dev, master ]

jobs:
  orchestra-guardrails:
    name: Verify Code Completeness & Anti-Slop
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run Orchestra Quality Check
        run: |
          node ./bin/index.js check --all --fast
`;

  try {
    fs.writeFileSync(workflowPath, workflowContent, 'utf8');
    console.log(`\n${colors.green}✔ Successfully generated GitHub Actions CI Workflow!${colors.reset}`);
    console.log(`  Path: ${colors.cyan}${workflowPath}${colors.reset}`);
    console.log(`  ${colors.dim}Pull Requests and pushes will now be verified against Orchestra quality standards.${colors.reset}\n`);
    return 0;
  } catch (err) {
    console.log(`${colors.red}Failed to generate CI workflow:${colors.reset} ${err.message}`);
    return 1;
  }
}
