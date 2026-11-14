#!/usr/bin/env node

/**
 * ORCHESTRA CLI
 * The Symphony Multi-Agent Orchestration & Scaffolding Kit
 * (C) 2026 Rey Cannavaro. MIT License.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ANSI Color Helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function banner() {
  console.log(`
${colors.cyan}${colors.bold}  ___  ____   ____ _   _ _____ ____ _____ ____     _    
 / _ \\|  _ \\ / ___| | | | ____/ ___|_   _|  _ \\   / \\   
| | | | |_) | |   | |_| |  _| \\___ \\ | | | |_) | / _ \\  
| |_| |  _ <| |___|  _  | |___ ___) || | |  _ < / ___ \\ 
 \\___/|_| \\_\\\\____|_| |_|_____|____/ |_| |_| \\_/_/   \\_\\${colors.reset}
${colors.dim}  The Symphony Paradigm for Autonomous Multi-Agent Engineering${colors.reset}
  ${colors.magenta}v1.0.0${colors.reset} • By ${colors.bold}Rey Cannavaro${colors.reset}
`);
}

function showHelp() {
  banner();
  console.log(`
${colors.bold}USAGE:${colors.reset}
  npx orchestra <command> [options]

${colors.bold}COMMANDS:${colors.reset}
  ${colors.green}init${colors.reset}             Scaffold Orchestra multi-agent architecture in current repository
  ${colors.green}setup-global${colors.reset}     Install/Sync 23+ core skills to ~/.agents/skills (Global Hub)
  ${colors.green}list-skills${colors.reset}      Display all available core skills in the Orchestra library
  ${colors.green}help, --help${colors.reset}     Show this help menu

${colors.bold}EXAMPLES:${colors.reset}
  $ npx orchestra init
  $ npx orchestra setup-global
  $ npx orchestra list-skills
`);
}

async function listSkills() {
  banner();
  const skillsDir = path.join(REPO_ROOT, 'core-skills');
  if (!fs.existsSync(skillsDir)) {
    console.log(`${colors.red}Error: core-skills folder not found at ${skillsDir}${colors.reset}`);
    return;
  }

  const items = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`${colors.bold}🎻 Orchestra Core Skills Library (${items.length} skills):${colors.reset}\n`);
  items.forEach((skill, idx) => {
    let desc = '';
    const skillMd = path.join(skillsDir, skill, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      try {
        const content = fs.readFileSync(skillMd, 'utf8');
        const match = content.match(/description:\s*(.+)/i);
        if (match) {
          desc = match[1].replace(/['"]/g, '').trim();
          if (desc.length > 70) desc = desc.slice(0, 67) + '...';
        }
      } catch {}
    }
    console.log(`  ${colors.cyan}${(idx + 1).toString().padStart(2, ' ')}.${colors.reset} ${colors.bold}${skill.padEnd(28, ' ')}${colors.reset} ${colors.dim}${desc}${colors.reset}`);
  });
  console.log('');
}

async function setupGlobal() {
  banner();
  const userHome = os.homedir();
  const targetSkillsDir = path.join(userHome, '.agents', 'skills');
  const sourceSkillsDir = path.join(REPO_ROOT, 'core-skills');

  console.log(`${colors.yellow}📦 Installing Orchestra Core Skills to Global Hub...${colors.reset}`);
  console.log(`   Source: ${sourceSkillsDir}`);
  console.log(`   Destination: ${targetSkillsDir}\n`);

  if (!fs.existsSync(sourceSkillsDir)) {
    console.log(`${colors.red}Error: Source core-skills not found!${colors.reset}`);
    return;
  }

  fs.mkdirSync(targetSkillsDir, { recursive: true });
  fs.cpSync(sourceSkillsDir, targetSkillsDir, { recursive: true });

  console.log(`${colors.green}✔ Successfully synchronized 23+ Core Skills to ${targetSkillsDir}${colors.reset}`);
  console.log(`${colors.cyan}✨ Any project on this machine can now resolve global skills!${colors.reset}\n`);
}

function detectProjectStack(targetDir) {
  const files = fs.readdirSync(targetDir);
  const stack = {
    isNextJs: false,
    isReact: false,
    isFlutter: false,
    isPython: false,
    isElysia: false,
    isMonorepo: false,
    suggestedPreset: 'universal',
  };

  if (files.includes('moon.yml') || files.includes('pnpm-workspace.yaml') || files.includes('turbo.json')) {
    stack.isMonorepo = true;
    stack.suggestedPreset = 'monorepo';
    return stack;
  }

  if (files.includes('pubspec.yaml')) {
    stack.isFlutter = true;
    stack.suggestedPreset = 'flutter-mobile';
    return stack;
  }

  if (files.includes('next.config.js') || files.includes('next.config.ts') || files.includes('next.config.mjs')) {
    stack.isNextJs = true;
    stack.suggestedPreset = 'nextjs-fullstack';
    return stack;
  }

  if (files.includes('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps.next) {
        stack.isNextJs = true;
        stack.suggestedPreset = 'nextjs-fullstack';
      } else if (deps.elysia) {
        stack.isElysia = true;
        stack.suggestedPreset = 'universal';
      } else if (deps.react) {
        stack.isReact = true;
        stack.suggestedPreset = 'nextjs-fullstack';
      }
    } catch {}
  }

  if (files.includes('requirements.txt') || files.includes('pyproject.toml')) {
    stack.isPython = true;
  }

  return stack;
}

async function initCommand() {
  banner();
  const cwd = process.cwd();
  console.log(`${colors.bold}📍 Target Workspace:${colors.reset} ${cwd}\n`);

  const stack = detectProjectStack(cwd);
  console.log(`${colors.cyan}🔍 Stack Intelligence Detection:${colors.reset}`);
  console.log(`   Detected Preset: ${colors.green}${colors.bold}${stack.suggestedPreset}${colors.reset}\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const answerPreset = await rl.question(
    `${colors.bold}? Choose Orchestra Preset (${colors.cyan}1${colors.reset}=universal, ${colors.cyan}2${colors.reset}=nextjs-fullstack, ${colors.cyan}3${colors.reset}=flutter-mobile, ${colors.cyan}4${colors.reset}=monorepo) [Default: ${stack.suggestedPreset}]: `
  );

  let chosenPreset = stack.suggestedPreset;
  if (answerPreset.trim() === '1') chosenPreset = 'universal';
  if (answerPreset.trim() === '2') chosenPreset = 'nextjs-fullstack';
  if (answerPreset.trim() === '3') chosenPreset = 'flutter-mobile';
  if (answerPreset.trim() === '4') chosenPreset = 'monorepo';

  console.log(`\n${colors.yellow}🎼 Orchestrating setup for preset: ${chosenPreset}...${colors.reset}`);

  const templateSrc = path.join(REPO_ROOT, 'templates', chosenPreset);
  const fallbackSrc = path.join(REPO_ROOT, 'templates', 'universal');
  const activeSrc = fs.existsSync(templateSrc) ? templateSrc : fallbackSrc;

  // Copy template files to cwd
  fs.cpSync(activeSrc, cwd, { recursive: true, force: false });

  // Generate adapter files for multi-IDE compatibility
  const cursorRulesPath = path.join(cwd, '.cursorrules');
  if (!fs.existsSync(cursorRulesPath)) {
    fs.writeFileSync(cursorRulesPath, `# Cursor Rules Adapter (Orchestra Multi-Agent)
Always read and strictly adhere to AGENTS.md and .agents/ORCHESTRATOR.md before executing code.
Follow the 4-step execution lifecycle: Intent Triage -> Skill Resolution -> Phased SOP -> Pre-Flight Verification.
Enforce Anti-Slop visual standards and Full Output generation (no truncation/TODO placeholders).
`, 'utf8');
  }

  const claudeRulesPath = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(claudeRulesPath)) {
    fs.writeFileSync(claudeRulesPath, `# Claude Code Master Directive (Orchestra Multi-Agent)
This repository is governed by the Orchestra multi-agent architecture.
Always read AGENTS.md and .agents/ORCHESTRATOR.md before performing tasks.
Mandatory Skill Resolution: Refer to .agents/SKILL_ROUTER.md.
`, 'utf8');
  }

  rl.close();

  console.log(`\n${colors.green}✔ Successfully initialized Orchestra in your project!${colors.reset}`);
  console.log(`\n${colors.bold}Created files:${colors.reset}`);
  console.log(`  📄 ${colors.cyan}AGENTS.md${colors.reset}                  (Root Universal Master Directive)`);
  console.log(`  📁 ${colors.cyan}.agents/ORCHESTRATOR.md${colors.reset}    (4-Step Execution Protocol)`);
  console.log(`  📁 ${colors.cyan}.agents/SKILL_ROUTER.md${colors.reset}    (Dynamic Skill Resolution Matrix)`);
  console.log(`  📁 ${colors.cyan}.agents/WORKFLOWS.md${colors.reset}       (Domain Standard Operating Procedures)`);
  console.log(`  📁 ${colors.cyan}.agents/rules/${colors.reset}              (Anti-Slop & Quality Guardrails)`);
  console.log(`  📄 ${colors.cyan}.cursorrules${colors.reset}               (Cursor IDE Bridge)`);
  console.log(`  📄 ${colors.cyan}CLAUDE.md${colors.reset}                  (Claude Code Bridge)`);
  console.log(`\n${colors.magenta}✨ Your AI Agent is now conducting like a master symphony! 🎻${colors.reset}\n`);
}

// Main Router
const args = process.argv.slice(2);
const command = args[0] || 'help';

switch (command) {
  case 'init':
    initCommand().catch(console.error);
    break;
  case 'setup-global':
  case 'install-skills':
    setupGlobal().catch(console.error);
    break;
  case 'list-skills':
    listSkills().catch(console.error);
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}
