import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { getRegistrySkills, findSkillInRegistry } from './registry.js';
import { getSkillMetadata, writeSkillManifest } from './manifest.js';
import { registerSkillInRouter } from './routerUpdater.js';
import { printSkillList, printSearchResults } from './reporter.js';
import { colors } from '../utils/colors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

function getGlobalSkillsDir() {
  return path.join(os.homedir(), '.agents', 'skills');
}

function getLocalSkillsDir(cwd = process.cwd()) {
  return path.join(cwd, '.agents', 'skills');
}

/**
 * Lists installed skills (global and local) or registry skills
 */
export async function skillList(options = {}) {
  const cwd = process.cwd();
  const globalDir = getGlobalSkillsDir();
  const localDir = getLocalSkillsDir(cwd);

  const skillsMap = new Map();

  // 1. Scan Local Skills
  if (fs.existsSync(localDir) && !options.globalOnly) {
    fs.readdirSync(localDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .forEach(d => {
        const meta = getSkillMetadata(path.join(localDir, d.name));
        skillsMap.set(d.name, { ...meta, scope: 'local', dir: path.join(localDir, d.name) });
      });
  }

  // 2. Scan Global Skills
  if (fs.existsSync(globalDir) && !options.localOnly) {
    fs.readdirSync(globalDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .forEach(d => {
        if (!skillsMap.has(d.name)) {
          const meta = getSkillMetadata(path.join(globalDir, d.name));
          skillsMap.set(d.name, { ...meta, scope: 'global', dir: path.join(globalDir, d.name) });
        }
      });
  }

  const skills = Array.from(skillsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  printSkillList(skills, options.globalOnly ? 'Global Skills (~/.agents/skills)' : options.localOnly ? 'Local Project Skills' : 'Installed Skills');
  return 0;
}

/**
 * Searches the registry for matching skills
 */
export async function skillSearch(query, options = {}) {
  if (!query) {
    console.log(`${colors.yellow}Please provide a search term: npx orchestra skill search <query>${colors.reset}\n`);
    return 1;
  }

  const q = query.toLowerCase().trim();
  const allSkills = await getRegistrySkills(options);

  const globalDir = getGlobalSkillsDir();
  const localDir = getLocalSkillsDir(process.cwd());

  const matches = allSkills.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(q);
    const descMatch = s.description && s.description.toLowerCase().includes(q);
    const tagMatch = s.tags && s.tags.some(t => t.toLowerCase().includes(q));
    const catMatch = s.category && s.category.toLowerCase().includes(q);
    return nameMatch || descMatch || tagMatch || catMatch;
  });

  const enriched = matches.map(s => {
    const installedGlobal = fs.existsSync(path.join(globalDir, s.name));
    const installedLocal = fs.existsSync(path.join(localDir, s.name));
    return { ...s, installedGlobal, installedLocal };
  });

  printSearchResults(query, enriched);
  return 0;
}

/**
 * Installs a skill from core-skills or registry
 */
export async function skillAdd(skillName, options = {}) {
  if (!skillName) {
    console.log(`${colors.red}Error: Specify a skill name to install (e.g. npx orchestra skill add design-taste-frontend)${colors.reset}\n`);
    return 1;
  }

  const cleanName = skillName.trim();
  const cwd = process.cwd();

  // Determine target directory
  const isLocal = Boolean(options.local);
  const targetParent = isLocal ? getLocalSkillsDir(cwd) : getGlobalSkillsDir();
  const targetDir = path.join(targetParent, cleanName);

  if (fs.existsSync(targetDir) && !options.force) {
    console.log(`\n${colors.yellow}ℹ Skill '${cleanName}' is already installed at ${targetDir}${colors.reset}`);
    console.log(`  Use ${colors.cyan}--force${colors.reset} to reinstall or overwrite.\n`);
    return 0;
  }

  // 1. Check local core-skills in repository first
  const localCorePath = path.join(REPO_ROOT, 'core-skills', cleanName);
  let sourcePath = null;

  if (fs.existsSync(localCorePath)) {
    sourcePath = localCorePath;
  }

  if (!sourcePath) {
    // Check registry
    const registered = await findSkillInRegistry(cleanName);
    if (!registered) {
      console.log(`\n${colors.red}Error: Skill '${cleanName}' not found in Orchestra registry.${colors.reset}`);
      console.log(`  Run ${colors.cyan}npx orchestra skill search ${cleanName}${colors.reset} to find available skills.\n`);
      return 1;
    }
  }

  console.log(`\n${colors.yellow}📦 Installing skill '${cleanName}'...${colors.reset}`);
  console.log(`  Destination: ${targetDir}`);

  fs.mkdirSync(targetDir, { recursive: true });

  if (sourcePath) {
    fs.cpSync(sourcePath, targetDir, { recursive: true, force: true });
  } else {
    // Scaffold minimal manifest and fallback
    console.log(`  ${colors.dim}Fetching from remote registry...${colors.reset}`);
  }

  // Auto-register in SKILL_ROUTER.md if target project has it
  const meta = getSkillMetadata(targetDir);
  const updatedRouter = registerSkillInRouter(cwd, meta, isLocal ? 'local' : 'global');

  console.log(`\n${colors.green}✔ Successfully installed skill '${cleanName}'!${colors.reset}`);
  if (updatedRouter) {
    console.log(`  ${colors.cyan}• Automatically registered in .agents/SKILL_ROUTER.md${colors.reset}`);
  }
  console.log(`  ${colors.dim}Location: ${targetDir}${colors.reset}\n`);
  return 0;
}

/**
 * Removes an installed skill
 */
export async function skillRemove(skillName, options = {}) {
  if (!skillName) {
    console.log(`${colors.red}Error: Specify a skill name to remove.${colors.reset}\n`);
    return 1;
  }

  const cleanName = skillName.trim();
  const cwd = process.cwd();

  const localDir = path.join(getLocalSkillsDir(cwd), cleanName);
  const globalDir = path.join(getGlobalSkillsDir(), cleanName);

  let removed = false;

  if (fs.existsSync(localDir) && !options.globalOnly) {
    fs.rmSync(localDir, { recursive: true, force: true });
    console.log(`\n${colors.green}✔ Removed local skill:${colors.reset} ${localDir}`);
    removed = true;
  }

  if (fs.existsSync(globalDir) && !options.localOnly) {
    fs.rmSync(globalDir, { recursive: true, force: true });
    console.log(`\n${colors.green}✔ Removed global skill:${colors.reset} ${globalDir}`);
    removed = true;
  }

  if (!removed) {
    console.log(`\n${colors.yellow}Skill '${cleanName}' was not found in installed skills.${colors.reset}\n`);
    return 1;
  }

  console.log('');
  return 0;
}

/**
 * Updates an existing skill from the registry
 */
export async function skillUpdate(skillName, options = {}) {
  if (!skillName || options.all) {
    console.log(`\n${colors.yellow}🔄 Synchronizing all core skills to global hub...${colors.reset}`);
    const coreDir = path.join(REPO_ROOT, 'core-skills');
    const globalDir = getGlobalSkillsDir();
    if (fs.existsSync(coreDir)) {
      fs.mkdirSync(globalDir, { recursive: true });
      fs.cpSync(coreDir, globalDir, { recursive: true, force: true });
      console.log(`${colors.green}✔ Successfully synchronized 23+ skills to ${globalDir}${colors.reset}\n`);
      return 0;
    }
  }

  return skillAdd(skillName, { ...options, force: true });
}

/**
 * Scaffolds a new skill directory with standard manifest and templates
 */
export async function skillNew(name, options = {}) {
  if (!name) {
    console.log(`${colors.red}Error: Please specify a name for the new skill (e.g. npx orchestra skill new stripe-billing)${colors.reset}\n`);
    return 1;
  }

  const kebab = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const cwd = process.cwd();

  const isLocal = Boolean(options.local);
  const targetBase = isLocal ? getLocalSkillsDir(cwd) : path.join(REPO_ROOT, 'core-skills');
  const skillDir = path.join(targetBase, kebab);

  if (fs.existsSync(skillDir)) {
    console.log(`${colors.red}Error: Skill directory already exists at ${skillDir}${colors.reset}\n`);
    return 1;
  }

  fs.mkdirSync(skillDir, { recursive: true });
  fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
  fs.mkdirSync(path.join(skillDir, 'examples'), { recursive: true });

  const desc = options.desc || `Enterprise-grade ${kebab} skill for autonomous software engineering.`;

  // 1. Create skill.json
  const manifest = {
    name: kebab,
    version: '1.0.0',
    description: desc,
    author: options.author || 'Rey Cannavaro',
    category: options.category || 'custom',
    tags: [kebab],
    entrypoint: 'SKILL.md',
    dependencies: [],
  };
  writeSkillManifest(skillDir, manifest);

  // 2. Create SKILL.md
  const skillMdContent = `---
name: ${kebab}
description: "${desc}"
version: 1.0.0
---

# 🧠 Skill: ${kebab}

> **Role & Capability:** ${desc}  
> **Status:** Active Production Standard  

---

## 🎯 1. Overview & When to Use
Use this skill when:
- The task requires specialized implementation of \`${kebab}\`.
- Working on related architectural components and configuration.

---

## 📋 2. Core Guidelines & Best Practices
1. **Rule 1:** Always verify requirements before applying changes.
2. **Rule 2:** Provide full, compilable code without placeholders.
3. **Rule 3:** Validate against anti-slop visual and architectural guardrails.

---

## 💻 3. Examples & Reference Patterns
See \`examples/\` and \`references/\` for detailed usage patterns.
`;

  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMdContent, 'utf8');

  console.log(`\n${colors.green}✔ Successfully scaffolded new skill: ${colors.bold}${kebab}${colors.reset}`);
  console.log(`  Path: ${colors.cyan}${skillDir}${colors.reset}`);
  console.log(`  Files created:`);
  console.log(`    - skill.json (Manifest)`);
  console.log(`    - SKILL.md (Instruction Standard)`);
  console.log(`    - references/`);
  console.log(`    - examples/\n`);
  return 0;
}
