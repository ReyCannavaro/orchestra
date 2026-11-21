import fs from 'node:fs';
import path from 'node:path';

export function getAgentsDir(cwd = process.cwd()) {
  return path.join(cwd, '.agents');
}

export function getBatonPath(cwd = process.cwd()) {
  return path.join(getAgentsDir(cwd), 'BATON.json');
}

export function ensureAgentsDir(cwd = process.cwd()) {
  const dir = getAgentsDir(cwd);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function loadBaton(cwd = process.cwd()) {
  const batonPath = getBatonPath(cwd);
  if (!fs.existsSync(batonPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(batonPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse ${batonPath}: ${err.message}`);
  }
}

export function saveBaton(cwd = process.cwd(), data) {
  ensureAgentsDir(cwd);
  const batonPath = getBatonPath(cwd);
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(batonPath, JSON.stringify(data, null, 2), 'utf8');
  return batonPath;
}

export function archiveBaton(cwd = process.cwd(), data) {
  const agentsDir = ensureAgentsDir(cwd);
  const historyDir = path.join(agentsDir, 'history');
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  const archivePath = path.join(historyDir, `${data.sessionId}.json`);
  fs.writeFileSync(archivePath, JSON.stringify(data, null, 2), 'utf8');
  return archivePath;
}

export function appendADR(cwd = process.cwd(), sessionData) {
  if (!sessionData.architecturalDecisions || sessionData.architecturalDecisions.length === 0) {
    return null;
  }

  const docsDir = path.join(cwd, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const adrPath = path.join(docsDir, 'ADR.md');
  const timestamp = new Date().toISOString().slice(0, 10);

  let header = '';
  if (!fs.existsSync(adrPath)) {
    header = `# 🏛️ Architectural Decision Records (ADR)\n\nDokumentasi keputusan arsitektur dan teknis yang diambil oleh tim & AI Agent.\n\n---\n\n`;
  }

  let entry = `## [${sessionData.sessionId}] ${sessionData.activeGoal}\n`;
  entry += `> **Tanggal:** ${timestamp} | **Conductor / Role:** \`${sessionData.baton.holder}\`\n\n`;
  entry += `### Keputusan Arsitektural:\n`;

  sessionData.architecturalDecisions.forEach(adr => {
    entry += `- ${adr}\n`;
  });

  if (sessionData.touchedFiles && sessionData.touchedFiles.length > 0) {
    entry += `\n### File yang Dimutasi:\n`;
    sessionData.touchedFiles.forEach(f => {
      entry += `- \`${f}\`\n`;
    });
  }

  entry += `\n---\n\n`;

  fs.appendFileSync(adrPath, header + entry, 'utf8');
  return adrPath;
}
