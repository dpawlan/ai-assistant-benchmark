import { RETENTION_SECONDS, digest } from './contribution.mjs';
export function redisClient(env = process.env, fetcher = fetch) {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) throw new Error('Private contribution storage is not configured');
  return async command => {
    const res = await fetcher(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('Private contribution storage unavailable');
    const result = await res.json();
    if (result.error) throw new Error('Private contribution storage rejected the operation');
    return result.result;
  };
}
// One atomic operation persists or retrieves a retry. A failed notification cannot erase the submission.
export const STORE_LUA = `
local existing = redis.call('GET', KEYS[1])
if existing then
  local previous = cjson.decode(existing)
  if previous.request_digest ~= ARGV[1] then return 'conflict' end
  return 'duplicate'
end
local count = redis.call('INCR', KEYS[2])
if count == 1 then redis.call('EXPIRE', KEYS[2], 3600) end
if count > 6 then return 'limited' end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
redis.call('SADD', KEYS[3], ARGV[4])
return 'stored'
`;
export const INDEX = 'contributions:v2:index';
export const payloadKey = id => `contributions:v2:payload:${id}`;
export async function persist(bundle, requestDigest, inviteHash, redis, now = Date.now()) {
  const id = digest(`${inviteHash}:${bundle.id}`);
  const received_at = new Date(now).toISOString();
  const expires_at = new Date(now + RETENTION_SECONDS * 1000).toISOString();
  const record = { id, received_at, expires_at, request_digest: requestDigest, bundle };
  const status = await redis(['EVAL', STORE_LUA, '3', payloadKey(id), `contributions:v2:rate:${inviteHash}:${Math.floor(now / 3600000)}`, INDEX, requestDigest, JSON.stringify(record), String(RETENTION_SECONDS), id]);
  return { id, status };
}
