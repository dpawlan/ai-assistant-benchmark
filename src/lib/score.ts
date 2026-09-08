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

/** Reply-time bucket on the same 1–5 ramp: under 15s is best, over 5 minutes is worst. */
export function speedBucket(seconds: number): 1 | 2 | 3 | 4 | 5 {
  if (seconds <= 15) return 5;
  if (seconds <= 45) return 4;
  if (seconds <= 120) return 3;
  if (seconds <= 300) return 2;
  return 1;
}
