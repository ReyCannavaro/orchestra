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

// Load Version Dynamically
let PKG_VERSION = '1.0.0';
try {
  const pkgPath = path.join(REPO_ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.version) PKG_VERSION = pkg.version;
  }
} catch {}

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
  ${colors.magenta}v${PKG_VERSION}${colors.reset} • By ${colors.bold}Rey Cannavaro${colors.reset}
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
  ${colors.green}version, -v${colors.reset}      Display Orchestra version
  ${colors.green}help, --help${colors.reset}     Show this help menu

${colors.bold}OPTIONS (for init):${colors.reset}
  ${colors.cyan}-p, --preset <name>${colors.reset}  Specify preset: universal, nextjs-fullstack, flutter-mobile, monorepo
  ${colors.cyan}-y, --yes${colors.reset}            Accept detected or specified preset without interactive prompt
  ${colors.cyan}-f, --force${colors.reset}          Overwrite existing files if already present
  ${colors.cyan}--dry-run${colors.reset}            Simulate scaffolding without modifying files

${colors.bold}EXAMPLES:${colors.reset}
  $ npx orchestra init
  $ npx orchestra init -y
  $ npx orchestra init --preset nextjs-fullstack -y
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
  let files = [];
  try {
    files = fs.readdirSync(targetDir);
  } catch {
    files = [];
  }

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

const VALID_PRESETS = ['universal', 'nextjs-fullstack', 'flutter-mobile', 'monorepo'];

function normalizePreset(val) {
  if (!val) return null;
  const lower = val.trim().toLowerCase();
  if (lower === '1' || lower === 'universal') return 'universal';
  if (lower === '2' || lower === 'nextjs' || lower === 'nextjs-fullstack') return 'nextjs-fullstack';
  if (lower === '3' || lower === 'flutter' || lower === 'flutter-mobile') return 'flutter-mobile';
  if (lower === '4' || lower === 'monorepo') return 'monorepo';
  return null;
}

async function initCommand(options = {}) {
  banner();
  const cwd = process.cwd();
  console.log(`${colors.bold}📍 Target Workspace:${colors.reset} ${cwd}\n`);

  const stack = detectProjectStack(cwd);
  console.log(`${colors.cyan}🔍 Stack Intelligence Detection:${colors.reset}`);
  console.log(`   Detected Preset: ${colors.green}${colors.bold}${stack.suggestedPreset}${colors.reset}\n`);

  let chosenPreset = stack.suggestedPreset;

  if (options.preset) {
    const normalized = normalizePreset(options.preset);
    if (!normalized) {
      console.log(`${colors.red}Error: Invalid preset '${options.preset}'. Available presets: ${VALID_PRESETS.join(', ')}${colors.reset}`);
      process.exit(1);
    }
    chosenPreset = normalized;
    console.log(`   Selected via flag: ${colors.green}${colors.bold}${chosenPreset}${colors.reset}\n`);
  } else if (!options.yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answerPreset = await rl.question(
      `${colors.bold}? Choose Orchestra Preset (${colors.cyan}1${colors.reset}=universal, ${colors.cyan}2${colors.reset}=nextjs-fullstack, ${colors.cyan}3${colors.reset}=flutter-mobile, ${colors.cyan}4${colors.reset}=monorepo) [Default: ${stack.suggestedPreset}]: `
    );
    rl.close();

    const normalized = normalizePreset(answerPreset);
    if (normalized) {
      chosenPreset = normalized;
    }
  }

  console.log(`\n${colors.yellow}🎼 Orchestrating setup for preset: ${chosenPreset}...${colors.reset}`);

  const templateSrc = path.join(REPO_ROOT, 'templates', chosenPreset);
  const fallbackSrc = path.join(REPO_ROOT, 'templates', 'universal');
  const activeSrc = fs.existsSync(templateSrc) ? templateSrc : fallbackSrc;

  if (options.dryRun) {
    console.log(`\n${colors.yellow}[DRY RUN] Simulation mode active. No files will be written.${colors.reset}`);
    console.log(`  Source Template: ${activeSrc}`);
    console.log(`  Target Directory: ${cwd}`);
    console.log(`  Files to be copied/created:`);
    console.log(`    - AGENTS.md`);
    console.log(`    - .agents/ORCHESTRATOR.md`);
    console.log(`    - .agents/SKILL_ROUTER.md`);
    console.log(`    - .agents/WORKFLOWS.md`);
    console.log(`    - .agents/rules/`);
    console.log(`    - .cursorrules`);
    console.log(`    - CLAUDE.md`);
    return;
  }

  // Copy template files to cwd
  fs.cpSync(activeSrc, cwd, { recursive: true, force: options.force ?? false });

  // Generate adapter files for multi-IDE compatibility
  const cursorRulesPath = path.join(cwd, '.cursorrules');
  if (!fs.existsSync(cursorRulesPath) || options.force) {
    fs.writeFileSync(cursorRulesPath, `# Cursor Rules Adapter (Orchestra Multi-Agent)
Always read and strictly adhere to AGENTS.md and .agents/ORCHESTRATOR.md before executing code.
Follow the 4-step execution lifecycle: Intent Triage -> Skill Resolution -> Phased SOP -> Pre-Flight Verification.
Enforce Anti-Slop visual standards and Full Output generation (no truncation/TODO placeholders).
`, 'utf8');
  }

  const claudeRulesPath = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(claudeRulesPath) || options.force) {
    fs.writeFileSync(claudeRulesPath, `# Claude Code Master Directive (Orchestra Multi-Agent)
This repository is governed by the Orchestra multi-agent architecture.
Always read AGENTS.md and .agents/ORCHESTRATOR.md before performing tasks.
Mandatory Skill Resolution: Refer to .agents/SKILL_ROUTER.md.
`, 'utf8');
  }

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

// Argument Parser
const rawArgs = process.argv.slice(2);
let command = 'help';
const options = {
  preset: null,
  yes: false,
  force: false,
  dryRun: false,
};

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === 'init' || arg === 'setup-global' || arg === 'install-skills' || arg === 'list-skills' || arg === 'help') {
    command = arg;
  } else if (arg === '-v' || arg === '--version' || arg === 'version') {
    command = 'version';
  } else if (arg === '-h' || arg === '--help') {
    command = 'help';
  } else if (arg === '-y' || arg === '--yes') {
    options.yes = true;
  } else if (arg === '-f' || arg === '--force') {
    options.force = true;
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg === '-p' || arg === '--preset') {
    options.preset = rawArgs[++i];
  } else if (arg.startsWith('--preset=')) {
    options.preset = arg.split('=')[1];
  }
}

// Main Router
switch (command) {
  case 'version':
    console.log(`v${PKG_VERSION}`);
    break;
  case 'init':
    initCommand(options).catch(err => {
      console.error(`${colors.red}Initialization failed:${colors.reset}`, err.message);
      process.exit(1);
    });
    break;
  case 'setup-global':
  case 'install-skills':
    setupGlobal().catch(console.error);
    break;
  case 'list-skills':
    listSkills().catch(console.error);
    break;
  case 'help':
  default:
    showHelp();
    break;
}
