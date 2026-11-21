import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const REGISTRY_PATH = path.join(REPO_ROOT, 'registry', 'index.json');
const REMOTE_REGISTRY_URL = 'https://raw.githubusercontent.com/ReyCannavaro/orchestra/main/registry/index.json';

/**
 * Returns registry skills either from local registry/index.json or remote GitHub CDN
 */
export async function getRegistrySkills(options = {}) {
  // 1. Try local registry file
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.skills)) {
        return data.skills;
      }
    } catch {}
  }

  // 2. Fallback to remote CDN if available
  if (typeof fetch === 'function' && !options.offline) {
    try {
      const res = await fetch(REMOTE_REGISTRY_URL, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.skills)) {
          return data.skills;
        }
      }
    } catch {}
  }

  // 3. Fallback scan core-skills directory directly
  const coreSkillsDir = path.join(REPO_ROOT, 'core-skills');
  if (fs.existsSync(coreSkillsDir)) {
    return fs.readdirSync(coreSkillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => ({
        name: d.name,
        version: '1.0.0',
        description: `Orchestra Core Skill: ${d.name}`,
        entrypoint: 'SKILL.md',
      }));
  }

  return [];
}

/**
 * Find skill by exact or partial name in registry
 */
export async function findSkillInRegistry(name) {
  const skills = await getRegistrySkills();
  const lower = name.toLowerCase().trim();
  return skills.find(s => s.name.toLowerCase() === lower);
}
