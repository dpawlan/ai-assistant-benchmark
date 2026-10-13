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

export const TRAVEL_WEIGHTING_DESCRIPTION = 'Booking speed counts for 40%; the other seven dimensions share 60% equally.';

/** Relative weights: 14 / (14 + 7 × 3) = 40% for booking speed.
 * Missing dimensions are excluded and the observed weights are normalized.
 */
function weightedTravelScore(scores: Record<number, number>): number | null {
  let weightedTotal = 0;
  let totalWeight = 0;
  for (const [dimension, score] of Object.entries(scores)) {
    const weight = Number(dimension) === 19 ? 14 : 3;
    weightedTotal += score * weight;
    totalWeight += weight;
  }
  return totalWeight ? weightedTotal / totalWeight : null;
}

/** Latest reviewed evidence per dimension, combined with the published Travel weights. */
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
  const weighted = weightedTravelScore(scores);
  const score = weighted === null ? null : Math.round(weighted * 10) / 10;
  return { scores, runs: latest, completed, total: dimensions.length, score, legacyScore };
}

/** Ranking only: shrink the unrounded weighted mean toward 5 using three prior results.
 * Coverage counts distinct tested dimensions; extra speed weight is not extra evidence.
 */
export function travelRankingScore(summary: Pick<TravelSummary, 'scores'>): number | null {
  const mean = weightedTravelScore(summary.scores);
  const completed = Object.keys(summary.scores).length;
  return mean === null ? null : (mean * completed + 15) / (completed + 3);
}

export function compareTravelRank(
  a: { name: string; travel: TravelSummary },
  b: { name: string; travel: TravelSummary },
): number {
  return (travelRankingScore(b.travel) ?? -1) - (travelRankingScore(a.travel) ?? -1)
    || a.name.localeCompare(b.name);
}
