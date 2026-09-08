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

/** Signed quotes below this count are a thin sample: shown with a marker and ranked after solid samples. */
export const THIN_SAMPLE = 15;

export function isThin(stat: OpinionStat | undefined): boolean {
  return !!stat && stat.score !== null && stat.pos + stat.neg < THIN_SAMPLE;
}

/**
 * Ordering key for opinion cells: the Wilson lower bound (95%) of the positive share, so a 100% from six
 * quotes ranks below an 83% from eighty. Single-purpose products rank after general assistants (a travel
 * agent's 100% is 100% on one job); thin samples after those; unscored cells by sample size; empty last.
 */
export function opinionRank(stat: OpinionStat | undefined, specialist = false): number {
  if (!stat || stat.n === 0) return -3;
  if (stat.score === null) return -2 + stat.n / 1000;
  const n = stat.pos + stat.neg;
  const p = stat.pos / n;
  const z = 1.96;
  const lb = (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n);
  // Tiers: general assistants, then single-purpose products, then thin samples.
  if (isThin(stat)) return -1.5 + lb;
  if (specialist) return -0.5 + lb;
  return lb;
}

/** Reply-time bucket on the same 1–5 ramp: under 15s is best, over 5 minutes is worst. */
export function speedBucket(seconds: number): 1 | 2 | 3 | 4 | 5 {
  if (seconds <= 15) return 5;
  if (seconds <= 45) return 4;
  if (seconds <= 120) return 3;
  if (seconds <= 300) return 2;
  return 1;
}
