import { runChecker } from '../checker/index.js';
import { setupIdeMcpConfig } from '../mcp/ideConfig.js';
import { loadBaton, saveBaton } from '../session/batonManager.js';
import { colors } from '../utils/colors.js';

export async function handleAction(key, state, cwd = process.cwd()) {
  const k = key.toLowerCase();

  switch (k) {
    case 'c': {
      console.log(`\n${colors.cyan}Running Orchestra Quality Gatekeeper...${colors.reset}`);
      const code = await runChecker({ fast: true });
      return {
        message: code === 0
          ? `${colors.green}${colors.bold}✔ Quality Gatekeeper: All checks PASSED!${colors.reset}`
          : `${colors.red}${colors.bold}✖ Quality Gatekeeper: Errors detected!${colors.reset}`,
      };
    }

    case 'b': {
      const session = loadBaton(cwd);
      if (!session) {
        return { message: `${colors.yellow}No active session to advance. Start one first.${colors.reset}` };
      }

      const activeStep = session.roadmap.find(s => s.status === 'in_progress');
      if (activeStep) {
        activeStep.status = 'completed';
        activeStep.verified = true;
        const nextStep = session.roadmap.find(s => s.step === activeStep.step + 1);
        if (nextStep && nextStep.status === 'pending') {
          nextStep.status = 'in_progress';
        }
        saveBaton(cwd, session);
        return {
          message: `${colors.green}✔ Advanced Step ${activeStep.step} (${activeStep.title}) to COMPLETED.${colors.reset}`,
        };
      } else {
        return { message: `${colors.blue}All roadmap steps are already completed!${colors.reset}` };
      }
    }

    case 'm': {
      setupIdeMcpConfig(cwd);
      return { message: `${colors.green}✔ Cursor & IDE MCP Configuration updated!${colors.reset}` };
    }

    case 'r':
    default:
      return { message: `${colors.cyan}Dashboard refreshed.${colors.reset}` };
  }
}
