import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const output = ts.transpileModule(readFileSync(new URL('../src/lib/travel-rollup.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
new Function('module', 'exports', 'require', output)(module, module.exports, require);
const { summarizeTravel, travelRankingScore, compareTravelRank } = module.exports;
const activeIds = JSON.parse(readFileSync(new URL('../data/travel-protocol-v1.json', import.meta.url), 'utf8')).map(t => t.id);
const ids = Array.from({ length: 17 }, (_, i) => i + 1);
const run = (dimension, score = 8, extras = {}) => ({ id: `r${dimension}`, agent: 'example', dimension, score, date: '2026-10-04', evidence_url: '/evidence/example', reviewed: true, version: 'travel-v1', ...extras });
assert.deepEqual(summarizeTravel('example', ids, [], 6), { scores: {}, runs: {}, completed: 0, total: 17, score: null, legacyScore: 6 });
assert.equal(summarizeTravel('example', ids, ids.slice(0, 16).map(id => run(id)), 6).score, 8);
assert.equal(summarizeTravel('example', ids, ids.map(id => run(id)), 6).score, 8);
const repeated = [...ids.map(id => run(id)), run(1, 10, { id: 'new', date: '2026-10-05' })];
assert.equal(summarizeTravel('example', ids, repeated).score, 8.1);
assert.deepEqual(summarizeTravel('example', ids, repeated), summarizeTravel('example', ids, [...repeated].reverse()));
assert.equal(summarizeTravel('example', ids, [run(1, 10, { reviewed: false }), run(2, 10, { version: 'old' }), run(3, 10, { agent: 'other' })]).completed, 0);
for (const invalid of [run(1, 11), run(1, 8, { evidence_url: '' }), run(18), run(1, 8, { date: 'invalid' })]) assert.throws(() => summarizeTravel('example', ids, [invalid]));
console.log('Travel rollup: empty, partial, complete, repeated, eligibility and invalid-result checks passed.');

// Exercise the actual data loader with in-memory fixtures; never write test scores.
const fs = require('node:fs');
const path = require('node:path');
const originalRead = fs.readFileSync;
const originalTsLoader = require.extensions['.ts'];
require.extensions['.ts'] = (loaded, filename) => {
  const source = originalRead(filename, 'utf8');
  loaded._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
};
try {
  const { getAgentDetail } = require('../src/lib/data.ts');
  const baseline = getAgentDetail('muse');
  assert.equal(baseline.travel.score, null);
  assert.equal(baseline.scores.travel, baseline.travel.legacyScore);
  const resultsPath = path.resolve('data/travel-results.json');
  assert.equal(getAgentDetail('miso').travel.completed, 3);
  assert.equal(getAgentDetail('instinct').travel.completed, 1);
  assert.equal(getAgentDetail('soar').travel.completed, 0);
  assert.equal(getAgentDetail('miso').travel.total, 5);
  assert.deepEqual(Object.keys(getAgentDetail('miso').travel.scores), ['5', '6', '7']);
  let fixture = [...activeIds.map(id => run(id, 8, { agent: 'muse' })), run(1, 1, { agent: 'muse' })];
  fs.readFileSync = function(file, ...options) {
    if (String(file) === resultsPath) return JSON.stringify(fixture);
    return originalRead.call(this, file, ...options);
  };
  delete require.cache[require.resolve('../src/lib/data.ts')];
  const complete = require('../src/lib/data.ts').getAgentDetail('muse');
  assert.equal(complete.scores.travel, complete.travel.score);
  assert.equal(complete.scores.travel, 8);
  assert.equal(complete.travel.completed, 5);
  assert.equal(complete.travel.scores[1], undefined);
  assert.equal(complete.latestRuns.travel, undefined);
  const numeric = Object.values(complete.scores).filter(v => typeof v === 'number');
  assert.equal(complete.overall, Math.round(numeric.reduce((a,b) => a+b, 0) / numeric.length * 10) / 10);
  fixture = fixture.slice(0, 1);
  delete require.cache[require.resolve('../src/lib/data.ts')];
  const partial = require('../src/lib/data.ts').getAgentDetail('muse');
  assert.equal(partial.scores.travel, 8);
  assert.equal(partial.scores.travel, partial.travel.score);
  assert.equal(partial.latestRuns.travel, undefined);

  assert.equal(partial.travel.completed, 1);
  console.log('Data loader: General/suite alignment, single inclusion in overall, legacy fallback and evidence provenance passed.');
} finally {
  fs.readFileSync = originalRead;
  if (originalTsLoader) require.extensions['.ts'] = originalTsLoader;
  else delete require.extensions['.ts'];
}

const actual = JSON.parse(readFileSync(new URL('../data/travel-results.json', import.meta.url), 'utf8'));
const miso = summarizeTravel('miso', ids, actual);
for (const id of [5, 6, 7]) assert.equal(miso.scores[id], 10);
assert.equal(miso.scores[13], undefined);
assert.equal(miso.score, 10);
for (const result of actual) {
  assert.ok(result.notes);
  if (result.evidence_url.startsWith('/agents/')) {
    const [, , agent, , evidence] = result.evidence_url.split('/');
    const source = JSON.parse(readFileSync(new URL(`../data/agents/${agent}/evidence/${evidence}.json`, import.meta.url), 'utf8'));
    assert.equal(source.agent, agent);
  }
}
assert.equal(new Set(actual.map(r => r.id)).size, actual.length);
console.log('Published dimension scores: Miso outcomes, untested check-in, unique IDs and evidence files passed.');

const ranked = (name, values) => ({ name, travel: summarizeTravel('example', ids, values.map((value, index) => run(index + 1, value))) });
const one = ranked('Boba', [10]);
const two = ranked('Caddy', [10, 10]);
const three = ranked('Instinct', [10, 10, 10]);
const five = ranked('Miso', [10, 10, 10, 10, 10]);
assert.deepEqual([one, two, three, five].sort(compareTravelRank).map(a => a.name), ['Miso', 'Instinct', 'Caddy', 'Boba']);
assert.equal(travelRankingScore(one.travel), 6.25);
assert.equal(travelRankingScore(five.travel), 8.125);
assert.equal(travelRankingScore(ranked('Untested', []).travel), null);
assert.deepEqual([ranked('Untested', []), ranked('Low', [1])].sort(compareTravelRank).map(a => a.name), ['Low', 'Untested']);
assert.ok(compareTravelRank(one, ranked('Poor broader coverage', [2, 2, 2, 2, 2])) < 0);
assert.ok(compareTravelRank(ranked('Alpha', [10]), ranked('Zulu', [10])) < 0);
assert.equal(five.travel.score, 10);
assert.equal(one.travel.score, 10);
assert.equal(travelRankingScore(summarizeTravel('example', ids, [run(1, 10), run(1, 10, { id: 'repeat', date: '2026-10-05' })])), 6.25);
console.log('Travel ranking: coverage, quality, unscored placement, ties, repeated tests and unchanged averages passed.');
