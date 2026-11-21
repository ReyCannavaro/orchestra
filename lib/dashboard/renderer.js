import { colors, symbol } from '../utils/colors.js';

export function renderDashboard(state, actionMessage = '') {
  const width = Math.min(Math.max(process.stdout.columns || 80, 78), 100);
  const borderLine = '─'.repeat(width - 2);

  let out = '';

  // Header Box
  out += `${colors.cyan}┌${borderLine}┐${colors.reset}\n`;
  out += `${colors.cyan}│${colors.reset} ${colors.bold}${colors.cyan}🎻 ORCHESTRA MISSION CONTROL v2.0.0${colors.reset}${' '.repeat(Math.max(1, width - 42))}By ${colors.bold}Rey Cannavaro${colors.reset} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Workspace & Stack Bar
  const wsTrunc = state.cwd.length > 35 ? '...' + state.cwd.slice(-32) : state.cwd;
  const mcpStatus = state.hasMcp ? `${colors.green}CONNECTED ✔${colors.reset}` : `${colors.yellow}NOT CONFIGURED${colors.reset}`;

  out += `${colors.cyan}│${colors.reset} ${colors.bold}Workspace:${colors.reset} ${colors.cyan}${wsTrunc.padEnd(35, ' ')}${colors.reset} ${colors.bold}Stack:${colors.reset} ${colors.magenta}${state.stack.padEnd(22, ' ')}${colors.reset} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}│${colors.reset} ${colors.bold}MCP Engine:${colors.reset} ${mcpStatus.padEnd(34, ' ')} ${colors.bold}Last Sync:${colors.reset} ${colors.dim}${state.timestamp.padEnd(18, ' ')}${colors.reset} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Middle Section: Health & Skills
  out += `${colors.cyan}│${colors.reset} ${colors.bold}📊 AGENT INTEGRITY & HEALTH${colors.reset}${' '.repeat(Math.max(1, Math.floor(width / 2) - 30))}│ ${colors.bold}🗺️ SKILLS INVENTORY${colors.reset}${' '.repeat(Math.max(1, width - Math.floor(width / 2) - 25))} ${colors.cyan}│${colors.reset}\n`;

  const healthErrors = state.agentHealth.issues.filter(i => i.level === 'error').length;
  const healthSym = healthErrors === 0 ? symbol('pass') : symbol('fail');
  const healthDesc = healthErrors === 0 ? `${colors.green}100% Intact (${state.agentHealth.validFiles.length} files)${colors.reset}` : `${colors.red}${healthErrors} error(s)${colors.reset}`;

  const globalText = `${colors.bold}${state.globalSkillsCount}${colors.reset} global skills`;
  const localText = `${colors.bold}${state.localSkillsCount}${colors.reset} local project skills`;

  out += `${colors.cyan}│${colors.reset} • Status: ${healthSym} ${healthDesc.padEnd(34, ' ')} │ • Global Hub: ${globalText.padEnd(28, ' ')} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}│${colors.reset} • Core Directives: ${colors.green}AGENTS.md + .agents/${colors.reset}  │ • Local Hub:  ${localText.padEnd(28, ' ')} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}│${colors.reset} • Multi-IDE:       ${colors.green}Cursor & Claude Bridge${colors.reset} │ • Registry:   ${colors.green}23 Core Skills available${colors.reset}  ${colors.cyan}│${colors.reset}\n`;

  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Baton Section
  out += `${colors.cyan}│${colors.reset} ${colors.bold}🎯 ACTIVE BATON PROTOCOL SESSION${colors.reset}${' '.repeat(Math.max(1, width - 36))} ${colors.cyan}│${colors.reset}\n`;

  if (state.session) {
    const s = state.session;
    const holder = s.baton ? s.baton.holder : 'None';
    const status = s.baton ? s.baton.status : 'idle';
    let statusBadge = `${colors.green}[ACTIVE]${colors.reset}`;
    if (status === 'completed') statusBadge = `${colors.blue}[COMPLETED]${colors.reset}`;

    out += `${colors.cyan}│${colors.reset} • Goal:   ${colors.bold}${s.activeGoal.slice(0, width - 15)}${colors.reset}\n`;
    out += `${colors.cyan}│${colors.reset} • Baton:  ${colors.magenta}${colors.bold}${holder}${colors.reset} ${statusBadge} • Phase: ${s.currentPhase}\n`;
    out += `${colors.cyan}│${colors.reset}\n`;

    out += `${colors.cyan}│${colors.reset}   ${colors.bold}Roadmap Progress:${colors.reset}\n`;
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
      const line = `     ${icon} Step ${step.step}: ${titleCol}${step.title}${colors.reset}`;
      out += `${colors.cyan}│${colors.reset}${line}\n`;
    });
  } else {
    out += `${colors.cyan}│${colors.reset} ${colors.dim}No active session. Start one with: npx orchestra session start "Goal"${colors.reset}\n`;
  }

  out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;

  // Status/Action Log Message
  if (actionMessage) {
    out += `${colors.cyan}│${colors.reset} ⚡ ${colors.bold}Status:${colors.reset} ${actionMessage}\n`;
    out += `${colors.cyan}├${borderLine}┤${colors.reset}\n`;
  }

  // Footer Navigation Bar
  out += `${colors.cyan}│${colors.reset} ${colors.bold}[C]${colors.reset} Check  ${colors.bold}[B]${colors.reset} Advance Baton  ${colors.bold}[M]${colors.reset} Setup MCP  ${colors.bold}[R]${colors.reset} Refresh  ${colors.bold}[Q]${colors.reset} Quit${' '.repeat(Math.max(1, width - 72))} ${colors.cyan}│${colors.reset}\n`;
  out += `${colors.cyan}└${borderLine}┘${colors.reset}\n`;

  return out;
}
