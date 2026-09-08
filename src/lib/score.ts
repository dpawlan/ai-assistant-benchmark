/** Pure score helpers, safe to import from client components. */

/** 1–5 bucket for the blue score ramp. */
export function scoreBucket(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 9) return 5;
  if (score >= 7.5) return 4;
  if (score >= 6) return 3;
  if (score >= 4) return 2;
  return 1;
}

import type { OpinionStat } from './types';

/** Pseudo-count for shrinking opinion scores by sample size when ordering. */
export const OPINION_PRIOR = 5;

/**
 * Score used for ORDERING only: the net score shrunk toward zero by sample size,
 * so three glowing quotes don't outrank thirty mixed ones. Displayed values stay raw.
 */
export function opinionRank(stat: OpinionStat | undefined): number {
  if (!stat || stat.n === 0) return -3;
  if (stat.score === null) return -2 + stat.n / 1000;
  const signed = stat.pos + stat.neg;
  // Share of positive, centered on an even split, shrunk toward the split by sample size.
  return (stat.score - 0.5) * (signed / (signed + OPINION_PRIOR));
}
