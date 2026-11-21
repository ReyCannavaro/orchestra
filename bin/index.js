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

import { runChecker } from '../lib/checker/index.js';
import { installGitHook, initCIWorkflow } from '../lib/hooks/installHook.js';
import {
  sessionStart,
  sessionStatus,
  sessionCheckpoint,
  sessionAcquire,
  sessionRelease,
  sessionEnd,
} from '../lib/session/index.js';
import {
  skillList,
  skillSearch,
  skillAdd,
  skillRemove,
  skillUpdate,
  skillNew,
  setupGlobalSkills,
} from '../lib/skills/index.js';
import { startMcpServer, setupIdeMcpConfig } from '../lib/mcp/index.js';
import { startDashboard } from '../lib/dashboard/index.js';
import { colors } from '../lib/utils/colors.js';

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
  npx orchestra <command> [subcommand] [options]

${colors.bold}CORE COMMANDS:${colors.reset}
  ${colors.green}init${colors.reset}                    Scaffold Orchestra multi-agent architecture in current repository
  ${colors.green}dashboard, ui${colors.reset}           Launch interactive Mission Control Terminal Dashboard
  ${colors.green}check, doctor${colors.reset}           Run Quality Gatekeeper (Anti-Slop, Anti-Truncation, Agent Health)
  ${colors.green}install-hook${colors.reset}            Install Git pre-commit guardrail hook to prevent bad commits
  ${colors.green}init-ci${colors.reset}                 Generate GitHub Actions CI workflow for PR verification
  ${colors.green}setup-global${colors.reset}            Install/Sync 23+ core skills to ~/.agents/skills (Global Hub)
  ${colors.green}version, -v${colors.reset}             Display Orchestra version
  ${colors.green}help, --help${colors.reset}            Show this help menu

${colors.bold}NATIVE MCP SERVER COMMANDS:${colors.reset}
  ${colors.green}mcp${colors.reset}                     Start the native JSON-RPC 2.0 Orchestra MCP Server on STDIO
  ${colors.green}mcp-setup${colors.reset}               Auto-configure IDEs (Cursor .cursor/mcp.json, Claude, Antigravity)

${colors.bold}SKILL PACKAGE MANAGER COMMANDS:${colors.reset}
  ${colors.green}skill list${colors.reset}              List installed skills (global & local project skills)
  ${colors.green}skill search <query>${colors.reset}    Search skills in the Orchestra registry by keyword/tag
  ${colors.green}skill add <name>${colors.reset}        Install a skill from registry (--global or --local)
  ${colors.green}skill remove <name>${colors.reset}     Remove an installed skill
  ${colors.green}skill update [name]${colors.reset}     Update installed skill(s) to latest version
  ${colors.green}skill new <name>${colors.reset}        Scaffold a new modular skill with standard manifest & templates

${colors.bold}BATON PROTOCOL & SESSION COMMANDS:${colors.reset}
  ${colors.green}session start <goal>${colors.reset}    Initialize an orchestrated task session with roadmap tracking
  ${colors.green}session status${colors.reset}          Display active session status, baton holder, roadmap, and ADRs
  ${colors.green}session checkpoint${colors.reset}      Update roadmap step, record touched files, or log an ADR
  ${colors.green}session acquire <role>${colors.reset}  Acquire baton lock for an agent role (frontend, backend, etc.)
  ${colors.green}session release${colors.reset}         Release current baton lock to idle state
  ${colors.green}session end${colors.reset}             Conclude session, run pre-flight check, and export ADRs

${colors.bold}OPTIONS (for skills):${colors.reset}
  ${colors.cyan}--global, -g${colors.reset}         Target global skill hub (~/.agents/skills)
  ${colors.cyan}--local, -l${colors.reset}          Target current project repository (.agents/skills)
  ${colors.cyan}--desc <text>${colors.reset}         Description for new skill (used with skill new)

${colors.bold}OPTIONS (for session checkpoint):${colors.reset}
  ${colors.cyan}--step <N>${colors.reset}              Target step number in the roadmap
  ${colors.cyan}--done, --completed${colors.reset}    Mark the target step as completed (advances next step)
  ${colors.cyan}--in-progress${colors.reset}          Mark the target step as in-progress
  ${colors.cyan}--touch <file>${colors.reset}         Record a modified file to session history
  ${colors.cyan}--adr <text>${colors.reset}           Record an Architectural Decision Record

${colors.bold}OPTIONS (for check / doctor):${colors.reset}
  ${colors.cyan}--staged${colors.reset}                  Only verify Git staged files (default for pre-commit)
  ${colors.cyan}--all${colors.reset}                     Verify all files across the repository
  ${colors.cyan}--fix${colors.reset}                     Automatically fix repairable configuration issues
  ${colors.cyan}--fast${colors.reset}                    Fast mode: run AST/regex checks, skip slow compilers
  ${colors.cyan}--run-linter${colors.reset}              Run project linter script (npm run lint) if configured

${colors.bold}OPTIONS (for init):${colors.reset}
  ${colors.cyan}-p, --preset <name>${colors.reset}       Specify preset: universal, nextjs-fullstack, flutter-mobile, monorepo
  ${colors.cyan}-y, --yes${colors.reset}                 Accept detected or specified preset without interactive prompt
  ${colors.cyan}-f, --force${colors.reset}               Overwrite existing files if already present
  ${colors.cyan}--dry-run${colors.reset}                 Simulate scaffolding without modifying files

${colors.bold}EXAMPLES:${colors.reset}
  $ npx orchestra mcp-setup
  $ npx orchestra mcp
  $ npx orchestra skill search stripe
  $ npx orchestra session start "Implement Lucia Authentication"
`);
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
let subcommand = null;
let positionalArg = null;
const options = {
  preset: null,
  yes: false,
  force: false,
  dryRun: false,
  staged: false,
  all: false,
  fix: false,
  fast: false,
  skipCompiler: false,
  runLinter: false,
  steps: null,
  role: null,
  step: null,
  done: false,
  completed: false,
  inProgress: false,
  touch: [],
  adr: [],
  skipCheck: false,
  globalOnly: false,
  localOnly: false,
  local: false,
  desc: '',
  author: '',
  category: '',
};

let i = 0;
while (i < rawArgs.length) {
  const arg = rawArgs[i];

  if (
    arg === 'init' ||
    arg === 'setup-global' ||
    arg === 'install-skills' ||
    arg === 'list-skills' ||
    arg === 'check' ||
    arg === 'doctor' ||
    arg === 'install-hook' ||
    arg === 'hook' ||
    arg === 'init-ci' ||
    arg === 'ci' ||
    arg === 'dashboard' ||
    arg === 'ui' ||
    arg === 'session' ||
    arg === 'baton' ||
    arg === 'skill' ||
    arg === 'skills' ||
    arg === 'mcp' ||
    arg === 'mcp-setup' ||
    arg === 'setup-mcp' ||
    arg === 'help'
  ) {
    command = arg;
    // Check if next arg is a subcommand
    if ((arg === 'session' || arg === 'baton' || arg === 'skill' || arg === 'skills') && i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith('-')) {
      subcommand = rawArgs[++i];
      if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith('-')) {
        positionalArg = rawArgs[++i];
      }
    }
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
  } else if (arg === '--staged') {
    options.staged = true;
  } else if (arg === '--all') {
    options.all = true;
  } else if (arg === '--fix') {
    options.fix = true;
  } else if (arg === '--fast' || arg === '--skip-compiler') {
    options.fast = true;
    options.skipCompiler = true;
  } else if (arg === '--run-linter') {
    options.runLinter = true;
  } else if (arg === '--done' || arg === '--completed') {
    options.done = true;
    options.completed = true;
  } else if (arg === '--in-progress') {
    options.inProgress = true;
  } else if (arg === '--skip-check') {
    options.skipCheck = true;
  } else if (arg === '-g' || arg === '--global') {
    options.globalOnly = true;
  } else if (arg === '-l' || arg === '--local') {
    options.localOnly = true;
    options.local = true;
  } else if (arg === '-p' || arg === '--preset') {
    options.preset = rawArgs[++i];
  } else if (arg.startsWith('--preset=')) {
    options.preset = arg.split('=')[1];
  } else if (arg === '--steps') {
    options.steps = rawArgs[++i].split(',').map(s => s.trim());
  } else if (arg === '--role') {
    options.role = rawArgs[++i];
  } else if (arg === '--step') {
    options.step = rawArgs[++i];
  } else if (arg === '--touch' || arg === '--file') {
    options.touch.push(rawArgs[++i]);
  } else if (arg === '--adr' || arg === '--decision') {
    options.adr.push(rawArgs[++i]);
  } else if (arg === '--desc') {
    options.desc = rawArgs[++i];
  } else if (arg === '--author') {
    options.author = rawArgs[++i];
  } else if (arg === '--category') {
    options.category = rawArgs[++i];
  }
  i++;
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

  case 'check':
  case 'doctor':
    runChecker(options)
      .then(code => {
        process.exit(code);
      })
      .catch(err => {
        console.error(`${colors.red}Quality check encountered an unexpected error:${colors.reset}`, err);
        process.exit(1);
      });
    break;

  case 'dashboard':
  case 'ui':
    startDashboard(options)
      .then(code => {
        process.exit(code);
      })
      .catch(err => {
        console.error(`${colors.red}Dashboard encountered an unexpected error:${colors.reset}`, err);
        process.exit(1);
      });
    break;

  case 'mcp':
    startMcpServer();
    break;

  case 'mcp-setup':
  case 'setup-mcp':
    {
      const code = setupIdeMcpConfig();
      process.exit(code);
    }
    break;

  case 'skill':
  case 'skills':
    {
      const sub = subcommand || 'list';
      switch (sub) {
        case 'list':
        case 'ls':
          skillList(options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Failed to list skills:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        case 'search':
        case 'find':
          skillSearch(positionalArg, options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Search failed:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        case 'add':
        case 'install':
        case 'i':
          skillAdd(positionalArg, options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Installation failed:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        case 'remove':
        case 'rm':
        case 'uninstall':
          skillRemove(positionalArg, options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Removal failed:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        case 'update':
        case 'up':
        case 'sync':
          skillUpdate(positionalArg, options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Update failed:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        case 'new':
        case 'create':
          skillNew(positionalArg, options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Scaffolding failed:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        default:
          console.log(`${colors.red}Unknown skill subcommand: '${sub}'${colors.reset}`);
          console.log(`Available subcommands: list, search, add, remove, update, new\n`);
          process.exit(1);
      }
    }
    break;

  case 'session':
  case 'baton':
    {
      const sub = subcommand || 'status';
      switch (sub) {
        case 'start':
          {
            const goal = positionalArg || 'General Development Task';
            const code = sessionStart(goal, options);
            process.exit(code);
          }
          break;

        case 'status':
          {
            const code = sessionStatus();
            process.exit(code);
          }
          break;

        case 'checkpoint':
          {
            const code = sessionCheckpoint(options);
            process.exit(code);
          }
          break;

        case 'acquire':
          {
            const role = positionalArg || options.role || 'conductor';
            const code = sessionAcquire(role, options);
            process.exit(code);
          }
          break;

        case 'release':
          {
            const code = sessionRelease(options);
            process.exit(code);
          }
          break;

        case 'end':
        case 'finish':
          sessionEnd(options)
            .then(code => process.exit(code))
            .catch(err => {
              console.error(`${colors.red}Failed to end session:${colors.reset}`, err);
              process.exit(1);
            });
          break;

        default:
          console.log(`${colors.red}Unknown session subcommand: '${sub}'${colors.reset}`);
          console.log(`Available subcommands: start, status, checkpoint, acquire, release, end\n`);
          process.exit(1);
      }
    }
    break;

  case 'install-hook':
  case 'hook':
    {
      const code = installGitHook();
      process.exit(code);
    }
    break;

  case 'init-ci':
  case 'ci':
    {
      const code = initCIWorkflow();
      process.exit(code);
    }
    break;

  case 'setup-global':
  case 'install-skills':
    setupGlobalSkills(options)
      .then(code => process.exit(code))
      .catch(console.error);
    break;

  case 'list-skills':
    skillList(options)
      .then(code => process.exit(code))
      .catch(console.error);
    break;

  case 'help':
  default:
    showHelp();
    break;
}
