import { createHmac } from 'node:crypto';
import { MAX_BYTES, digest, validateBundle } from './contribution.mjs';
import { persist, redisClient } from './contribution-store.mjs';
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function readBounded(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new Error('Bundle too large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Empty body');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('Bundle too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}
export function createIntake({ slugs, categories, env = process.env, redis = undefined, notify = async (_receipt) => {}, now = () => Date.now() }) {
  return async request => {
    if (env.CONTRIB_ENABLED !== 'true') return reply({ error: 'Contribution intake is not accepting submissions yet' }, 503);
    // Vercel overwrites this header. Other hosting must supply a trusted proxy equivalent.
    const ip = env.VERCEL === '1' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : 'local';
    if (!ip) return reply({ error: 'Cannot determine submission rate limit' }, 503);
    const salt = env.UPSTASH_REDIS_REST_TOKEN;
    if (!salt) return reply({ error: 'Private contribution storage is not configured' }, 503);
    const clientHash = createHmac('sha256', salt).update(`${Math.floor(now()/86400000)}:${ip}`).digest('hex');
    let body, bundle;
    try { body = await readBounded(request); bundle = validateBundle(JSON.parse(body), { slugs, categories, now: now() }); }
    catch (e) { return reply({ error: e.message }, e.message === 'Bundle too large' ? 413 : 400); }
    let result;
    try { result = await persist(bundle, digest(body), clientHash, redis ?? redisClient(env), now()); }
    catch { return reply({ error: 'Not confirmed as received. Keep this bundle and retry the same submission.' }, 503); }
    if (result.status === 'conflict') return reply({ error: 'This submission ID was already used with different content. Rebuild and preview a new bundle.' }, 409);
    if (result.status === 'limited') return reply({ error: 'Submission limit reached. Try again later; keep this same bundle.' }, 429);
    if (!['stored','duplicate'].includes(result.status)) return reply({ error: 'Storage did not confirm receipt' }, 503);
    let notification = 'not_requested';
    if (result.status === 'stored') {
      try { await notify({ id: result.id, slug: bundle.slug, count: bundle.drafts.length }); notification = 'sent'; }
      catch { notification = 'failed'; }
    }
    return reply({ success: true, id: result.id, duplicate: result.status === 'duplicate', notification }, result.status === 'stored' ? 201 : 200);
  };
}

export function createReadiness({ env = process.env, redis = undefined } = {}) {
  return async () => {
    if (env.CONTRIB_ENABLED !== 'true') return reply({ accepting: false }, 503);
    try {
      const ok = await (redis ?? redisClient(env))(['PING']);
      if (ok !== 'PONG') throw new Error();
      return reply({ accepting: true, invitation_required: false, review_required: true });
    } catch { return reply({ accepting: false }, 503); }
  };
}
