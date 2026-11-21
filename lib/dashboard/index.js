import readline from 'node:readline';
import { fetchDashboardState } from './state.js';
import { renderDashboard } from './renderer.js';
import { handleAction } from './actions.js';
import { colors } from '../utils/colors.js';

export async function startDashboard(options = {}) {
  const cwd = process.cwd();

  // Non-interactive fallback (e.g. CI, pipe, non-TTY)
  if (!process.stdin.isTTY || options.static) {
    const state = fetchDashboardState(cwd);
    console.log(renderDashboard(state, 'Static snapshot mode'));
    return 0;
  }

  // Interactive TUI Mode
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  // Hide cursor
  process.stdout.write('\x1b[?25l');

  let state = fetchDashboardState(cwd);
  let statusMessage = `${colors.green}Connected to Orchestra v2.0.0${colors.reset}`;

  function refreshScreen() {
    state = fetchDashboardState(cwd);
    console.clear();
    process.stdout.write(renderDashboard(state, statusMessage));
  }

  refreshScreen();

  return new Promise(resolve => {
    async function onKeypress(str, key) {
      if (!key) return;

      // Handle Exit
      if ((key.ctrl && key.name === 'c') || key.name === 'q') {
        cleanup();
        console.clear();
        console.log(`\n${colors.cyan}🎻 Orchestra Mission Control closed.${colors.reset}\n`);
        resolve(0);
        return;
      }

      // Handle Actions
      const name = key.name || str;
      if (['c', 'b', 'm', 'r'].includes(name.toLowerCase())) {
        const res = await handleAction(name, state, cwd);
        statusMessage = res.message;
        refreshScreen();
      }
    }

    function cleanup() {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      // Show cursor
      process.stdout.write('\x1b[?25h\x1b[0m');
    }

    process.stdin.on('keypress', onKeypress);
  });
}
