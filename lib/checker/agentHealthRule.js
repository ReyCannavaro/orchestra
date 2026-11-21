import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const REQUIRED_FILES = [
  { path: 'AGENTS.md', desc: 'Root Universal Directive (Score)' },
  { path: path.join('.agents', 'ORCHESTRATOR.md'), desc: '4-Step Lifecycle Orchestrator (Conductor)' },
  { path: path.join('.agents', 'SKILL_ROUTER.md'), desc: 'Dynamic Skill Router' },
  { path: path.join('.agents', 'WORKFLOWS.md'), desc: 'Domain SOPs' },
  { path: path.join('.agents', 'rules', 'anti-slop.md'), desc: 'Anti-Slop Quality Guardrail' },
  { path: path.join('.agents', 'rules', 'full-output.md'), desc: 'Full Output Enforcement Rule' },
];

const RECOMMENDED_BRIDGES = [
  { path: '.cursorrules', desc: 'Cursor IDE Adapter' },
  { path: 'CLAUDE.md', desc: 'Claude Code Bridge' },
];

/**
 * Validates the existence and health of Orchestra agent architecture
 */
export function checkAgentHealth(cwd = process.cwd()) {
  const issues = [];
  const validFiles = [];

  // Check Core Files
  for (const item of REQUIRED_FILES) {
    const fullPath = path.join(cwd, item.path);
    if (!fs.existsSync(fullPath)) {
      issues.push({
        type: 'missing_core',
        level: 'error',
        file: item.path,
        message: `Missing core Orchestra file: ${item.path} (${item.desc}).`,
        suggestion: `Run 'npx orchestra init' to scaffold missing files.`,
      });
    } else {
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        issues.push({
          type: 'empty_file',
          level: 'error',
          file: item.path,
          message: `Core file ${item.path} is empty!`,
          suggestion: `Restore template content from Orchestra.`,
        });
      } else {
        validFiles.push({ path: item.path, desc: item.desc });
      }
    }
  }

  // Check IDE Bridges
  for (const bridge of RECOMMENDED_BRIDGES) {
    const fullPath = path.join(cwd, bridge.path);
    if (!fs.existsSync(fullPath)) {
      issues.push({
        type: 'missing_bridge',
        level: 'warn',
        file: bridge.path,
        message: `Missing IDE bridge: ${bridge.path} (${bridge.desc}).`,
        suggestion: `Run 'npx orchestra init --force' to generate multi-IDE adapters.`,
      });
    } else {
      validFiles.push({ path: bridge.path, desc: bridge.desc });
    }
  }

  // Check Skill Router Pointers
  const skillRouterPath = path.join(cwd, '.agents', 'SKILL_ROUTER.md');
  const userHome = os.homedir();
  const globalSkillsDir = path.join(userHome, '.agents', 'skills');
  const localSkillsDir = path.join(cwd, '.agents', 'skills');

  if (fs.existsSync(skillRouterPath)) {
    try {
      const content = fs.readFileSync(skillRouterPath, 'utf8');
      // Matches skills referenced in markdown table e.g. `design-taste-frontend`
      const matches = content.match(/`([a-z0-9-]+)`/g);
      if (matches) {
        const uniqueSkills = [...new Set(matches.map(m => m.replace(/`/g, '')))]
          .filter(s => !['view_file', 'ORCHESTRATOR.md', 'SKILL_ROUTER.md', 'WORKFLOWS.md'].includes(s));

        for (const skill of uniqueSkills) {
          const globalSkillPath = path.join(globalSkillsDir, skill);
          const localSkillPath = path.join(localSkillsDir, skill);
          if (!fs.existsSync(globalSkillPath) && !fs.existsSync(localSkillPath)) {
            issues.push({
              type: 'unresolved_skill',
              level: 'warn',
              file: '.agents/SKILL_ROUTER.md',
              message: `Skill '${skill}' referenced in SKILL_ROUTER is not installed globally or locally.`,
              suggestion: `Run 'npx orchestra setup-global' to synchronize all 23+ skills.`,
            });
          }
        }
      }
    } catch {}
  }

  return {
    isConfigured: validFiles.length >= 4,
    validFiles,
    issues,
  };
}
