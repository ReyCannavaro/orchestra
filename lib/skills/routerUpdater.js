import fs from 'node:fs';
import path from 'node:path';

/**
 * Appends a newly installed skill into .agents/SKILL_ROUTER.md if not already referenced
 */
export function registerSkillInRouter(cwd = process.cwd(), skillMetadata, installLocation = 'global') {
  const routerPath = path.join(cwd, '.agents', 'SKILL_ROUTER.md');
  if (!fs.existsSync(routerPath)) return false;

  try {
    let content = fs.readFileSync(routerPath, 'utf8');
    const skillName = skillMetadata.name;

    // Check if already referenced
    if (content.includes(`\`${skillName}\``)) {
      return false;
    }

    const locationPath = installLocation === 'local'
      ? `.agents/skills/${skillName}/SKILL.md`
      : `~/.agents/skills/${skillName}/SKILL.md`;

    const category = skillMetadata.category || 'General Capability';
    const desc = skillMetadata.description ? skillMetadata.description.slice(0, 50) + '...' : 'Specialized skill capability';

    // Find table end or append before combination rules
    const newRow = `| **${category}** | ${desc} | \`${skillName}\` | \`${locationPath}\` |\n`;

    if (content.includes('## 2. Aturan Kombinasi Skill')) {
      content = content.replace('## 2. Aturan Kombinasi Skill', `${newRow}\n---\n\n## 2. Aturan Kombinasi Skill`);
    } else {
      content += `\n${newRow}\n`;
    }

    fs.writeFileSync(routerPath, content, 'utf8');
    return true;
  } catch {
    return false;
  }
}
