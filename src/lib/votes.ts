import { Redis } from '@upstash/redis';

/**
 * Upvotes for use cases, stored in Upstash Redis (the Vercel Marketplace integration injects either the UPSTASH_* or
 * the KV_* names). Without the env, votes are no-ops and counts read as 0, so the page and the button still work
 * locally. Keys: `votes:<job>` (a counter) and `voted:<voter>:<job>` (a flag with a 400-day TTL).
 */

const URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const VOTES_ENABLED = Boolean(URL && TOKEN);
export const JOB_KEY_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const VOTED_TTL_S = 400 * 86_400;

let redis: Redis | null = null;
function client(): Redis | null {
  if (!VOTES_ENABLED) return null;
  if (!redis) redis = new Redis({ url: URL!, token: TOKEN! });
  return redis;
}

/** Counts for the given keys. Zeros for unknown keys, when votes are disabled, and on any Redis error (logged). */
export async function getVoteCounts(keys: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const k of keys) counts[k] = 0;
  const r = client();
  if (!r || keys.length === 0) return counts;
  try {
    const values = await r.mget<(number | string | null)[]>(...keys.map(k => `votes:${k}`));
    keys.forEach((k, i) => {
      const v = values[i];
      counts[k] = typeof v === 'number' ? v : v ? Number(v) || 0 : 0;
    });
  } catch (err) {
    console.error('[votes] read failed', err);
  }
  return counts;
}

/**
 * One vote per voter per job: SET voted:<voter>:<job> NX, then INCR votes:<job> only if that SET won.
 * Returns the current count either way. Throws when Redis is configured but unreachable.
 */
export async function castVote(job: string, voter: string): Promise<{ votes: number; counted: boolean; stored: boolean }> {
  const r = client();
  if (!r) return { votes: 0, counted: false, stored: false };
  const won = await r.set(`voted:${voter}:${job}`, 1, { nx: true, ex: VOTED_TTL_S });
  if (won === 'OK') {
    const votes = await r.incr(`votes:${job}`);
    return { votes, counted: true, stored: true };
  }
  const current = await r.get<number | string | null>(`votes:${job}`);
  return { votes: typeof current === 'number' ? current : Number(current) || 0, counted: false, stored: true };
}
