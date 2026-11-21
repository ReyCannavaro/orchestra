import { colors, symbol } from '../utils/colors.js';

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function renderDashboard(state, actionMessage = '') {
  const width = Math.min(Math.max(process.stdout.columns || 80, 80), 100);
  const borderLine = '─'.repeat(width - 2);
  const innerWidth = width - 4; // space between '│ ' and ' │'

  function line(content = '') {
    const visibleLen = stripAnsi(content).length;
    const padding = Math.max(0, innerWidth - visibleLen);
    return `${colors.cyan}│${colors.reset} ${content}${' '.repeat(padding)} ${colors.cyan}│${colors.reset}\n`;
  }

  function twoCol(left, right) {
    const colWidth = Math.floor((innerWidth - 3) / 2);
    const rightColWidth = innerWidth - colWidth - 3;

    const leftLen = stripAnsi(left).length;
    const rightLen = stripAnsi(right).length;

    const leftPad = Math.max(0, colWidth - leftLen);
    const rightPad = Math.max(0, rightColWidth - rightLen);

    const merged = `${left}${' '.repeat(leftPad)} ${colors.cyan}│${colors.reset} ${right}${' '.repeat(rightPad)}`;
    return `${colors.cyan}│${colors.reset} ${merged} ${colors.cyan}│${colors.reset}\n`;
  }

  let out = '';

  // Header Box
  out += `${colors.cyan}┌${borderLine}┐${colors.reset}\n`;
  const headerLeft = `${colors.bold}${colors.cyan}🎻 ORCHESTRA MISSION CONTROL v2.0.0${colors.reset}`;
  const headerRight = `By ${colors.bold}Rey Cannavaro${colors.reset}`;
  const headerSpacing = Math.max(1, innerWidth - stripAnsi(headerLeft).length - stripAnsi(headerRight).length);
  out += line(`${headerLeft}${' '.repeat(headerSpacing)}${headerRight}`);
  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Workspace & Stack Bar
  const wsTrunc = state.cwd.length > 28 ? '...' + state.cwd.slice(-25) : state.cwd;
  const mcpStatus = state.hasMcp ? `${colors.green}CONNECTED ✔${colors.reset}` : `${colors.yellow}NOT CONFIGURED${colors.reset}`;

  out += twoCol(
    `${colors.bold}Workspace:${colors.reset} ${colors.cyan}${wsTrunc}${colors.reset}`,
    `${colors.bold}Stack:${colors.reset} ${colors.magenta}${state.stack}${colors.reset}`
  );
  out += twoCol(
    `${colors.bold}MCP Engine:${colors.reset} ${mcpStatus}`,
    `${colors.bold}Last Sync:${colors.reset} ${colors.dim}${state.timestamp}${colors.reset}`
  );
  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Middle Section: Health & Skills
  out += twoCol(
    `${colors.bold}📊 AGENT INTEGRITY & HEALTH${colors.reset}`,
    `${colors.bold}🗺️ SKILLS INVENTORY${colors.reset}`
  );

  const healthErrors = state.agentHealth.issues.filter(i => i.level === 'error').length;
  const healthSym = healthErrors === 0 ? symbol('pass') : symbol('fail');
  const healthDesc = healthErrors === 0 ? `${colors.green}100% Intact (${state.agentHealth.validFiles.length} files)${colors.reset}` : `${colors.red}${healthErrors} error(s)${colors.reset}`;

  const globalText = `${colors.bold}${state.globalSkillsCount}${colors.reset} global skills`;
  const localText = `${colors.bold}${state.localSkillsCount}${colors.reset} local project skills`;

  out += twoCol(`• Status: ${healthSym} ${healthDesc}`, `• Global Hub: ${globalText}`);
  out += twoCol(`• Directives: ${colors.green}AGENTS.md${colors.reset}`, `• Local Hub:  ${localText}`);
  out += twoCol(`• Multi-IDE:  ${colors.green}Cursor & Claude Bridge${colors.reset}`, `• Registry:   ${colors.green}23 Core Skills${colors.reset}`);

  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Baton Section
  out += line(`${colors.bold}🎯 ACTIVE BATON PROTOCOL SESSION${colors.reset}`);

  if (state.session) {
    const s = state.session;
    const holder = s.baton ? s.baton.holder : 'None';
    const status = s.baton ? s.baton.status : 'idle';
    let statusBadge = `${colors.green}[ACTIVE]${colors.reset}`;
    if (status === 'completed') statusBadge = `${colors.blue}[COMPLETED]${colors.reset}`;

    out += line(`• Goal:   ${colors.bold}${s.activeGoal.slice(0, innerWidth - 12)}${colors.reset}`);
    out += line(`• Baton:  ${colors.magenta}${colors.bold}${holder}${colors.reset} ${statusBadge} • Phase: ${s.currentPhase}`);
    out += line('');

    out += line(`  ${colors.bold}Roadmap Progress:${colors.reset}`);
    s.roadmap.forEach(step => {
      let icon = `${colors.dim}[⏳]${colors.reset}`;
      let titleCol = colors.dim;
      if (step.status === 'completed') {
        icon = `${colors.green}[✔]${colors.reset}`;
        titleCol = colors.reset;
      } else if (step.status === 'in_progress') {
        icon = `${colors.yellow}[⚙]${colors.reset}`;
        titleCol = `${colors.bold}${colors.cyan}`;
      }
      out += line(`    ${icon} Step ${step.step}: ${titleCol}${step.title}${colors.reset}`);
    });
  } else {
    out += line(`${colors.dim}No active session. Start one with: npx orchestra session start "Goal"${colors.reset}`);
  }

  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Status/Action Log Message
  if (actionMessage) {
    out += line(`⚡ ${colors.bold}Status:${colors.reset} ${actionMessage}`);
    out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;
  }

  // Footer Navigation Bar
  out += line(`${colors.bold}[C]${colors.reset} Check  ${colors.bold}[B]${colors.reset} Advance Baton  ${colors.bold}[M]${colors.reset} Setup MCP  ${colors.bold}[R]${colors.reset} Refresh  ${colors.bold}[Q]${colors.reset} Quit`);
  out += `${colors.cyan}└${borderLine}┘${colors.reset}\n`;

  return out;
}
