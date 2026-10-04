export interface TravelRun {
  id: string;
  agent: string;
  dimension: number;
  date: string;
  score: number;
  evidence_url: string;
  reviewed: boolean;
  version: string;
  protocol?: 'task' | 'observed';
  notes?: string;
}
export interface TravelSummary {
  scores: Record<number, number>;
  runs: Record<number, TravelRun>;
  completed: number;
  total: number;
  score: number | null;
  legacyScore: number | 'n/a' | null;
}

/** Latest reviewed, evidence-backed run per dimension. Untested dimensions do not affect the average. */
export function summarizeTravel(slug: string, dimensions: number[], runs: TravelRun[], legacyScore: TravelSummary['legacyScore'] = null): TravelSummary {
  const latest: Record<number, TravelRun> = {};
  for (const run of runs) {
    if (run.agent !== slug || !run.reviewed || run.version !== 'travel-v1') continue;
    if (!dimensions.includes(run.dimension) || !Number.isFinite(run.score) || run.score < 1 || run.score > 10 || !Number.isFinite(Date.parse(run.date)) || !/^(https:\/\/|\/(?!\/))/.test(run.evidence_url)) {
      throw new Error(`Invalid reviewed travel run: ${run.id}`);
    }
    const previous = latest[run.dimension];
    if (!previous || Date.parse(run.date) > Date.parse(previous.date) || (run.date === previous.date && run.id > previous.id)) latest[run.dimension] = run;
  }
  const scores = Object.fromEntries(Object.entries(latest).map(([id, run]) => [id, run.score]));
  const completed = Object.keys(scores).length;
  const score = completed > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / completed * 10) / 10
    : null;
  return { scores, runs: latest, completed, total: dimensions.length, score, legacyScore };
}

/** Ranking only: three prior results at 5/10; preserve the displayed average. */
export function travelRankingScore(summary: Pick<TravelSummary, 'scores'>): number | null {
  const scores = Object.values(summary.scores);
  return scores.length ? (scores.reduce((sum, score) => sum + score, 0) + 15) / (scores.length + 3) : null;
}

export function compareTravelRank(
  a: { name: string; travel: TravelSummary },
  b: { name: string; travel: TravelSummary },
): number {
  return (travelRankingScore(b.travel) ?? -1) - (travelRankingScore(a.travel) ?? -1)
    || a.name.localeCompare(b.name);
}
