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

// Relative weights avoid accumulation error: 14/35 = 40%, and 3/35 = 60% / 7.
const BOOKING_SPEED_WEIGHT = 14;
const OTHER_DIMENSION_WEIGHT = 3;

/** Eight-dimension Travel policy: speed gets 40%; the other seven share 60%.
 * Missing dimensions are excluded and the observed weights are renormalized.
 */
function weightedTravelAverage(scores: Record<number, number>): number | null {
  const entries = Object.entries(scores);
  if (!entries.length) return null;
  let weightedTotal = 0;
  let testedWeight = 0;
  for (const [dimension, score] of entries) {
    const weight = Number(dimension) === 19 ? BOOKING_SPEED_WEIGHT : OTHER_DIMENSION_WEIGHT;
    weightedTotal += score * weight;
    testedWeight += weight;
  }
  return weightedTotal / testedWeight;
}

/** Latest reviewed, evidence-backed run per dimension. Untested dimensions stay blank. */
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
  const weightedAverage = weightedTravelAverage(scores);
  const score = weightedAverage === null ? null : Math.round(weightedAverage * 10) / 10;
  return { scores, runs: latest, completed, total: dimensions.length, score, legacyScore };
}

/** Ranking only: regularize the unrounded weighted average with three prior results at 5/10. */
export function travelRankingScore(summary: Pick<TravelSummary, 'scores'>): number | null {
  const average = weightedTravelAverage(summary.scores);
  const completed = Object.keys(summary.scores).length;
  return average === null ? null : (average * completed + 15) / (completed + 3);
}

export function compareTravelRank(
  a: { name: string; travel: TravelSummary },
  b: { name: string; travel: TravelSummary },
): number {
  return (travelRankingScore(b.travel) ?? -1) - (travelRankingScore(a.travel) ?? -1)
    || a.name.localeCompare(b.name);
}
