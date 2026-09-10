#!/usr/bin/env node
/**
 * Lint the public `notes` on every run in data/agents/<slug>/runs.json.
 *
 *   node scripts/lint-notes.mjs          # exits 1 on any error (runs as `prebuild`)
 *   npm run lint:notes
 *
 * A note is one sentence, under 140 characters, in the third person, saying what was asked and what the
 * assistant did. It may name businesses the assistant chose. It must never carry phone numbers, emails,
 * people's names, the test harness, the reviewer's account state (connections, logins, cards, trials) or
 * anything about scoring. Errors block the build; warnings only print.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_LEN = 140;

const ERRORS = [
  [/\+?1?\d{10}\b|\b\d{3}-\d{3}-\d{4}\b/, 'phone number'],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/, 'email address'],
  [/David Pawlan/i, "reviewer's full name"],
  [/\bBlooio\b/i, 'harness name'],
  [/\btester\b/i, '"tester"'],
  [/\bprotocol\b/i, '"protocol"'],
  [/\bper David\b/i, '"per David"'],
  [/Claude-scored/i, '"Claude-scored"'],
  [/Category changed/i, '"Category changed"'],
  [/\bbanded\b|\bcalibration\b|anchor band/i, 'scoring band language'],
  [/\bn\/a\b/i, '"n/a"'],
  [/\bscored?\b|\brevised\b|→/i, 'scoring language'],
  [/not a capability fail/i, 'scoring language'],
  [/not connected|connect (link|flow|gate|path)|\bOAuth\b|sign-in|signed in|credentials|\bvault\b|paywall|free trial|\bcoupon\b|card on (my|the|your) account|payment card|\bwallet\b|deposit pending|repository permissions|deployment protection/i, "reviewer's account or setup state"],
];

const WARNINGS = [
  [/\b(I|my|me|myself)\b/, 'first person'],
  [/\breviewer\b/i, '"reviewer"'],
];

/** @returns {{ errors: string[], warnings: string[] }} */
export function lintNote(text) {
  const errors = [];
  const warnings = [];
  const note = (text ?? '').trim();
  if (!note) return { errors, warnings: ['empty note'] };
  for (const [re, why] of ERRORS) if (re.test(note)) errors.push(why);
  for (const [re, why] of WARNINGS) if (re.test(note)) warnings.push(why);
  if (note.length > MAX_LEN) warnings.push(`${note.length} chars (max ${MAX_LEN})`);
  if ((note.match(/[.!?]\s+[A-Z]/g) ?? []).length > 0) warnings.push('more than one sentence');
  return { errors, warnings };
}

export function lintAll(root = process.cwd()) {
  const agents = path.join(root, 'data', 'agents');
  const problems = { errors: 0, warnings: 0, runs: 0 };
  for (const slug of fs.readdirSync(agents).sort()) {
    const file = path.join(agents, slug, 'runs.json');
    if (!fs.existsSync(file)) continue;
    const runs = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const r of runs) {
      problems.runs++;
      const { errors, warnings } = lintNote(r.notes);
      for (const e of errors) console.error(`ERROR ${slug} ${r.id}: ${e}`);
      for (const w of warnings) console.warn(`warn  ${slug} ${r.id}: ${w}`);
      problems.errors += errors.length;
      problems.warnings += warnings.length;
    }
  }
  return problems;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const p = lintAll();
  console.log(`notes: ${p.runs} runs, ${p.errors} error(s), ${p.warnings} warning(s)`);
  if (p.errors) {
    console.error('Run notes are public. Fix the errors above (see scripts/lint-notes.mjs) before building.');
    process.exit(1);
  }
}
