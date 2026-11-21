import { colors } from '../utils/colors.js';

export function printSkillList(skills, title = 'Installed Skills') {
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  ${colors.bold}🎻 ORCHESTRA SKILL REGISTRY: ${title.toUpperCase()} (${skills.length})${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  if (skills.length === 0) {
    console.log(`  ${colors.dim}No skills found.${colors.reset}\n`);
    return;
  }

  skills.forEach((s, idx) => {
    const scopeBadge = s.scope === 'local'
      ? `${colors.blue}${colors.bold}[LOCAL]${colors.reset} `
      : s.scope === 'global'
      ? `${colors.green}${colors.bold}[GLOBAL]${colors.reset}`
      : `${colors.dim}[REGISTRY]${colors.reset}`;

    const num = (idx + 1).toString().padStart(2, ' ');
    const name = `${colors.bold}${s.name.padEnd(26, ' ')}${colors.reset}`;
    const desc = s.description ? (s.description.length > 55 ? s.description.slice(0, 52) + '...' : s.description) : '';

    console.log(`  ${colors.cyan}${num}.${colors.reset} ${name} ${scopeBadge} ${colors.dim}${desc}${colors.reset}`);
  });

  console.log(`\n${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.dim}Tip: Run 'npx orchestra skill search <query>' or 'orchestra skill add <name>'${colors.reset}`);
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);
}

export function printSearchResults(query, results) {
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  ${colors.bold}🔍 ORCHESTRA SKILL SEARCH: "${query}" (${results.length} match${results.length === 1 ? '' : 'es'})${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  if (results.length === 0) {
    console.log(`  ${colors.yellow}No skills matched your search query "${query}".${colors.reset}`);
    console.log(`  ${colors.dim}Try broader terms like 'ui', 'design', 'agent', 'mcp', or 'browser'.${colors.reset}\n`);
    return;
  }

  results.forEach((s, idx) => {
    let statusText = `${colors.green}✔ Installed (Global)${colors.reset}`;
    if (s.installedLocal) statusText = `${colors.blue}✔ Installed (Local)${colors.reset}`;
    else if (!s.installedGlobal) statusText = `${colors.yellow}⬇ Available to Install${colors.reset}`;

    console.log(`  ${colors.bold}${idx + 1}. ${colors.cyan}${s.name}${colors.reset} ${colors.dim}(v${s.version || '1.0.0'})${colors.reset} • ${statusText}`);
    if (s.description) {
      console.log(`     ${s.description}`);
    }
    if (s.tags && s.tags.length > 0) {
      console.log(`     ${colors.dim}Tags: ${s.tags.join(', ')}${colors.reset}`);
    }
    console.log('');
  });

  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.dim}To install a skill: npx orchestra skill add <skill-name>${colors.reset}`);
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);
}
