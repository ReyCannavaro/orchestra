import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { colors } from '../utils/colors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BIN_ENTRY = path.join(REPO_ROOT, 'bin', 'index.js').replace(/\\/g, '/');

/**
 * Automatically configures IDEs to connect with Orchestra MCP Server
 */
export function setupIdeMcpConfig(cwd = process.cwd()) {
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  ${colors.bold}🔌 ORCHESTRA MCP MULTI-IDE CONFIGURATION GENERATOR${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  // 1. Cursor Setup (.cursor/mcp.json)
  const cursorDir = path.join(cwd, '.cursor');
  if (!fs.existsSync(cursorDir)) {
    fs.mkdirSync(cursorDir, { recursive: true });
  }

  const cursorMcpPath = path.join(cursorDir, 'mcp.json');
  let cursorConfig = { mcpServers: {} };

  if (fs.existsSync(cursorMcpPath)) {
    try {
      cursorConfig = JSON.parse(fs.readFileSync(cursorMcpPath, 'utf8'));
      cursorConfig.mcpServers = cursorConfig.mcpServers || {};
    } catch {}
  }

  cursorConfig.mcpServers.orchestra = {
    command: 'node',
    args: [BIN_ENTRY, 'mcp'],
  };

  fs.writeFileSync(cursorMcpPath, JSON.stringify(cursorConfig, null, 2), 'utf8');
  console.log(`  ${colors.green}✔ Configured Cursor IDE:${colors.reset} ${colors.cyan}${cursorMcpPath}${colors.reset}`);

  // 2. Claude Desktop / Claude Code Instructions
  const claudeConfigSnippet = {
    mcpServers: {
      orchestra: {
        command: 'node',
        args: [BIN_ENTRY, 'mcp'],
      },
    },
  };

  console.log(`\n  ${colors.bold}For Claude Desktop / Claude Code:${colors.reset}`);
  console.log(`  Add this block to your ${colors.yellow}claude_desktop_config.json${colors.reset}:`);
  console.log(`  ${colors.dim}${JSON.stringify(claudeConfigSnippet, null, 2)}${colors.reset}`);

  // 3. Antigravity & Gemini CLI Instructions
  console.log(`\n  ${colors.bold}For Google Antigravity & Gemini CLI:${colors.reset}`);
  console.log(`  Orchestra MCP tools are registered and available as native tools in your workspace.`);

  console.log(`\n${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.green}${colors.bold}✔ Setup complete!${colors.reset} AI assistants can now call Orchestra active tools directly.`);
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────────────${colors.reset}\n`);

  return 0;
}
