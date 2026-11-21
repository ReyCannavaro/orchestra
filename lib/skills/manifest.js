import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads skill.json manifest or extracts metadata from SKILL.md
 */
export function getSkillMetadata(skillDir) {
  const manifestPath = path.join(skillDir, 'skill.json');
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {}
  }

  // Fallback to SKILL.md
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  const baseName = path.basename(skillDir);
  const metadata = {
    name: baseName,
    version: '1.0.0',
    description: '',
    category: 'custom',
    tags: [],
    entrypoint: 'SKILL.md',
  };

  if (fs.existsSync(skillMdPath)) {
    try {
      const content = fs.readFileSync(skillMdPath, 'utf8');
      const descMatch = content.match(/description:\s*(.+)/i);
      if (descMatch) {
        metadata.description = descMatch[1].replace(/['"]/g, '').trim();
      }
      const nameMatch = content.match(/^name:\s*(.+)/im);
      if (nameMatch) {
        metadata.name = nameMatch[1].replace(/['"]/g, '').trim();
      }
    } catch {}
  }

  return metadata;
}

export function writeSkillManifest(skillDir, manifest) {
  const manifestPath = path.join(skillDir, 'skill.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  return manifestPath;
}
