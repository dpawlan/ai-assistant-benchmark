#!/usr/bin/env node
/**
 * Collect public quotes about each assistant.
 *
 *   node scripts/collect.mjs x         --slug instinct,poke [--since 2026-06-01] [--until 2026-09-08] [--window 7] [--headed]
 *   node scripts/collect.mjs reddit    [--slug ...]
 *   node scripts/collect.mjs hn        [--slug ...]
 *   node scripts/collect.mjs appstore  [--slug ...] [--country us]
 *   node scripts/collect.mjs producthunt [--slug ...]
 *   node scripts/collect.mjs find-apps [--slug ...]        prints App Store candidates to paste into data/sources.json
 *   node scripts/collect.mjs merge     [--slug ...] [--source x]   inbox -> feedback.json, then reindex
 *   node scripts/collect.mjs reindex
 *
 * Every collector writes candidates to data/inbox/<source>/<slug>.json, never straight into feedback.json.
 * Records are deduplicated by URL against feedback.json and the inbox. Nothing is paraphrased: `quote` is the post text.
 *
 * Credentials (all optional except X):
 *   X_AUTH_TOKEN, X_CT0                  cookies from a logged-in x.com session (DevTools > Application > Cookies)
 *   REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET  free "script" app at reddit.com/prefs/apps; without them the public
 *                                           JSON endpoints are used, which work from a home IP but not from cloud IPs
 *   PRODUCT_HUNT_TOKEN                   developer token from producthunt.com/v2/oauth/applications
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const INBOX = path.join(DATA, 'inbox');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/* ---------- CLI ---------- */

const opts = {};
let sources = {};
let slugs = [];

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = rest[i + 1];
    if (next === undefined || next.startsWith('--')) opts[key] = true;
    else {
      opts[key] = next;
      i++;
    }
  }
  return cmd;
}

async function main() {
  const cmd = parseArgs(process.argv.slice(2));
  const commands = { x: collectX, reddit: collectReddit, hn: collectHN, appstore: collectAppStore, producthunt: collectProductHunt, 'find-apps': findApps, merge, reindex };
  if (!commands[cmd]) {
    console.error(fs.readFileSync(new URL(import.meta.url)).toString().split('*/')[0].replace('/**', '').replace(/^ \* ?/gm, ''));
    process.exit(1);
  }
  sources = JSON.parse(fs.readFileSync(path.join(DATA, 'sources.json'), 'utf-8')).agents;
  slugs = opts.slug ? String(opts.slug).split(',') : Object.keys(sources);
  for (const s of slugs) if (!sources[s]) fail(`Unknown slug "${s}". Add it to data/sources.json.`);
  await commands[cmd]();
}


/* ---------- Shared helpers ---------- */

function fail(msg) {
  console.error(`\n${msg}\n`);
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const jitter = (a, b) => sleep(a + Math.random() * (b - a));

/** Canonical form for dedupe: drop tracking params and www, keep the fragment (App Store reviews differ only by it). */
export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.search = '';
    return `${u.protocol}//${u.host.toLowerCase().replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}${u.hash}`;
  } catch {
    return url;
  }
}

function idFor(url) {
  return crypto.createHash('sha1').update(normalizeUrl(url)).digest('hex').slice(0, 12);
}

export function toDate(input) {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function clean(text) {
  return String(text ?? '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Build a record in the feedback.json shape. `kind` stays "other" unless the source carries the author's own rating. */
export function record({ slug, quote, author, author_name = '', date, url, source, tags = [], notes = '', kind = 'other' }) {
  return {
    id: idFor(url),
    agent: slug,
    quote: clean(quote),
    author,
    author_name,
    date,
    url,
    kind,
    tags: ['auto', source, ...tags],
    source,
    collected_at: new Date().toISOString(),
    notes,
  };
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

function feedbackFile(slug) {
  return path.join(DATA, 'agents', slug, 'feedback.json');
}

function inboxFile(source, slug) {
  return path.join(INBOX, source, `${slug}.json`);
}

/** URLs and ids already known for an agent, across feedback.json and every inbox. */
export function known(slug) {
  const urls = new Set();
  const ids = new Set();
  const add = r => {
    if (r.url) urls.add(normalizeUrl(r.url));
    if (r.id) ids.add(r.id);
  };
  readJson(feedbackFile(slug), []).forEach(add);
  if (fs.existsSync(INBOX)) {
    for (const src of fs.readdirSync(INBOX)) readJson(inboxFile(src, slug), []).forEach(add);
  }
  return { urls, ids };
}

/** Does the text actually talk about this product? Search engines are loose; this keeps "town" from matching towns. */
export function mentions(cfg, text) {
  const t = text.toLowerCase();
  return cfg.match.some(m => t.includes(m.toLowerCase()));
}

export function isVendor(cfg, handle) {
  return cfg.handles.some(h => h.toLowerCase() === String(handle).replace(/^@/, '').toLowerCase());
}

export function writeInbox(source, slug, items) {
  const file = inboxFile(source, slug);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const existing = readJson(file, []);
  const seen = new Set(existing.map(r => r.id));
  const fresh = [];
  for (const r of items) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    fresh.push(r);
  }
  if (fresh.length) {
    fs.writeFileSync(file, JSON.stringify([...existing, ...fresh], null, 2) + '\n');
  }
  console.log(`  ${slug}: ${fresh.length} new (${items.length} found, ${existing.length} already in inbox) -> ${path.relative(ROOT, file)}`);
  return fresh.length;
}

/** Drop records already in feedback.json or the inbox, and anything that doesn't mention the product. */
export function filterNew(slug, cfg, items) {
  const k = known(slug);
  const out = [];
  const seen = new Set();
  for (const r of items) {
    const u = normalizeUrl(r.url);
    if (k.urls.has(u) || k.ids.has(r.id) || seen.has(u)) continue;
    if (!mentions(cfg, r.quote)) continue;
    seen.add(u);
    out.push(r);
  }
  return out;
}

async function getJson(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { 'User-Agent': UA, Accept: 'application/json', ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function stripHtml(html) {
  return String(html ?? '')
    .replace(/<p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/g, '/');
}

/* ---------- X (Twitter) ---------- */

function dateWindows(since, until, days) {
  const out = [];
  let a = new Date(since);
  const end = new Date(until);
  while (a < end) {
    const b = new Date(Math.min(a.getTime() + days * 86400000, end.getTime()));
    out.push([a.toISOString().slice(0, 10), b.toISOString().slice(0, 10)]);
    a = b;
  }
  return out;
}

/** Pull tweets out of an x.com SearchTimeline GraphQL response. Exported for tests. */
export function parseSearchTimeline(json) {
  const tweets = [];
  const instructions = json?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions ?? [];
  const visit = entry => {
    const items = entry?.content?.items ? entry.content.items.map(i => i.item) : [entry?.content];
    for (const c of items) {
      let r = c?.itemContent?.tweet_results?.result;
      if (!r) continue;
      if (r.__typename === 'TweetWithVisibilityResults') r = r.tweet;
      const legacy = r?.legacy;
      if (!legacy || legacy.retweeted_status_result) continue;
      const user = r.core?.user_results?.result ?? {};
      const screen = user.legacy?.screen_name ?? user.core?.screen_name;
      const name = user.legacy?.name ?? user.core?.name ?? '';
      if (!screen) continue;
      const text = r.note_tweet?.note_tweet_results?.result?.text ?? legacy.full_text ?? '';
      tweets.push({
        id: legacy.id_str ?? r.rest_id,
        text,
        screen,
        name,
        created_at: legacy.created_at,
        url: `https://x.com/${screen}/status/${legacy.id_str ?? r.rest_id}`,
        is_reply: Boolean(legacy.in_reply_to_status_id_str),
      });
    }
  };
  for (const ins of instructions) {
    for (const e of ins.entries ?? []) visit(e);
    if (ins.entry) visit(ins.entry);
  }
  return tweets;
}

async function collectX() {
  const auth = process.env.X_AUTH_TOKEN;
  const ct0 = process.env.X_CT0;
  if (!auth || !ct0) {
    fail(
      'X needs a logged-in session. In x.com DevTools > Application > Cookies copy `auth_token` and `ct0`, then:\n' +
        '  X_AUTH_TOKEN=... X_CT0=... node scripts/collect.mjs x --slug instinct\n' +
        'Note: automated collection is against X\'s terms even from your own account. Go slowly; this script does.',
    );
  }
  const { chromium } = await import('playwright');
  const since = opts.since ?? '2026-01-01';
  const until = opts.until ?? new Date().toISOString().slice(0, 10);
  const windowDays = Number(opts.window ?? 7);
  const maxScrolls = Number(opts.scrolls ?? 40);

  const browser = await chromium.launch({ headless: !opts.headed, channel: process.env.X_CHROME_CHANNEL || undefined });
  const context = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 1600 } });
  await context.addCookies([
    { name: 'auth_token', value: auth, domain: '.x.com', path: '/', httpOnly: true, secure: true, sameSite: 'None' },
    { name: 'ct0', value: ct0, domain: '.x.com', path: '/', secure: true, sameSite: 'Lax' },
  ]);
  const page = await context.newPage();

  const seen = new Map(); // tweet id -> {tweet, query}
  let currentQuery = '';
  page.on('response', async res => {
    if (!/SearchTimeline/.test(res.url())) return;
    try {
      const json = await res.json();
      for (const t of parseSearchTimeline(json)) if (!seen.has(t.id)) seen.set(t.id, { ...t, query: currentQuery });
    } catch {
      /* non-JSON or aborted response */
    }
  });

  try {
    for (const slug of slugs) {
      const cfg = sources[slug];
      if (!cfg.x_queries?.length) continue;
      console.log(`\n${cfg.name} (${slug})`);
      seen.clear();
      let baseHits = 0;
      for (const base of cfg.x_queries) {
        // The action-phrased query (booked OR flight OR ...) only pays off where the plain queries already found volume.
        if (/\(booked OR flight OR/.test(base) && baseHits < 10) {
          console.log(`  (skipping action query: only ${baseHits} hits so far)`);
          continue;
        }
        for (const [a, b] of dateWindows(since, until, windowDays)) {
          const q = `${base} since:${a} until:${b} -filter:retweets`;
          currentQuery = q;
          const before = seen.size;
          // Rate limit: wait out X's 15-minute window, then retry the same search rather than skipping it.
          let loaded = false;
          for (let attempt = 0; attempt < 3 && !loaded; attempt++) {
            await page.goto(`https://x.com/search?q=${encodeURIComponent(q)}&src=typed_query&f=live`, { waitUntil: 'domcontentloaded' });
            await sleep(2500);
            if (await page.locator('text=/Something went wrong|Rate limit|Try again/i').first().isVisible().catch(() => false)) {
              console.log(`  rate limited; sleeping 15 minutes, then retrying (${attempt + 1}/3)`);
              await sleep(15 * 60 * 1000);
            } else loaded = true;
          }
          if (!loaded) {
            console.log(`  ${q}  skipped after 3 rate limits`);
            continue;
          }
          let stale = 0;
          let last = seen.size;
          for (let i = 0; i < maxScrolls; i++) {
            await page.mouse.wheel(0, 3500);
            await jitter(900, 1600);
            if (seen.size === last) {
              if (++stale >= 3) break;
            } else {
              stale = 0;
              last = seen.size;
            }
          }
          console.log(`  ${q}  +${seen.size - before}`);
          if (!/\(booked OR flight OR/.test(base)) baseHits += seen.size - before;
          await jitter(2500, 5000);
        }
      }
      const items = [...seen.values()].map(t =>
        record({
          slug,
          quote: t.text,
          author: `@${t.screen}`,
          author_name: t.name,
          date: toDate(t.created_at),
          url: t.url,
          source: 'x',
          tags: [...(isVendor(cfg, t.screen) ? ['vendor'] : []), ...(t.is_reply ? ['reply'] : [])],
          notes: `query: ${t.query}`,
        }),
      );
      writeInbox('x', slug, filterNew(slug, cfg, items));
    }
  } finally {
    await browser.close();
  }
}

/* ---------- Reddit ---------- */

async function redditClient() {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  const ua = `assistant-benchmark/0.1 (by u/${process.env.REDDIT_USERNAME ?? 'assistant-benchmark'})`;
  if (id && secret) {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'User-Agent': ua, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) fail(`Reddit token request failed: ${res.status}`);
    const { access_token } = await res.json();
    return async (p, params) => getJson(`https://oauth.reddit.com${p}?${new URLSearchParams({ raw_json: '1', ...params })}`, { headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': ua } });
  }
  console.log('No REDDIT_CLIENT_ID/SECRET: using public JSON endpoints (works from a home IP, 403 from cloud IPs).');
  return async (p, params) => getJson(`https://www.reddit.com${p}.json?${new URLSearchParams({ raw_json: '1', ...params })}`, { headers: { 'User-Agent': ua } });
}

async function collectReddit() {
  const get = await redditClient();
  const since = new Date(opts.since ?? '2026-01-01').getTime() / 1000;
  const maxPosts = Number(opts.limit ?? 40);

  for (const slug of slugs) {
    const cfg = sources[slug];
    if (!cfg.reddit_queries?.length) continue;
    console.log(`\n${cfg.name} (${slug})`);
    const items = [];
    const posts = new Map();
    for (const q of cfg.reddit_queries) {
      let after = null;
      for (let page = 0; page < 3; page++) {
        const data = await get('/search', { q, sort: 'new', limit: '100', t: 'year', type: 'link', ...(after ? { after } : {}) });
        for (const c of data.data?.children ?? []) {
          const p = c.data;
          if (p.created_utc >= since && !posts.has(p.id)) posts.set(p.id, p);
        }
        after = data.data?.after;
        if (!after) break;
        await jitter(1200, 2000);
      }
    }
    console.log(`  ${posts.size} posts match; reading comments on the ${Math.min(maxPosts, posts.size)} newest`);
    const list = [...posts.values()].sort((a, b) => b.created_utc - a.created_utc).slice(0, maxPosts);
    for (const p of list) {
      const url = `https://www.reddit.com${p.permalink}`;
      const body = [p.title, p.selftext].filter(Boolean).join('\n\n').slice(0, 2000);
      items.push(record({ slug, quote: body, author: `u/${p.author}`, date: toDate(p.created_utc * 1000), url, source: 'web', tags: ['reddit', `r/${p.subreddit}`], notes: `post score ${p.score}` }));
      try {
        const thread = await get(`/comments/${p.id}`, { limit: '200', depth: '3', sort: 'top' });
        const walk = node => {
          const d = node?.data;
          if (!d) return;
          if (node.kind === 't1' && d.body && d.author !== 'AutoModerator' && mentions(cfg, d.body)) {
            items.push(record({ slug, quote: d.body.slice(0, 2000), author: `u/${d.author}`, date: toDate(d.created_utc * 1000), url: `https://www.reddit.com${d.permalink}`, source: 'web', tags: ['reddit', `r/${d.subreddit}`, 'comment'], notes: `comment score ${d.score} on "${p.title.slice(0, 60)}"` }));
          }
          for (const ch of d.replies?.data?.children ?? []) walk(ch);
        };
        for (const ch of thread[1]?.data?.children ?? []) walk(ch);
      } catch (e) {
        console.log(`  could not read comments for ${p.id}: ${e.message}`);
      }
      await jitter(1000, 1800);
    }
    writeInbox('reddit', slug, filterNew(slug, cfg, items));
  }
}

/* ---------- Hacker News ---------- */

async function collectHN() {
  const since = Math.floor(new Date(opts.since ?? '2026-01-01').getTime() / 1000);
  for (const slug of slugs) {
    const cfg = sources[slug];
    if (!cfg.hn_queries?.length) continue;
    console.log(`\n${cfg.name} (${slug})`);
    const items = [];
    for (const q of cfg.hn_queries) {
      for (const tag of ['comment', 'story']) {
        const data = await getJson(`https://hn.algolia.com/api/v1/search?${new URLSearchParams({ query: q, tags: tag, hitsPerPage: '100', numericFilters: `created_at_i>${since}` })}`);
        for (const h of data.hits ?? []) {
          const text = tag === 'comment' ? stripHtml(h.comment_text) : [h.title, stripHtml(h.story_text)].filter(Boolean).join('\n\n');
          if (!text) continue;
          items.push(record({ slug, quote: text.slice(0, 2000), author: h.author, date: toDate(h.created_at), url: `https://news.ycombinator.com/item?id=${h.objectID}`, source: 'web', tags: ['hn', tag], notes: h.story_title ? `on "${h.story_title.slice(0, 60)}"` : '' }));
        }
        await jitter(300, 600);
      }
    }
    writeInbox('hn', slug, filterNew(slug, cfg, items));
  }
}

/* ---------- App Store ---------- */

async function collectAppStore() {
  const country = opts.country ?? 'us';
  for (const slug of slugs) {
    const cfg = sources[slug];
    if (!cfg.appstore_ids?.length) continue;
    console.log(`\n${cfg.name} (${slug})`);
    const items = [];
    for (const appId of cfg.appstore_ids) {
      for (let page = 1; page <= 10; page++) {
        let data;
        try {
          data = await getJson(`https://itunes.apple.com/${country}/rss/customerreviews/id=${appId}/sortBy=mostRecent/page=${page}/json`);
        } catch {
          break;
        }
        let entries = data.feed?.entry ?? [];
        if (!Array.isArray(entries)) entries = [entries];
        if (entries.length === 0) break;
        for (const e of entries) {
          const rating = Number(e['im:rating']?.label ?? 0);
          const reviewId = e.id?.label;
          if (!reviewId) continue;
          items.push(
            record({
              slug,
              quote: [e.title?.label, e.content?.label].filter(Boolean).join(' — '),
              author: e.author?.name?.label ?? 'App Store user',
              date: toDate(e.updated?.label),
              url: `https://apps.apple.com/${country}/app/id${appId}?see-all=reviews#review-${reviewId}`,
              source: 'appstore',
              tags: [`rating:${rating}`, `app:${appId}`],
              notes: `${rating}★, version ${e['im:version']?.label ?? '?'}`,
              kind: rating >= 4 ? 'praise' : rating <= 2 ? 'complaint' : 'other',
            }),
          );
        }
        await jitter(300, 600);
      }
    }
    // App Store reviews are about the app by definition; skip the mention check.
    const k = known(slug);
    writeInbox('appstore', slug, items.filter(r => !k.urls.has(normalizeUrl(r.url)) && !k.ids.has(r.id)));
  }
}

async function findApps() {
  for (const slug of slugs) {
    const cfg = sources[slug];
    const term = cfg.name.split(' /')[0];
    const data = await getJson(`https://itunes.apple.com/search?${new URLSearchParams({ term: `${term} ai`, entity: 'software', limit: '6' })}`);
    const hits = (data.results ?? []).map(r => `${r.trackId}  ${r.trackName}  by ${r.sellerName}  ${r.trackViewUrl}`);
    console.log(`\n${cfg.name} (${slug})${cfg.appstore_ids.length ? `  [configured: ${cfg.appstore_ids.join(', ')}]` : ''}`);
    console.log(hits.length ? hits.map(h => `  ${h}`).join('\n') : '  no App Store matches');
    await jitter(300, 600);
  }
  console.log('\nPaste the right trackId into data/sources.json under appstore_ids. Names collide: check the seller.');
}

/* ---------- Product Hunt ---------- */

async function collectProductHunt() {
  const token = process.env.PRODUCT_HUNT_TOKEN;
  if (!token) fail('Set PRODUCT_HUNT_TOKEN (developer token from producthunt.com/v2/oauth/applications).');
  for (const slug of slugs) {
    const cfg = sources[slug];
    if (!cfg.ph_slug) continue;
    console.log(`\n${cfg.name} (${slug})`);
    const query = `query($slug:String!){ post(slug:$slug){ name url comments(first:100){ edges{ node{ id body createdAt url user{ username name } } } } } }`;
    const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({ query, variables: { slug: cfg.ph_slug } }),
    });
    const json = await res.json();
    const post = json.data?.post;
    if (!post) {
      console.log(`  no post for slug "${cfg.ph_slug}"`);
      continue;
    }
    const items = (post.comments?.edges ?? []).map(({ node }) =>
      record({ slug, quote: node.body, author: `@${node.user?.username}`, author_name: node.user?.name ?? '', date: toDate(node.createdAt), url: node.url, source: 'producthunt', tags: [], notes: `on ${post.url}` }),
    );
    const k = known(slug);
    writeInbox('producthunt', slug, items.filter(r => !k.urls.has(normalizeUrl(r.url)) && !k.ids.has(r.id)));
    await jitter(500, 1000);
  }
}

/* ---------- Inbox -> feedback.json ---------- */

async function merge() {
  const only = opts.source ? String(opts.source).split(',') : null;
  let total = 0;
  for (const slug of slugs) {
    const file = feedbackFile(slug);
    const feedback = readJson(file, []);
    const urls = new Set(feedback.map(r => normalizeUrl(r.url)));
    const ids = new Set(feedback.map(r => r.id));
    let added = 0;
    if (!fs.existsSync(INBOX)) break;
    for (const src of fs.readdirSync(INBOX)) {
      if (only && !only.includes(src)) continue;
      const inbox = inboxFile(src, slug);
      const items = readJson(inbox, []);
      if (!items.length) continue;
      const keep = [];
      for (const r of items) {
        const u = normalizeUrl(r.url);
        if (urls.has(u) || ids.has(r.id)) continue;
        urls.add(u);
        ids.add(r.id);
        feedback.push(r);
        added++;
      }
      fs.writeFileSync(inbox, JSON.stringify(keep, null, 2) + '\n');
    }
    if (added) {
      fs.writeFileSync(file, JSON.stringify(feedback, null, 2) + '\n');
      console.log(`  ${slug}: +${added} -> ${path.relative(ROOT, file)}`);
      total += added;
    }
  }
  console.log(`merged ${total} quotes`);
  await reindex();
}

async function reindex() {
  const indexFile = path.join(DATA, 'index.json');
  const index = readJson(indexFile, null);
  if (!index) fail('data/index.json missing');
  let total = 0;
  for (const a of index.agents) {
    a.feedback_count = readJson(feedbackFile(a.slug), []).length;
    total += a.feedback_count;
  }
  index.feedback_count = total;
  index.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
  console.log(`index.json: ${index.agents.length} agents, ${total} quotes, updated ${index.updated}`);
}

/* ---------- Entry point (last, so every helper above is initialized) ---------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
