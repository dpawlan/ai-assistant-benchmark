/** Benchmark status per assistant: anything being tested is in progress, nothing is ever marked complete. Client-safe: pure functions over Agent + Category. */
import type { Agent, Category } from './types';

export type BenchStatus = 'in_progress' | 'pending';

export const STATUS_ORDER: BenchStatus[] = ['in_progress', 'pending'];

export const STATUS_LABEL: Record<BenchStatus, string> = {
  in_progress: 'In progress',
  pending: 'Pending',
};

/** One line under each group header, or beside the strip. */
export const STATUS_CAPTION: Record<BenchStatus, string> = {
  in_progress: 'Being tested. Overall is a running mean and will move as tests land.',
  pending: 'On the roster, not tested yet. No score.',
};

export interface Coverage {
  /** Dimensions with a numeric score. */
  scored: number;
  /** Dimensions marked N/A for this product. */
  na: number;
  /** Dimensions that apply to this product (total minus N/A). */
  applicable: number;
  /** Every scored dimension in the rubric. */
  total: number;
}

export function coverage(agent: Agent, categories: Category[]): Coverage {
  const cols = categories.filter(c => c.scored !== false);
  let scored = 0;
  let na = 0;
  for (const c of cols) {
    const v = agent.scores[c.key];
    if (typeof v === 'number') scored++;
    else if (v === 'n/a') na++;
  }
  return { scored, na, applicable: cols.length - na, total: cols.length };
}

export function benchStatus(agent: Agent, categories: Category[]): BenchStatus {
  const c = coverage(agent, categories);
  if (c.scored === 0) return 'pending';
  return 'in_progress';
}

export function statusCounts(agents: Agent[], categories: Category[]): Record<BenchStatus, number> {
  const out: Record<BenchStatus, number> = { in_progress: 0, pending: 0 };
  for (const a of agents) out[benchStatus(a, categories)]++;
  return out;
}
