import fs from 'node:fs';
import path from 'node:path';

const UI_EXTS = new Set(['.jsx', '.tsx', '.vue', '.svelte', '.html', '.css', '.scss', '.astro']);

const SLOP_PATTERNS = [
  {
    regex: /bg-gradient-to-[a-z]+\s+(from-purple-500\s+(via-[a-z0-9]+-[0-9]+\s+)?to-pink-500|from-pink-500\s+to-purple-500)/i,
    message: 'Generic AI-slop gradient detected (`purple-500 -> pink-500`). Use intentional, modern brand tokens.',
    suggestion: 'Replace with modern aesthetic palettes: slate/zinc monochrome, deep midnight, or electric indigo with subtle warmth.',
    level: 'error',
  },
  {
    regex: /linear-gradient\([^)]*#8b5cf6[^)]*#ec4899[^)]*\)/i,
    message: 'Generic AI-slop HEX gradient detected (#8b5cf6 -> #ec4899).',
    suggestion: 'Switch to a curated color system or subtle gradient with matching luminance.',
    level: 'error',
  },
  {
    regex: /shadow-2xl\s+shadow-(purple|indigo|pink|violet)-(500|600)(\/\d+)?/i,
    message: 'Aggressive bloated colored shadow detected. Violates high-end visual design guidelines.',
    suggestion: 'Use subtle border rings (`ring-1 ring-border`) or soft elevation (`shadow-sm`, `shadow-md`) instead of harsh neon glows.',
    level: 'warn',
  },
];

/**
 * Scan UI files for AI Slop patterns and visual anti-patterns
 */
export function scanAntiSlop(files, cwd = process.cwd()) {
  const violations = [];

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!UI_EXTS.has(ext)) continue;

    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      for (const pattern of SLOP_PATTERNS) {
        if (pattern.regex.test(line)) {
          violations.push({
            file: filePath,
            line: index + 1,
            rule: 'anti-slop',
            level: pattern.level,
            message: pattern.message,
            snippet: line.trim(),
            suggestion: pattern.suggestion,
          });
        }
      }

      // Check bare buttons with bg color but no hover/focus states
      if (line.includes('<button') && line.includes('className=') && /bg-(blue|indigo|emerald|purple|red|amber)-[5-7]00/.test(line)) {
        if (!line.includes('hover:') && !line.includes('focus:') && !line.includes('transition')) {
          violations.push({
            file: filePath,
            line: index + 1,
            rule: 'anti-slop-interaction',
            level: 'warn',
            message: 'Button element has background styling but lacks interactive states (`hover:`, `focus:`, `active:`).',
            snippet: line.trim(),
            suggestion: 'Add hover transitions and focus ring indicators (e.g. `hover:opacity-90 transition-all focus-visible:ring-2`).',
          });
        }
      }
    });
  }

  return violations;
}
