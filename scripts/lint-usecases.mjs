#!/usr/bin/env node
/**
 * Lint data/jobs.json (the use-cases page).
 *
 *   node scripts/lint-usecases.mjs      # exits 1 on any error (runs as `prebuild`)
 *   npm run lint:usecases
 *
 * A job is a canonical task, not a post. Every evidence quote must exist in that agent's feedback.json and must not be
 * a founder, vendor or promo post; every run id must exist; a quote reused across jobs only warns (roundup posts); and a job needs
 * at least one public post as evidence: our own runs show who can do a job, but never justify listing it. Errors block the build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const KEY_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const OUTCOMES = new Set(['done', 'partial', 'failed']);
const SOURCES = new Set(['posted', 'assumed']);
const EXCLUDED_TAGS = new Set(['founder', 'vendor', 'promo']);

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function lintAll(root = process.cwd()) {
  const errors = [];
  const warnings = [];
  const data = path.join(root, 'data');
  const file = readJson(path.join(data, 'jobs.json'), null);
  if (!file) return { errors: ['data/jobs.json missing or invalid JSON'], warnings, jobs: 0 };
  if (file.version !== 2) errors.push(`version must be 2 (got ${file.version})`);

  const groups = new Set((file.groups ?? []).map(g => g.key));
  const categories = new Set(readJson(path.join(data, 'categories.json'), []).map(c => c.key));
  const roster = readJson(path.join(data, 'index.json'), { agents: [] }).agents;
  const agents = new Set(roster.map(a => a.slug));

  const quotes = new Map(); // "agent/id" -> quote
  const opinions = new Map(); // agent -> opinion quotes
  const runs = new Map(); // run id -> {agent, run}
  const testedByDimension = new Map(); // category -> Set(agent)
  for (const a of roster) {
    const dir = path.join(data, 'agents', a.slug);
    for (const q of readJson(path.join(dir, 'feedback.json'), [])) quotes.set(`${a.slug}/${q.id}`, q);
    opinions.set(a.slug, readJson(path.join(dir, 'opinion.json'), { quotes: {} }).quotes ?? {});
    const latest = new Map();
    for (const r of readJson(path.join(dir, 'runs.json'), [])) {
      runs.set(r.id, { agent: a.slug, run: r });
      latest.set(r.category, r);
    }
    for (const [cat, r] of latest) {
      if (typeof r.score !== 'number') continue;
      if (!testedByDimension.has(cat)) testedByDimension.set(cat, new Set());
      testedByDimension.get(cat).add(a.slug);
    }
  }

  const keys = new Set();
  const quoteOwner = new Map();
  const usedGroups = new Set();
  for (const job of file.jobs ?? []) {
    const tag = `job ${job.key ?? '(no key)'}`;
    if (!KEY_RE.test(job.key ?? '')) errors.push(`${tag}: key must match ${KEY_RE}`);
    if (keys.has(job.key)) errors.push(`${tag}: duplicate key`);
    keys.add(job.key);
    if (!job.title) errors.push(`${tag}: missing title`);
    else if (job.title.length > 60) warnings.push(`${tag}: title over 60 chars`);
    if (!job.one_liner) errors.push(`${tag}: missing one_liner`);
    else if (job.one_liner.length > 120) warnings.push(`${tag}: one_liner over 120 chars`);
    if (!groups.has(job.group)) errors.push(`${tag}: group "${job.group}" not in groups`);
    usedGroups.add(job.group);
    if (job.dimension && !categories.has(job.dimension)) errors.push(`${tag}: dimension "${job.dimension}" not in categories.json`);
    if (!job.prompt) errors.push(`${tag}: missing prompt`);
    if (!SOURCES.has(job.prompt_source)) errors.push(`${tag}: prompt_source must be posted|assumed`);
    if (!DATE_RE.test(job.added ?? '')) errors.push(`${tag}: added must be YYYY-MM-DD`);
    if (job.submitted_by && (typeof job.submitted_by.handle !== 'string' || typeof job.submitted_by.vendor !== 'boolean'))
      errors.push(`${tag}: submitted_by needs {handle, vendor}`);

    const evidence = Array.isArray(job.evidence) ? job.evidence : [];
    const pairs = new Set();
    let liveEvidence = 0;
    for (const e of evidence) {
      const pair = `${e.agent}/${e.quote}`;
      if (pairs.has(pair)) errors.push(`${tag}: evidence ${pair} listed twice`);
      pairs.add(pair);
      if (!agents.has(e.agent)) {
        errors.push(`${tag}: evidence agent "${e.agent}" not on the roster`);
        continue;
      }
      const q = quotes.get(pair);
      if (!q) {
        errors.push(`${tag}: evidence quote ${pair} not found in feedback.json`);
        continue;
      }
      // The site owner's own posts are excluded from opinion but may stand as evidence; they render with his handle.
      const insider = q.source !== 'david-post' && (q.tags ?? []).some(t => EXCLUDED_TAGS.has(t));
      if (insider && job.submitted_by?.vendor === true && q.source === 'submission') warnings.push(`${tag}: evidence ${pair} is the vendor's own submission (labelled on the page)`);
      else if (insider) errors.push(`${tag}: evidence ${pair} is a founder/vendor/promo post`);
      else liveEvidence++;
      const owner = quoteOwner.get(pair);
      if (owner && owner !== job.key) warnings.push(`${tag}: quote ${pair} is also evidence for job ${owner} (fine for roundup posts)`);
      quoteOwner.set(pair, job.key);
      if (e.outcome && !OUTCOMES.has(e.outcome)) errors.push(`${tag}: outcome "${e.outcome}" must be done|partial|failed`);
      if (e.note && e.note.length > 220) warnings.push(`${tag}: note for ${pair} over 220 chars`);
      const op = opinions.get(e.agent)?.[e.quote];
      if (op && Object.values(op).every(v => v === 'neutral')) warnings.push(`${tag}: quote ${pair} is classified neutral-only in opinion.json`);
    }

    const jobRuns = Array.isArray(job.runs) ? job.runs : [];
    let liveRuns = 0;
    for (const id of jobRuns) {
      if (!runs.has(id)) errors.push(`${tag}: run "${id}" not found in any runs.json`);
      else liveRuns++;
    }
    if (job.benchmark_task === true && !job.dimension) errors.push(`${tag}: benchmark_task needs a dimension`);
    // A job earns its place only when a real person reported it publicly or submitted it. Our own runs can show who
    // can do it, but they cannot be the reason it is listed.
    if (liveEvidence === 0 && !job.submitted_by) errors.push(`${tag}: needs at least one public post or a submission as evidence; our own runs are not enough`);
    if (job.benchmark_task === true && jobRuns.length) warnings.push(`${tag}: benchmark_task is ignored while explicit runs are set`);
  }
  for (const g of groups) if (!usedGroups.has(g)) warnings.push(`group "${g}" has no jobs`);
  return { errors, warnings, jobs: (file.jobs ?? []).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors, warnings, jobs } = lintAll();
  for (const w of warnings) console.log(`  warn  ${w}`);
  for (const e of errors) console.log(`  ERROR ${e}`);
  console.log(`usecases: ${jobs} jobs, ${errors.length} error(s), ${warnings.length} warning(s)`);
  if (errors.length) process.exit(1);
}
