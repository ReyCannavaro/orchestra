import path from 'node:path';
import { createInitialBaton } from './schema.js';
import {
  loadBaton,
  saveBaton,
  archiveBaton,
  appendADR,
} from './batonManager.js';
import { printBatonStatus } from './reporter.js';
import { colors } from '../utils/colors.js';
import { runChecker } from '../checker/index.js';

export function sessionStart(goal, options = {}) {
  const cwd = process.cwd();
  const existing = loadBaton(cwd);

  if (existing && existing.baton && existing.baton.status === 'in_progress' && !options.force) {
    console.log(`\n${colors.yellow}⚠ Active Baton session already exists:${colors.reset} '${existing.activeGoal}' (${existing.sessionId})`);
    console.log(`  Use ${colors.cyan}npx orchestra session status${colors.reset} to inspect.`);
    console.log(`  Use ${colors.cyan}npx orchestra session end${colors.reset} to finish it, or pass ${colors.cyan}--force${colors.reset} to overwrite.\n`);
    return 1;
  }

  const session = createInitialBaton(goal || 'Engineering Task', options);
  saveBaton(cwd, session);

  console.log(`\n${colors.green}✔ Successfully initialized Orchestra Baton Session!${colors.reset}`);
  console.log(`  Session ID:   ${colors.cyan}${session.sessionId}${colors.reset}`);
  console.log(`  Active Goal:  ${colors.bold}${session.activeGoal}${colors.reset}`);
  console.log(`  Baton Holder: ${colors.magenta}${session.baton.holder}${colors.reset}`);
  console.log(`  Lockfile:     ${colors.dim}.agents/BATON.json${colors.reset}\n`);

  printBatonStatus(session);
  return 0;
}

export function sessionStatus() {
  const cwd = process.cwd();
  const session = loadBaton(cwd);
  printBatonStatus(session);
  return 0;
}

export function sessionCheckpoint(options = {}) {
  const cwd = process.cwd();
  const session = loadBaton(cwd);

  if (!session) {
    console.log(`\n${colors.red}Error: No active Baton session found.${colors.reset} Run 'npx orchestra session start' first.\n`);
    return 1;
  }

  let updated = false;

  // 1. Update Step Status
  if (options.step) {
    const stepNum = parseInt(options.step, 10);
    const targetStep = session.roadmap.find(s => s.step === stepNum);

    if (targetStep) {
      if (options.done || options.completed) {
        targetStep.status = 'completed';
        targetStep.verified = true;
        targetStep.updatedAt = new Date().toISOString();

        // Auto-advance next step to in_progress if currently pending
        const nextStep = session.roadmap.find(s => s.step === stepNum + 1);
        if (nextStep && nextStep.status === 'pending') {
          nextStep.status = 'in_progress';
          nextStep.updatedAt = new Date().toISOString();
        }

        console.log(`  ${colors.green}✔ Step ${stepNum} marked as COMPLETED:${colors.reset} ${targetStep.title}`);
        updated = true;
      } else if (options.inProgress) {
        targetStep.status = 'in_progress';
        targetStep.updatedAt = new Date().toISOString();
        console.log(`  ${colors.yellow}⚙ Step ${stepNum} marked as IN PROGRESS:${colors.reset} ${targetStep.title}`);
        updated = true;
      }
    } else {
      console.log(`${colors.yellow}⚠ Warning: Step ${stepNum} not found in roadmap.${colors.reset}`);
    }
  }

  // 2. Add Touched Files
  if (options.touch || options.file) {
    const files = Array.isArray(options.touch || options.file)
      ? (options.touch || options.file)
      : [options.touch || options.file];

    session.touchedFiles = session.touchedFiles || [];
    for (const file of files) {
      const cleanPath = path.normalize(file).replace(/\\/g, '/');
      if (!session.touchedFiles.includes(cleanPath)) {
        session.touchedFiles.push(cleanPath);
        console.log(`  ${colors.cyan}• Recorded touched file:${colors.reset} ${cleanPath}`);
        updated = true;
      }
    }
  }

  // 3. Record Architectural Decision (ADR)
  if (options.adr || options.decision) {
    const adrs = Array.isArray(options.adr || options.decision)
      ? (options.adr || options.decision)
      : [options.adr || options.decision];

    session.architecturalDecisions = session.architecturalDecisions || [];
    for (const adr of adrs) {
      session.architecturalDecisions.push(adr);
      console.log(`  ${colors.magenta}🏛️ Recorded Architectural Decision:${colors.reset} ${adr}`);
      updated = true;
    }
  }

  if (updated) {
    saveBaton(cwd, session);
    console.log(`\n${colors.green}✔ Checkpoint saved to .agents/BATON.json${colors.reset}\n`);
    return 0;
  } else {
    console.log(`\n${colors.dim}No checkpoint changes specified. Run with --step <N> --done, --touch <file>, or --adr <text>${colors.reset}\n`);
    return 0;
  }
}

export function sessionAcquire(role, options = {}) {
  const cwd = process.cwd();
  const session = loadBaton(cwd);

  if (!session) {
    console.log(`\n${colors.red}Error: No active Baton session found.${colors.reset}\n`);
    return 1;
  }

  const prevHolder = session.baton ? session.baton.holder : 'None';
  session.baton = {
    holder: role || 'conductor',
    status: 'in_progress',
    acquiredAt: new Date().toISOString(),
  };

  saveBaton(cwd, session);
  console.log(`\n${colors.green}✔ Baton acquired by role:${colors.reset} ${colors.bold}${colors.magenta}${session.baton.holder}${colors.reset} (Handed off from ${prevHolder})\n`);
  return 0;
}

export function sessionRelease(options = {}) {
  const cwd = process.cwd();
  const session = loadBaton(cwd);

  if (!session) {
    console.log(`\n${colors.red}Error: No active Baton session found.${colors.reset}\n`);
    return 1;
  }

  const holder = session.baton ? session.baton.holder : 'conductor';
  session.baton.status = 'idle';
  session.baton.releasedAt = new Date().toISOString();

  saveBaton(cwd, session);
  console.log(`\n${colors.yellow}✔ Baton released by role:${colors.reset} ${colors.bold}${holder}${colors.reset} (State: IDLE)\n`);
  return 0;
}

export async function sessionEnd(options = {}) {
  const cwd = process.cwd();
  const session = loadBaton(cwd);

  if (!session) {
    console.log(`\n${colors.yellow}No active Baton session to end.${colors.reset}\n`);
    return 0;
  }

  console.log(`\n${colors.yellow}🎼 Wrapping up Baton Session:${colors.reset} ${session.activeGoal} (${session.sessionId})...\n`);

  // Run Quality Gatekeeper verification if requested or by default unless skipped
  if (!options.skipCheck) {
    console.log(`${colors.cyan}Running pre-flight quality check before closing session...${colors.reset}`);
    const checkExit = await runChecker({ fast: true });
    if (checkExit !== 0 && !options.force) {
      console.log(`\n${colors.red}✖ Cannot finalize session:${colors.reset} Quality checks failed.`);
      console.log(`  Fix flagged issues or run ${colors.cyan}npx orchestra session end --force${colors.reset} to override.\n`);
      return 1;
    }
  }

  // Mark status completed
  session.baton.status = 'completed';
  session.completedAt = new Date().toISOString();

  // Archive session state
  const archivePath = archiveBaton(cwd, session);
  console.log(`  ${colors.green}✔ Session state archived:${colors.reset} ${archivePath}`);

  // Append ADR if any decisions were logged
  const adrPath = appendADR(cwd, session);
  if (adrPath) {
    console.log(`  ${colors.green}✔ Architectural Decisions exported to:${colors.reset} ${adrPath}`);
  }

  // Update BATON.json with completed session
  saveBaton(cwd, session);

  console.log(`\n${colors.green}${colors.bold}✔ Symphony completed successfully! Baton returned to conductor.${colors.reset}\n`);
  return 0;
}
