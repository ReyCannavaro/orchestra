import readline from 'node:readline';
import { ORCHESTRA_MCP_TOOLS } from './tools.js';
import {
  handleResolveSkill,
  handleAcquireBaton,
  handleReleaseBaton,
  handleVerifyDiff,
  handleSessionStatus,
  handleListSkills,
} from './handlers.js';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_NAME = 'orchestra-mcp';
const SERVER_VERSION = '2.0.0';

/**
 * Native JSON-RPC 2.0 Model Context Protocol (MCP) Server over STDIO
 */
export function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  // Log to stderr only so stdout is pure JSON-RPC
  process.stderr.write(`🎻 Orchestra MCP Server v${SERVER_VERSION} running on STDIO...\n`);

  rl.on('line', async line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let request;
    try {
      request = JSON.parse(trimmed);
    } catch (err) {
      sendError(null, -32700, 'Parse error: Invalid JSON');
      return;
    }

    try {
      await handleMessage(request);
    } catch (err) {
      sendError(request.id, -32603, `Internal server error: ${err.message}`);
    }
  });

  rl.on('close', () => {
    process.stderr.write('🎻 Orchestra MCP Server connection closed.\n');
    process.exit(0);
  });
}

async function handleMessage(request) {
  const { id, method, params } = request;

  // Notifications (no id)
  if (id === undefined || id === null) {
    if (method === 'notifications/initialized') {
      process.stderr.write('✔ Client handshake completed (notifications/initialized).\n');
    }
    return;
  }

  switch (method) {
    case 'initialize':
      sendResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      });
      break;

    case 'ping':
      sendResult(id, {});
      break;

    case 'tools/list':
      sendResult(id, {
        tools: ORCHESTRA_MCP_TOOLS,
      });
      break;

    case 'tools/call':
      {
        const { name, arguments: args = {} } = params || {};
        let result;

        switch (name) {
          case 'orchestra_resolve_skill':
            result = await handleResolveSkill(args);
            break;
          case 'orchestra_acquire_baton':
            result = await handleAcquireBaton(args);
            break;
          case 'orchestra_release_baton':
            result = await handleReleaseBaton(args);
            break;
          case 'orchestra_verify_diff':
            result = await handleVerifyDiff(args);
            break;
          case 'orchestra_session_status':
            result = await handleSessionStatus(args);
            break;
          case 'orchestra_list_skills':
            result = await handleListSkills(args);
            break;
          default:
            sendError(id, -32601, `Unknown tool: ${name}`);
            return;
        }

        sendResult(id, result);
      }
      break;

    default:
      sendError(id, -32601, `Method not found: ${method}`);
      break;
  }
}

function sendResult(id, result) {
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    id,
    result,
  });
  process.stdout.write(payload + '\n');
}

function sendError(id, code, message) {
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
    },
  });
  process.stdout.write(payload + '\n');
}
