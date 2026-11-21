import { colors } from '../utils/colors.js';

export function printBatonStatus(session) {
  if (!session) {
    console.log(`\n${colors.yellow}ℹ No active Baton session found.${colors.reset}`);
    console.log(`  To start a new session, run: ${colors.cyan}npx orchestra session start "Task Name"${colors.reset}\n`);
    return;
  }

  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  ${colors.bold}🎻 ORCHESTRA BATON PROTOCOL: ACTIVE SESSION STATUS${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`  ${colors.bold}Session ID:${colors.reset}    ${colors.cyan}${session.sessionId}${colors.reset}`);
  console.log(`  ${colors.bold}Active Goal:${colors.reset}   ${colors.bold}${session.activeGoal}${colors.reset}`);
  console.log(`  ${colors.bold}Current Phase:${colors.reset} ${session.currentPhase}`);

  // Baton Ownership
  const baton = session.baton || {};
  let statusBadge = `${colors.green}${colors.bold}ACTIVE${colors.reset}`;
  if (baton.status === 'completed') statusBadge = `${colors.blue}${colors.bold}COMPLETED${colors.reset}`;
  if (baton.status === 'idle') statusBadge = `${colors.yellow}${colors.bold}IDLE${colors.reset}`;
  if (baton.status === 'blocked') statusBadge = `${colors.red}${colors.bold}BLOCKED${colors.reset}`;

  console.log(`  ${colors.bold}Baton Holder:${colors.reset}  ${colors.magenta}${colors.bold}${baton.holder || 'None'}${colors.reset} [${statusBadge}]`);
  console.log(`  ${colors.bold}Acquired At:${colors.reset}   ${colors.dim}${baton.acquiredAt || 'N/A'}${colors.reset}\n`);

  // Roadmap Table
  console.log(`  ${colors.bold}📋 Execution Roadmap (${session.roadmap.length} steps):${colors.reset}`);
  session.roadmap.forEach(step => {
    let icon = `${colors.dim}[⏳]${colors.reset}`;
    let titleColor = colors.dim;

    if (step.status === 'completed') {
      icon = `${colors.green}${colors.bold}[✔]${colors.reset}`;
      titleColor = colors.reset;
    } else if (step.status === 'in_progress') {
      icon = `${colors.yellow}${colors.bold}[⚙]${colors.reset}`;
      titleColor = `${colors.bold}${colors.cyan}`;
    }

    const verifiedTag = step.verified ? ` ${colors.green}(verified)${colors.reset}` : '';
    console.log(`    ${icon} ${colors.bold}Step ${step.step}:${colors.reset} ${titleColor}${step.title}${colors.reset}${verifiedTag}`);
  });
  console.log('');

  // Touched Files
  if (session.touchedFiles && session.touchedFiles.length > 0) {
    console.log(`  ${colors.bold}📁 Touched Files (${session.touchedFiles.length}):${colors.reset}`);
    session.touchedFiles.slice(0, 10).forEach(f => {
      console.log(`    ${colors.dim}•${colors.reset} ${colors.cyan}${f}${colors.reset}`);
    });
    if (session.touchedFiles.length > 10) {
      console.log(`    ${colors.dim}... and ${session.touchedFiles.length - 10} more file(s)${colors.reset}`);
    }
    console.log('');
  }

  // Architectural Decisions
  if (session.architecturalDecisions && session.architecturalDecisions.length > 0) {
    console.log(`  ${colors.bold}🏛️ Architectural Decision Records (${session.architecturalDecisions.length}):${colors.reset}`);
    session.architecturalDecisions.forEach((adr, idx) => {
      console.log(`    ${colors.yellow}${idx + 1}.${colors.reset} ${adr}`);
    });
    console.log('');
  }

  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.dim}Commands: checkpoint (--step <N> --done), acquire <role>, release, end${colors.reset}`);
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);
}
