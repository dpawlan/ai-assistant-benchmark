import { promises as fs } from 'fs';
import path from 'path';
import { Agent, AgentMeta, AgentScores, Category, Feedback, IndexData, RosterEntry } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

export function getIndexData(): IndexData {
  const indexJson = require('@/../data/index.json');
  return indexJson as IndexData;
}

export function getCategories(): Category[] {
  const categoriesJson = require('@/../data/categories.json');
  return categoriesJson as Category[];
}

export function getRoster(): RosterEntry[] {
  const indexData = getIndexData();
  return indexData.agents;
}

export function getAgents(): Agent[] {
  const roster = getRoster();
  return roster.map(entry => ({
    slug: entry.slug,
    name: entry.name,
    site: entry.site,
    status: entry.status,
    feedbackCount: entry.feedback_count,
    publicSignal: entry.public_signal,
  }));
}

export function getConfirmedAgents(): Agent[] {
  return getAgents().filter(agent => agent.status === 'confirmed');
}

export function getStretchAgents(): Agent[] {
  return getAgents().filter(agent => agent.status === 'stretch');
}

export function getCoreCategories(): Category[] {
  return getCategories().filter(cat => cat.group === 'core');
}

export function getEndorsedCategories(): Category[] {
  return getCategories().filter(cat => cat.group === 'endorsed');
}

export function getAllSlugs(): string[] {
  return getRoster().map(agent => agent.slug);
}

export async function getAgentDetail(slug: string): Promise<Agent | null> {
  const roster = getRoster();
  const entry = roster.find(a => a.slug === slug);
  
  if (!entry) return null;

  const agentDir = path.join(DATA_DIR, 'agents', slug);

  try {
    const [metaRaw, scoresRaw, feedbackRaw, summaryRaw] = await Promise.all([
      fs.readFile(path.join(agentDir, 'meta.json'), 'utf-8').catch(() => null),
      fs.readFile(path.join(agentDir, 'scores.json'), 'utf-8').catch(() => null),
      fs.readFile(path.join(agentDir, 'feedback.json'), 'utf-8').catch(() => null),
      fs.readFile(path.join(agentDir, 'summary.md'), 'utf-8').catch(() => null),
    ]);

    const meta: AgentMeta | undefined = metaRaw ? JSON.parse(metaRaw) : undefined;
    const scores: AgentScores | undefined = scoresRaw ? JSON.parse(scoresRaw) : undefined;
    const feedback: Feedback[] | undefined = feedbackRaw ? JSON.parse(feedbackRaw) : undefined;
    const summary = summaryRaw || undefined;

    return {
      slug: entry.slug,
      name: entry.name,
      site: entry.site,
      status: entry.status,
      feedbackCount: entry.feedback_count,
      publicSignal: entry.public_signal,
      meta,
      scores,
      feedback,
      summary,
    };
  } catch {
    return {
      slug: entry.slug,
      name: entry.name,
      site: entry.site,
      status: entry.status,
      feedbackCount: entry.feedback_count,
      publicSignal: entry.public_signal,
    };
  }
}

export function getAgentDetailSync(slug: string): Agent | null {
  const roster = getRoster();
  const entry = roster.find(a => a.slug === slug);
  
  if (!entry) return null;

  const agentDir = path.join(DATA_DIR, 'agents', slug);

  try {
    const fsSync = require('fs');
    
    let meta: AgentMeta | undefined;
    let scores: AgentScores | undefined;
    let feedback: Feedback[] | undefined;
    let summary: string | undefined;

    try {
      meta = JSON.parse(fsSync.readFileSync(path.join(agentDir, 'meta.json'), 'utf-8'));
    } catch {}

    try {
      scores = JSON.parse(fsSync.readFileSync(path.join(agentDir, 'scores.json'), 'utf-8'));
    } catch {}

    try {
      feedback = JSON.parse(fsSync.readFileSync(path.join(agentDir, 'feedback.json'), 'utf-8'));
    } catch {}

    try {
      summary = fsSync.readFileSync(path.join(agentDir, 'summary.md'), 'utf-8');
    } catch {}

    return {
      slug: entry.slug,
      name: entry.name,
      site: entry.site,
      status: entry.status,
      feedbackCount: entry.feedback_count,
      publicSignal: entry.public_signal,
      meta,
      scores,
      feedback,
      summary,
    };
  } catch {
    return {
      slug: entry.slug,
      name: entry.name,
      site: entry.site,
      status: entry.status,
      feedbackCount: entry.feedback_count,
      publicSignal: entry.public_signal,
    };
  }
}
