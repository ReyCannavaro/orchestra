/**
 * Model Context Protocol (MCP) Tool Definitions for Orchestra
 */

export const ORCHESTRA_MCP_TOOLS = [
  {
    name: 'orchestra_resolve_skill',
    description: 'Resolve and retrieve specialized architectural guidelines and rules based on task description without bloating context window.',
    inputSchema: {
      type: 'object',
      properties: {
        task_description: {
          type: 'string',
          description: 'Detailed description of the programming or design task being performed.',
        },
        files_involved: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of file paths that will be created or edited.',
        },
      },
      required: ['task_description'],
    },
  },
  {
    name: 'orchestra_acquire_baton',
    description: 'Acquire the Baton mutation lock for a specific agent role (Single-Writer Invariant). Ensures safe multi-agent execution.',
    inputSchema: {
      type: 'object',
      properties: {
        agent_role: {
          type: 'string',
          description: 'The role of the agent acquiring the baton (e.g. conductor, frontend-engineer, backend-engineer, devops, qa).',
        },
        task_intent: {
          type: 'string',
          description: 'Brief description of the specific phase or task to be performed.',
        },
        target_files: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of files the agent intends to mutate.',
        },
      },
      required: ['agent_role', 'task_intent'],
    },
  },
  {
    name: 'orchestra_release_baton',
    description: 'Release the Baton mutation lock, mark roadmap progress, record touched files, and log architectural decisions (ADRs).',
    inputSchema: {
      type: 'object',
      properties: {
        summary_of_work: {
          type: 'string',
          description: 'Summary of completed work during this baton possession.',
        },
        step_completed: {
          type: 'number',
          description: 'Optional roadmap step number to mark as completed.',
        },
        modified_files: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of files modified during this session.',
        },
        architectural_decisions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key technical/architectural decisions made to be preserved in docs/ADR.md.',
        },
      },
    },
  },
  {
    name: 'orchestra_verify_diff',
    description: 'Verify modified source code against Orchestra Quality Gatekeepers (Anti-Slop visual checks, Anti-Truncation, and Compiler integrity).',
    inputSchema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of specific file paths to verify. Defaults to git changed files.',
        },
        fast: {
          type: 'boolean',
          description: 'If true, skips slow compiler steps and only runs AST/regex rules.',
        },
      },
    },
  },
  {
    name: 'orchestra_session_status',
    description: 'Retrieve current active Baton session state, active roadmap steps, current baton holder, and recorded ADRs.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'orchestra_list_skills',
    description: 'List or search all available skills in the Orchestra ecosystem with their descriptions and tags.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Optional search keyword to filter skills (e.g. design, testing, auth, mobile).',
        },
      },
    },
  },
];
