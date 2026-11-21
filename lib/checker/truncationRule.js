import fs from 'node:fs';

const TRUNCATION_PATTERNS = [
  {
    // Matches line comment or comment after statement delimiter
    regex: /(?:^\s*|[;{}]\s*)\/\/\s*\.\.\.\s*(rest|existing|code|same|implement|remaining|other|here)/i,
    message: 'Forbidden code truncation placeholder detected (`// ... rest of code`)',
    level: 'error',
  },
  {
    regex: /(?:^\s*|[;{}]\s*)\/\*\s*\.\.\.\s*(rest|existing|code|remaining)?\s*\*\//i,
    message: 'Forbidden multiline truncation comment detected (`/* ... */`)',
    level: 'error',
  },
  {
    regex: /^\s*#\s*\.\.\.\s*(rest|existing|code|same|remaining)/i,
    message: 'Forbidden Python/Shell truncation placeholder detected (`# ... rest of code`)',
    level: 'error',
  },
  {
    regex: /^\s*<!--\s*\.\.\.\s*(rest|existing|code)?\s*-->/i,
    message: 'Forbidden HTML/JSX truncation comment detected (`<!-- ... -->`)',
    level: 'error',
  },
  {
    regex: /(?:^\s*|[;{}]\s*)\/\/\s*TODO\b(?!\s*\(human\))/i,
    message: 'Uncompleted AI TODO comment detected. Full code output is required.',
    level: 'error',
  },
  {
    regex: /(?:^\s*|[;{}]\s*)\/\/\s*FIXME\b(?!\s*\(human\))/i,
    message: 'Unresolved AI FIXME comment detected. Code must be completed without stubs.',
    level: 'error',
  },
  {
    regex: /(?:^\s*|[;{}]\s*)throw new (UnimplementedError|NotImplementedError|Error\(["']Not implemented["']\))/i,
    message: 'Unimplemented method/function stub detected.',
    level: 'error',
  },
];

/**
 * Scan files for code truncation and lazy placeholders
 */
export function scanTruncation(files, cwd = process.cwd()) {
  const violations = [];

  for (const filePath of files) {
    // Skip Markdown documents and JSON files for TODO checks (they often document TODOs or keywords)
    if (filePath.endsWith('.md') || filePath.endsWith('.json')) continue;

    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      // Ignore lines that are defining string constants or regex definitions
      const trimmed = line.trim();
      if (trimmed.startsWith('message:') || trimmed.startsWith('regex:') || trimmed.startsWith('description:')) {
        return;
      }

      for (const pattern of TRUNCATION_PATTERNS) {
        if (pattern.regex.test(line)) {
          violations.push({
            file: filePath,
            line: index + 1,
            rule: 'anti-truncation',
            level: pattern.level,
            message: pattern.message,
            snippet: line.trim(),
            suggestion: 'Implement the full logic or use explicit `// TODO(human): reason` if intentionally left for user.',
          });
        }
      }
    });
  }

  return violations;
}
