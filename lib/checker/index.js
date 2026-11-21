import fs from 'node:fs';
import path from 'node:path';
import { getTargetFiles } from '../utils/git.js';
import { scanTruncation } from './truncationRule.js';
import { scanAntiSlop } from './antiSlopRule.js';
import { runCompilerCheck } from './compilerRule.js';
import { checkAgentHealth } from './agentHealthRule.js';
import { printCheckSummary } from './reporter.js';
import { colors } from '../utils/colors.js';

export async function runChecker(options = {}) {
  const cwd = process.cwd();

  // 1. Gather target files
  const targetFiles = getTargetFiles(cwd, options);

  // 2. Run Rule 1: Anti-Truncation
  const truncationViolations = scanTruncation(targetFiles, cwd);

  // 3. Run Rule 2: Anti-Slop
  const antiSlopViolations = scanAntiSlop(targetFiles, cwd);

  // 4. Run Rule 3: Compiler check
  const compilerResults = runCompilerCheck(cwd, options);

  // 5. Run Rule 4: Agent Health check
  let agentHealth = checkAgentHealth(cwd);

  // Handle --fix mode for auto-fixable issues
  if (options.fix) {
    let fixedCount = 0;

    // Auto-fix missing IDE bridges if requested
    const cursorRulesPath = path.join(cwd, '.cursorrules');
    if (!fs.existsSync(cursorRulesPath)) {
      fs.writeFileSync(cursorRulesPath, `# Cursor Rules Adapter (Orchestra Multi-Agent)
Always read and strictly adhere to AGENTS.md and .agents/ORCHESTRATOR.md before executing code.
Follow the 4-step execution lifecycle: Intent Triage -> Skill Resolution -> Phased SOP -> Pre-Flight Verification.
Enforce Anti-Slop visual standards and Full Output generation (no truncation/TODO placeholders).
`, 'utf8');
      fixedCount++;
    }

    const claudeRulesPath = path.join(cwd, 'CLAUDE.md');
    if (!fs.existsSync(claudeRulesPath)) {
      fs.writeFileSync(claudeRulesPath, `# Claude Code Master Directive (Orchestra Multi-Agent)
This repository is governed by the Orchestra multi-agent architecture.
Always read AGENTS.md and .agents/ORCHESTRATOR.md before performing tasks.
Mandatory Skill Resolution: Refer to .agents/SKILL_ROUTER.md.
`, 'utf8');
      fixedCount++;
    }

    if (fixedCount > 0) {
      console.log(`\n${colors.green}✔ Auto-fix applied: Created ${fixedCount} missing configuration bridge(s).${colors.reset}`);
      agentHealth = checkAgentHealth(cwd);
    }
  }

  // 6. Generate and print diagnostic report
  const exitCode = printCheckSummary({
    cwd,
    targetFiles,
    truncationViolations,
    antiSlopViolations,
    compilerResults,
    agentHealth,
    options,
  });

  return exitCode;
}
