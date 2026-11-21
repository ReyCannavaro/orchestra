/**
 * Default Schema and Initializer for .agents/BATON.json
 */

export const BATON_VERSION = '2.0.0';

export function createInitialBaton(goal = 'General Engineering Task', options = {}) {
  const now = new Date().toISOString();
  const dateStr = now.slice(0, 10).replace(/-/g, '');
  const timeStr = now.slice(11, 16).replace(/:/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const sessionId = `ses_${dateStr}_${timeStr}_${randomSuffix}`;

  // Default 4-step Symphony lifecycle if no custom steps provided
  const rawSteps = options.steps && options.steps.length > 0
    ? options.steps
    : [
        'Intent Triage & Requirement Analysis',
        'Architecture Design & Skill Resolution',
        'Phased Implementation & Integration',
        'Pre-Flight Verification & Quality Check',
      ];

  const roadmap = rawSteps.map((title, idx) => ({
    step: idx + 1,
    title,
    status: idx === 0 ? 'in_progress' : 'pending',
    verified: false,
    updatedAt: now,
  }));

  return {
    orchestraVersion: BATON_VERSION,
    sessionId,
    activeGoal: goal,
    createdAt: now,
    updatedAt: now,
    currentPhase: '1_intent_triage',
    baton: {
      holder: options.role || 'conductor',
      acquiredAt: now,
      status: 'in_progress', // 'idle' | 'in_progress' | 'blocked' | 'completed'
    },
    roadmap,
    touchedFiles: [],
    architecturalDecisions: [],
  };
}
