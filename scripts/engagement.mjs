#!/usr/bin/env node
/**
 * Fetch public engagement counts (likes, reposts, replies, views) for every X quote in data/agents/<slug>/feedback.json
 * and store them as `metrics` on the quote. Powers the trending use-cases page.
 *
 *   node scripts/engagement.mjs [--slug a,b] [--kind use-case] [--refresh]   (default: only quotes without metrics)
 *
 * Uses api.fxtwitter.com, which needs no key. Be gentle: 4 in flight, short pause between batches.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : undefined; };
const onlySlugs = opt('slug') ? String(opt('slug')).split(',') : null;
const onlyKind = opt('kind') ? String(opt('kind')) : null;
const refresh = !!opt('refresh');
const today = new Date().toISOString().slice(0, 10);

const tweetId = url => (url?.match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/) || [])[1];

async function fetchMetrics(id) {
  const res = await fetch(`https://api.fxtwitter.com/status/${id}`, { headers: { 'User-Agent': 'assistant-benchmark/1.0' } });
  if (res.status === 404) return { missing: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const t = (await res.json()).tweet ?? {};
  return { likes: t.likes ?? 0, reposts: t.retweets ?? 0, replies: t.replies ?? 0, views: t.views ?? null, fetched: today };
}

const files = fs.readdirSync(path.join(ROOT, 'data', 'agents')).filter(s => !onlySlugs || onlySlugs.includes(s));
let done = 0, failed = 0, missing = 0;
for (const slug of files) {
  const file = path.join(ROOT, 'data', 'agents', slug, 'feedback.json');
  if (!fs.existsSync(file)) continue;
  const quotes = JSON.parse(fs.readFileSync(file, 'utf8'));
  const todo = quotes.filter(q => tweetId(q.url) && (refresh || !q.metrics) && (!onlyKind || q.kind === onlyKind));
  if (!todo.length) continue;
  for (let i = 0; i < todo.length; i += 4) {
    await Promise.all(todo.slice(i, i + 4).map(async q => {
      try {
        const m = await fetchMetrics(tweetId(q.url));
        if (m.missing) { q.metrics = { missing: true, fetched: today }; missing++; } else { q.metrics = m; done++; }
      } catch (e) { failed++; }
    }));
    await new Promise(r => setTimeout(r, 250));
  }
  fs.writeFileSync(file, JSON.stringify(quotes, null, 2) + '\n');
  console.log(`${slug}: ${todo.length} fetched`);
}
console.log(`metrics: ${done} ok, ${missing} deleted/unavailable, ${failed} failed`);
