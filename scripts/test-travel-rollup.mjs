import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const output = ts.transpileModule(readFileSync(new URL('../src/lib/travel-rollup.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const fixtureModule = { exports: {} };
new Function('module', 'exports', 'require', output)(fixtureModule, fixtureModule.exports, require);
const { summarizeTravel, travelRankingScore, compareTravelRank } = fixtureModule.exports;
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
  const baseline = getAgentDetail('boba');
  assert.equal(baseline.travel.score, null);
  assert.equal(baseline.scores.travel, baseline.travel.legacyScore);
  const resultsPath = path.resolve('data/travel-results.json');
  assert.equal(getAgentDetail('miso').travel.completed, 8);
  assert.equal(getAgentDetail('instinct').travel.completed, 8);
  for (const agent of ['instinct', 'grok-bot']) assert.equal(getAgentDetail(agent).travel.scores[7], 10);
  assert.equal(getAgentDetail('soar').travel.completed, 5);
  assert.equal(getAgentDetail('miso').travel.total, 8);
  assert.deepEqual(Object.keys(getAgentDetail('miso').travel.scores), ['5', '6', '7', '8', '9', '18', '19', '20']);
  let fixture = [...activeIds.map(id => run(id, 8, { agent: 'muse' })), run(1, 1, { agent: 'muse' })];
  fs.readFileSync = function(file, ...options) {
    if (String(file) === resultsPath) return JSON.stringify(fixture);
    return originalRead.call(this, file, ...options);
  };
  delete require.cache[require.resolve('../src/lib/data.ts')];
  const complete = require('../src/lib/data.ts').getAgentDetail('muse');
  assert.equal(complete.scores.travel, complete.travel.score);
  assert.equal(complete.scores.travel, 8);
  assert.equal(complete.travel.completed, activeIds.length);
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
  const previousNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'development';
    fixture = activeIds.map(id => run(id, 8, { agent: 'muse' }));
    const liveData = require('../src/lib/data.ts');
    assert.equal(liveData.getAgentDetail('muse').travel.score, 8);
    fixture = activeIds.map(id => run(id, 10, { agent: 'muse' }));
    assert.equal(liveData.getAgentDetail('muse').travel.score, 10);
    console.log('Development preview: score file changes are reflected without a server restart.');
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }

} finally {
  fs.readFileSync = originalRead;
  if (originalTsLoader) require.extensions['.ts'] = originalTsLoader;
  else delete require.extensions['.ts'];
}

const actual = JSON.parse(readFileSync(new URL('../data/travel-results.json', import.meta.url), 'utf8'));
const miso = summarizeTravel('miso', activeIds, actual.filter(r => activeIds.includes(r.dimension)));
for (const id of [6, 7]) assert.equal(miso.scores[id], 10);
assert.equal(miso.scores[13], undefined);
assert.equal(miso.scores[8], 7);
assert.equal(miso.scores[9], 10);
assert.equal(miso.score, 9.3);
const instinct = summarizeTravel('instinct', activeIds, actual.filter(r => activeIds.includes(r.dimension)));
assert.equal(instinct.scores[5], 7);
assert.equal(instinct.scores[18], 7);
assert.equal(instinct.scores[6], 10);
assert.equal(instinct.scores[7], 10);
assert.equal(instinct.score, 8);
for (const slug of ['instinct', 'grok-bot', 'miso', 'muse', 'dots']) assert.equal(summarizeTravel(slug, activeIds, actual.filter(r => activeIds.includes(r.dimension))).scores[7], slug === 'muse' ? 7 : 10);
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
console.log('Travel ranking: coverage, quality, unscored placement, ties and repeated tests passed.');

for (const [slug, expected] of [['grok-bot', 7.9], ['dots', 7.1], ['muse', 6.9]]) { assert.equal(summarizeTravel(slug, activeIds, actual.filter(r => activeIds.includes(r.dimension))).score, expected); }
assert.equal(miso.scores[5], 7);
const grok = summarizeTravel('grok-bot', activeIds, actual.filter(r => activeIds.includes(r.dimension)));
assert.equal(grok.scores[5], 10);
for (const id of [6, 8]) assert.equal(grok.scores[id], 9);
assert.equal(grok.scores[9], 7);

// The latest retest supersedes earlier outcomes without erasing them.
assert.equal(instinct.runs[5].date, '2026-10-08');
assert.equal(instinct.scores[8], 7);
assert.equal(instinct.scores[9], 3);
const soar = summarizeTravel('soar', activeIds, actual.filter(r => activeIds.includes(r.dimension)));
assert.equal(soar.scores[5], 10);
assert.equal(soar.scores[8], undefined);
assert.equal(soar.scores[9], undefined);
assert(actual.some(r => r.agent === 'soar' && r.dimension === 5 && r.date === '2026-10-06' && r.score === 3));

// A complete suite gives speed exactly 40%, with 60% split across the other seven.
const weightedSummary = values => summarizeTravel('example', activeIds, activeIds.map(id => run(id, values[id] ?? 10)));
const slow = weightedSummary({ 19: 1 });
assert.equal(slow.score, 6.4);
assert.equal(travelRankingScore(slow), (6.4 * 8 + 15) / 11);
assert.equal(weightedSummary({ 5: 1 }).score, 9.2);
assert.equal(weightedSummary({ 19: 10, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 18: 1, 20: 1 }).score, 4.6);

// Unscored dimensions remain blank, never zero. Renormalize only observed weights.
const speedOnly = summarizeTravel('example', activeIds, [run(19, 9)]);
assert.equal(speedOnly.score, 9);
assert.equal(speedOnly.completed, 1);
assert.equal(speedOnly.scores[5], undefined);
assert.equal(travelRankingScore(speedOnly), (9 + 15) / 4);
const missingSpeed = summarizeTravel('example', activeIds, [run(5, 10), run(6, 2)]);
assert.equal(missingSpeed.score, 6);
assert.equal(missingSpeed.scores[19], undefined);
assert.equal(travelRankingScore(missingSpeed), (6 * 2 + 15) / 5);
const partialWeighted = summarizeTravel('example', activeIds, [run(19, 10), run(5, 2)]);
const partialMean = (10 * 14 + 2 * 3) / 17;
assert.equal(partialWeighted.score, Math.round(partialMean * 10) / 10);
assert.equal(travelRankingScore(partialWeighted), (partialMean * 2 + 15) / 5);
assert.equal(travelRankingScore(summarizeTravel('example', activeIds, [run(19, 1), run(19, 10, { id: 'retest', date: '2026-10-05' }), run(5, 2)])), travelRankingScore(partialWeighted));
const cohort = ['miso', 'instinct', 'grok-bot', 'dots', 'muse'].map(slug => ({ name: slug, travel: summarizeTravel(slug, activeIds, actual.filter(r => activeIds.includes(r.dimension))) }));
assert.deepEqual(cohort.sort(compareTravelRank).map(assistant => assistant.name), ['miso', 'instinct', 'grok-bot', 'dots', 'muse']);
for (const assistant of cohort) {
  const qualitySum = Object.entries(assistant.travel.scores).filter(([id]) => id !== '19').reduce((sum, [, score]) => sum + score, 0);
  const expected = (assistant.travel.scores[19] * 14 + qualitySum * 3) / 35;
  assert.equal(assistant.travel.score, Math.round(expected * 10) / 10);
  assert.equal(travelRankingScore(assistant.travel), (expected * 8 + 15) / 11);
}
console.log('40% booking-speed weighting: full suite, missing-dimension renormalization, coverage priors, raw ranking precision and current cohort order passed.');
