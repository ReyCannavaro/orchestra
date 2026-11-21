import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { loadBaton, saveBaton, ensureAgentsDir } from '../session/batonManager.js';
import { createInitialBaton } from '../session/schema.js';
import { scanTruncation } from '../checker/truncationRule.js';
import { scanAntiSlop } from '../checker/antiSlopRule.js';
import { getRegistrySkills } from '../skills/registry.js';
import { getTargetFiles } from '../utils/git.js';

function getSkillPath(skillName, cwd = process.cwd()) {
  const local = path.join(cwd, '.agents', 'skills', skillName);
  if (fs.existsSync(local)) return local;

  const globalDir = path.join(os.homedir(), '.agents', 'skills', skillName);
  if (fs.existsSync(globalDir)) return globalDir;

  return null;
}

export async function handleResolveSkill(args, cwd = process.cwd()) {
  const desc = (args.task_description || '').toLowerCase();
  const files = (args.files_involved || []).join(' ').toLowerCase();
  const contextText = `${desc} ${files}`;

  const resolved = [];

  // Keyword to Skill resolution mapping
  const mappings = [
    { keywords: ['ui', 'landing', 'css', 'tailwind', 'component', 'frontend', 'layout', 'header', 'card'], skill: 'design-taste-frontend' },
    { keywords: ['responsive', 'mobile', 'breakpoint', 'screen', 'drawer', 'navbar'], skill: 'responsive-craft' },
    { keywords: ['brutalist', 'swiss', 'industrial', 'raw'], skill: 'industrial-brutalist-ui' },
    { keywords: ['minimalist', 'clean', 'monochrome'], skill: 'minimalist-ui' },
    { keywords: ['brand', 'logo', 'palette', 'token'], skill: 'brandkit' },
    { keywords: ['browser', 'playwright', 'scraping', 'e2e'], skill: 'browser-use' },
    { keywords: ['mcp', 'protocol', 'tool'], skill: 'mcp-integration' },
    { keywords: ['refactor', 'redesign', 'upgrade'], skill: 'redesign-existing-projects' },
    { keywords: ['image', 'mockup', 'screenshot', 'figma'], skill: 'image-to-code' },
    { keywords: ['research', 'citation', 'valyu', 'data'], skill: 'valyu-best-practices' },
  ];

  for (const map of mappings) {
    if (map.keywords.some(k => contextText.includes(k))) {
      resolved.push(map.skill);
    }
  }

  // Always include full-output-enforcement for significant code edits
  resolved.push('full-output-enforcement');

  const uniqueSkills = [...new Set(resolved)];
  let output = `🎻 Orchestra Skill Resolution:\nIdentified ${uniqueSkills.length} relevant skill guideline(s):\n\n`;

  for (const skillName of uniqueSkills) {
    const skillDir = getSkillPath(skillName, cwd);
    if (skillDir) {
      const skillMd = path.join(skillDir, 'SKILL.md');
      if (fs.existsSync(skillMd)) {
        try {
          const content = fs.readFileSync(skillMd, 'utf8');
          output += `══════ SKILL: ${skillName.toUpperCase()} ══════\n${content.slice(0, 3000)}\n\n`;
        } catch {}
      }
    } else {
      output += `• Skill '${skillName}' recommended. (Install with: npx orchestra skill add ${skillName})\n`;
    }
  }

  return {
    content: [{ type: 'text', text: output }],
  };
}

export async function handleAcquireBaton(args, cwd = process.cwd()) {
  let session = loadBaton(cwd);
  const now = new Date().toISOString();

  if (!session) {
    session = createInitialBaton(args.task_intent || 'Autonomous Engineering Session', {
      role: args.agent_role,
    });
  } else {
    session.baton = {
      holder: args.agent_role || 'conductor',
      acquiredAt: now,
      status: 'in_progress',
    };
    if (args.task_intent) {
      session.activeGoal = args.task_intent;
    }
  }

  if (args.target_files && Array.isArray(args.target_files)) {
    session.touchedFiles = [...new Set([...(session.touchedFiles || []), ...args.target_files])];
  }

  saveBaton(cwd, session);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            granted: true,
            sessionId: session.sessionId,
            batonHolder: session.baton.holder,
            activeGoal: session.activeGoal,
            currentPhase: session.currentPhase,
            roadmap: session.roadmap,
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function handleReleaseBaton(args, cwd = process.cwd()) {
  const session = loadBaton(cwd);
  if (!session) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: 'No active session found.' }) }],
    };
  }

  if (args.step_completed) {
    const targetStep = session.roadmap.find(s => s.step === args.step_completed);
    if (targetStep) {
      targetStep.status = 'completed';
      targetStep.verified = true;
      const nextStep = session.roadmap.find(s => s.step === args.step_completed + 1);
      if (nextStep && nextStep.status === 'pending') {
        nextStep.status = 'in_progress';
      }
    }
  }

  if (args.modified_files && Array.isArray(args.modified_files)) {
    session.touchedFiles = [...new Set([...(session.touchedFiles || []), ...args.modified_files])];
  }

  if (args.architectural_decisions && Array.isArray(args.architectural_decisions)) {
    session.architecturalDecisions = [
      ...(session.architecturalDecisions || []),
      ...args.architectural_decisions,
    ];
  }

  session.baton.status = 'idle';
  session.baton.releasedAt = new Date().toISOString();
  saveBaton(cwd, session);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            released: true,
            batonStatus: 'idle',
            sessionId: session.sessionId,
            summary: args.summary_of_work || 'Baton released.',
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function handleVerifyDiff(args, cwd = process.cwd()) {
  const targetFiles = args.files && args.files.length > 0
    ? args.files.map(f => path.resolve(cwd, f))
    : getTargetFiles(cwd, { fast: true });

  const truncationViolations = scanTruncation(targetFiles, cwd);
  const antiSlopViolations = scanAntiSlop(targetFiles, cwd);

  const errors = [
    ...truncationViolations.filter(v => v.level === 'error'),
    ...antiSlopViolations.filter(v => v.level === 'error'),
  ];

  const warnings = [
    ...truncationViolations.filter(v => v.level === 'warn'),
    ...antiSlopViolations.filter(v => v.level === 'warn'),
  ];

  const result = {
    passed: errors.length === 0,
    filesAnalyzed: targetFiles.length,
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    errors: errors.map(e => ({ file: path.relative(cwd, e.file), line: e.line, rule: e.rule, message: e.message })),
    warnings: warnings.map(w => ({ file: path.relative(cwd, w.file), line: w.line, rule: w.rule, message: w.message })),
  };

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}

export async function handleSessionStatus(args, cwd = process.cwd()) {
  const session = loadBaton(cwd);
  return {
    content: [
      {
        type: 'text',
        text: session ? JSON.stringify(session, null, 2) : 'No active Baton session in progress.',
      },
    ],
  };
}

export async function handleListSkills(args) {
  const allSkills = await getRegistrySkills();
  let filtered = allSkills;

  if (args.query) {
    const q = args.query.toLowerCase().trim();
    filtered = allSkills.filter(s =>
      s.name.includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.tags && s.tags.some(t => t.includes(q)))
    );
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
  };
}
