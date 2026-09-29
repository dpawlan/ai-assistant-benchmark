import { timingSafeEqual } from 'node:crypto';
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
    let invitations;
    try { invitations = JSON.parse(env.CONTRIB_INVITES_JSON ?? '[]'); if (!Array.isArray(invitations) || !invitations.length) throw new Error(); }
    catch { return reply({ error: 'Contribution pilot is not accepting submissions yet' }, 503); }
    const secret = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
    if (secret.length < 32 || secret.length > 200) return reply({ error: 'A valid pilot invitation is required' }, 401);
    const inviteHash = digest(secret);
    const invited = invitations.some(i => /^[a-f0-9]{64}$/.test(i.hash) && Date.parse(i.expires_at) > now() && timingSafeEqual(Buffer.from(i.hash), Buffer.from(inviteHash)));
    if (!invited) return reply({ error: 'Invitation is invalid or expired; contact David' }, 401);
    let body, bundle;
    try { body = await readBounded(request); bundle = validateBundle(JSON.parse(body), { slugs, categories, now: now() }); }
    catch (e) { return reply({ error: e.message }, e.message === 'Bundle too large' ? 413 : 400); }
    let result;
    try { result = await persist(bundle, digest(body), inviteHash, redis ?? redisClient(env), now()); }
    catch { return reply({ error: 'Not confirmed as received. Keep this bundle and retry the same submission.' }, 503); }
    if (result.status === 'conflict') return reply({ error: 'This submission ID was already used with different content. Rebuild and preview a new bundle.' }, 409);
    if (result.status === 'limited') return reply({ error: 'Invitation submission limit reached. Retry in an hour.' }, 429);
    if (!['stored','duplicate'].includes(result.status)) return reply({ error: 'Storage did not confirm receipt' }, 503);
    let notification = 'not_requested';
    if (result.status === 'stored') {
      try { await notify({ id: result.id, slug: bundle.slug, count: bundle.drafts.length }); notification = 'sent'; }
      catch { notification = 'failed'; }
    }
    return reply({ success: true, id: result.id, duplicate: result.status === 'duplicate', notification }, result.status === 'stored' ? 201 : 200);
  };
}
