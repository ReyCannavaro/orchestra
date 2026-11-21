import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { checkAgentHealth } from '../checker/agentHealthRule.js';
import { loadBaton } from '../session/batonManager.js';
import { getRegistrySkills } from '../skills/registry.js';

export function fetchDashboardState(cwd = process.cwd()) {
  // 1. Stack detection
  let files = [];
  try {
    files = fs.readdirSync(cwd);
  } catch {}

  let stack = 'Universal (Standard)';
  if (files.includes('pubspec.yaml')) stack = 'Flutter Mobile';
  else if (files.includes('next.config.js') || files.includes('next.config.ts') || files.includes('next.config.mjs')) stack = 'Next.js Fullstack (RSC)';
  else if (files.includes('moon.yml') || files.includes('turbo.json') || files.includes('pnpm-workspace.yaml')) stack = 'Monorepo Multi-Package';
  else if (files.includes('package.json')) stack = 'Node.js / Web';
  else if (files.includes('requirements.txt') || files.includes('pyproject.toml')) stack = 'Python / AI Stack';

  // 2. Agent Health
  const agentHealth = checkAgentHealth(cwd);

  // 3. Baton Session
  const session = loadBaton(cwd);

  // 4. Skills summary
  const globalDir = path.join(os.homedir(), '.agents', 'skills');
  const localDir = path.join(cwd, '.agents', 'skills');

  let globalSkillsCount = 0;
  let localSkillsCount = 0;

  if (fs.existsSync(globalDir)) {
    try {
      globalSkillsCount = fs.readdirSync(globalDir, { withFileTypes: true }).filter(d => d.isDirectory()).length;
    } catch {}
  }

  if (fs.existsSync(localDir)) {
    try {
      localSkillsCount = fs.readdirSync(localDir, { withFileTypes: true }).filter(d => d.isDirectory()).length;
    } catch {}
  }

  // Check if .cursor/mcp.json exists
  const hasMcp = fs.existsSync(path.join(cwd, '.cursor', 'mcp.json'));

  return {
    cwd,
    stack,
    agentHealth,
    session,
    globalSkillsCount,
    localSkillsCount,
    hasMcp,
    timestamp: new Date().toLocaleTimeString(),
  };
}
