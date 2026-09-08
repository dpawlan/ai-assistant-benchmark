import path from 'node:path';
import { CATEGORY_SHORT, getAgentDetail, getAgents, getCategories } from './data';
import { Agent } from './types';
import { CompareRow, CompareSide, Comparison, decide, tallyRows } from './compare-shared';

export * from './compare-shared';

function side(agent: Agent): CompareSide {
  return {
    slug: agent.slug,
    name: agent.name,
    icon: agent.icon,
    tagline: agent.tagline,
    site: agent.site,
    overall: agent.overall,
    testedCount: agent.testedCount,
    opinionOverall: agent.opinionOverall,
  };
}

/** Focus segment or query: "email_replies~purchasing" (or comma-separated) -> known category keys only, in rubric order. */
export function parseFocus(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const wanted = new Set(decodeURIComponent(raw).split(/[~,+ ]/).filter(Boolean));
  return getCategories()
    .map(c => c.key)
    .filter(k => wanted.has(k));
}

/** Build the head-to-head for two slugs, or null when either is unknown. */
export function buildComparison(aSlug: string, bSlug: string): Comparison | null {
  const a = getAgentDetail(aSlug);
  const b = getAgentDetail(bSlug);
  if (!a || !b || a.slug === b.slug) return null;
  const rows: CompareRow[] = getCategories().map(c => ({
    key: c.key,
    label: c.label,
    short: CATEGORY_SHORT[c.key] ?? c.label,
    a: a.scores[c.key] ?? null,
    b: b.scores[c.key] ?? null,
    runA: a.latestRuns[c.key] ?? null,
    runB: b.latestRuns[c.key] ?? null,
    opinionA: a.opinion[c.key]?.n ? a.opinion[c.key] : null,
    opinionB: b.opinion[c.key]?.n ? b.opinion[c.key] : null,
    winner: decide(a.scores[c.key] ?? null, b.scores[c.key] ?? null),
  }));
  return { a: side(a), b: side(b), rows, tally: tallyRows(rows) };
}

/** Agents with at least one tested dimension: the only ones a head-to-head can say anything about. */
export function getTestedAgents(): Agent[] {
  return getAgents()
    .filter(a => a.testedCount > 0)
    .sort((x, y) => x.name.localeCompare(y.name));
}

/** Every ordered pair of tested agents, so both /compare/a-vs-b and /compare/b-vs-a are built ahead of time. */
export function getComparablePairs(): [string, string][] {
  const tested = getTestedAgents();
  const pairs: [string, string][] = [];
  for (const a of tested) for (const b of tested) if (a.slug !== b.slug) pairs.push([a.slug, b.slug]);
  return pairs;
}

/** Unordered pairs of tested agents, alphabetical, for the matchup list. */
export function getMatchups(): Comparison[] {
  const tested = getTestedAgents();
  const out: Comparison[] = [];
  for (let i = 0; i < tested.length; i++)
    for (let j = i + 1; j < tested.length; j++) {
      const c = buildComparison(tested[i].slug, tested[j].slug);
      if (c) out.push(c);
    }
  return out;
}

/** Absolute path of a public asset, for the card renderer. */
export function publicFile(rel: string): string {
  return path.join(process.cwd(), 'public', rel.replace(/^\//, ''));
}
