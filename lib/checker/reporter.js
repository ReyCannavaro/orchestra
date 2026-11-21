import path from 'node:path';
import { colors, symbol } from '../utils/colors.js';

export function printCheckSummary(data) {
  const {
    cwd,
    targetFiles,
    truncationViolations,
    antiSlopViolations,
    compilerResults,
    agentHealth,
    options,
  } = data;

  const totalErrors =
    truncationViolations.filter(v => v.level === 'error').length +
    antiSlopViolations.filter(v => v.level === 'error').length +
    agentHealth.issues.filter(v => v.level === 'error').length +
    (compilerResults.results ? compilerResults.results.filter(r => !r.passed).length : 0);

  const totalWarnings =
    truncationViolations.filter(v => v.level === 'warn').length +
    antiSlopViolations.filter(v => v.level === 'warn').length +
    agentHealth.issues.filter(v => v.level === 'warn').length;

  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  ${colors.bold}🎻 ORCHESTRA QUALITY GATEKEEPER DIAGNOSTIC REPORT${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`  ${colors.bold}Workspace:${colors.reset} ${cwd}`);
  console.log(`  ${colors.bold}Scope:${colors.reset}     ${options.staged ? 'Git Staged Files' : options.all ? 'All Source Files' : 'Changed & Untracked Files'} (${targetFiles.length} files analyzed)\n`);

  // Section 1: Truncation
  if (truncationViolations.length === 0) {
    console.log(`  ${symbol('pass')} ${colors.bold}Anti-Truncation Guard:${colors.reset} Clean (No TODO or truncation stubs detected)`);
  } else {
    console.log(`  ${symbol('fail')} ${colors.bold}Anti-Truncation Guard:${colors.reset} ${colors.red}${truncationViolations.length} issue(s) detected${colors.reset}`);
  }

  // Section 2: Anti-Slop
  if (antiSlopViolations.length === 0) {
    console.log(`  ${symbol('pass')} ${colors.bold}Anti-Slop Visual Inspector:${colors.reset} Clean (High-end aesthetic compliance)`);
  } else {
    const errorCount = antiSlopViolations.filter(v => v.level === 'error').length;
    const sym = errorCount > 0 ? symbol('fail') : symbol('warn');
    console.log(`  ${sym} ${colors.bold}Anti-Slop Visual Inspector:${colors.reset} ${antiSlopViolations.length} issue(s) detected`);
  }

  // Section 3: Compiler
  if (compilerResults.skipped) {
    console.log(`  ${symbol('info')} ${colors.bold}Compiler & Linter:${colors.reset} ${colors.dim}Skipped (${compilerResults.reason || 'None configured'})${colors.reset}`);
  } else {
    const failedCompiler = compilerResults.results.filter(r => !r.passed);
    if (failedCompiler.length === 0) {
      console.log(`  ${symbol('pass')} ${colors.bold}Compiler & Linter:${colors.reset} Clean (${compilerResults.results.map(r => r.name).join(', ')})`);
    } else {
      console.log(`  ${symbol('fail')} ${colors.bold}Compiler & Linter:${colors.reset} ${colors.red}${failedCompiler.length} compilation failure(s)${colors.reset}`);
    }
  }

  // Section 4: Agent Health
  if (agentHealth.issues.length === 0) {
    console.log(`  ${symbol('pass')} ${colors.bold}Agent Configuration Health:${colors.reset} 100% Intact (${agentHealth.validFiles.length} files verified)`);
  } else {
    const agentErrors = agentHealth.issues.filter(i => i.level === 'error').length;
    const sym = agentErrors > 0 ? symbol('fail') : symbol('warn');
    console.log(`  ${sym} ${colors.bold}Agent Configuration Health:${colors.reset} ${agentHealth.issues.length} issue(s) found`);
  }

  console.log('');

  // Detailed Issue Breakdowns
  const allViolations = [
    ...truncationViolations.map(v => ({ ...v, category: 'Truncation Violation' })),
    ...antiSlopViolations.map(v => ({ ...v, category: 'Visual / Anti-Slop Violation' })),
  ];

  if (allViolations.length > 0) {
    console.log(`${colors.bold}${colors.red}── Detailed Code Violations (${allViolations.length}): ────────────────────────────────${colors.reset}\n`);
    allViolations.slice(0, 20).forEach((item, idx) => {
      const relFile = path.relative(cwd, item.file);
      const badgeColor = item.level === 'error' ? colors.red : colors.yellow;
      console.log(`  ${colors.bold}${idx + 1}. [${item.category}]${colors.reset} in ${colors.cyan}${relFile}:${item.line}${colors.reset}`);
      console.log(`     ${badgeColor}Message:${colors.reset} ${item.message}`);
      if (item.snippet) {
        console.log(`     ${colors.dim}Snippet:${colors.reset} \`${colors.italic}${item.snippet}${colors.reset}\``);
      }
      if (item.suggestion) {
        console.log(`     ${colors.green}Fix suggestion:${colors.reset} ${item.suggestion}`);
      }
      console.log('');
    });

    if (allViolations.length > 20) {
      console.log(`  ${colors.dim}... and ${allViolations.length - 20} more violation(s). Run on individual files to inspect.${colors.reset}\n`);
    }
  }

  if (agentHealth.issues.length > 0) {
    console.log(`${colors.bold}${colors.yellow}── Agent Configuration Alerts (${agentHealth.issues.length}): ─────────────────────────${colors.reset}\n`);
    agentHealth.issues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. [${issue.level.toUpperCase()}] ${issue.message}`);
      console.log(`     ${colors.green}Action:${colors.reset} ${issue.suggestion}\n`);
    });
  }

  if (compilerResults.results) {
    const failedCompiler = compilerResults.results.filter(r => !r.passed);
    if (failedCompiler.length > 0) {
      console.log(`${colors.bold}${colors.red}── Compiler / Linter Errors: ─────────────────────────────────────────${colors.reset}\n`);
      failedCompiler.forEach(fc => {
        console.log(`  ${colors.bold}${fc.name}:${colors.reset}`);
        console.log(`  ${colors.dim}${fc.error}${colors.reset}\n`);
      });
    }
  }

  // Final Verdict
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}`);
  if (totalErrors === 0) {
    console.log(`  ${colors.green}${colors.bold}✔ ALL QUALITY GATES PASSED!${colors.reset} Code is pristine and ready for commit.`);
    if (totalWarnings > 0) {
      console.log(`  ${colors.yellow}ℹ Note:${colors.reset} ${totalWarnings} non-blocking warning(s) were flagged.`);
    }
    console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);
    return 0;
  } else {
    console.log(`  ${colors.red}${colors.bold}✖ QUALITY CHECK FAILED:${colors.reset} ${totalErrors} blocking error(s) must be resolved.`);
    console.log(`  ${colors.dim}Tip: Run with --fix or resolve flagged lines before committing.${colors.reset}`);
    console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);
    return 1;
  }
}
