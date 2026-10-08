import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const output = ts.transpileModule(readFileSync(new URL('../src/lib/travel-speed.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', output)(mod, mod.exports);
const { bookingSpeedScore, BOOKING_SPEED_BANDS } = mod.exports;
for (const { maxMinutes, score } of BOOKING_SPEED_BANDS) {
  assert.equal(bookingSpeedScore(maxMinutes, 'completed'), score);
  assert.equal(bookingSpeedScore(maxMinutes + 0.01, 'completed'), score - 1);
}
for (const minutes of [null, 0, -1, NaN, Infinity]) assert.equal(bookingSpeedScore(minutes, 'completed'), null);
assert.equal(bookingSpeedScore(1, 'not_completed'), null);
const timings = JSON.parse(readFileSync(new URL('../data/travel-completion-times.json', import.meta.url), 'utf8'));
for (const [agent, expected] of [['miso', 10], ['instinct', 8], ['grok-bot', 7], ['dots', 5], ['muse', 7]]) {
  const timing = timings.filter(t => t.agent === agent && t.dimension === 5).sort((a,b) => b.round - a.round)[0];
  assert.equal(bookingSpeedScore(timing.minutes, timing.status), expected);
}
console.log('Booking speed: threshold boundaries, invalid/uncompleted exclusions and current measurements passed.');
const runs = JSON.parse(readFileSync(new URL('../data/travel-results.json', import.meta.url), 'utf8'));
for (const timing of timings.filter(t => t.dimension === 5)) {
  const score = bookingSpeedScore(timing.minutes, timing.status);
  const date = timing.round === 1 ? '2026-10-06' : '2026-10-07';
  const run = runs.find(r => r.agent === timing.agent && r.dimension === 19 && r.date === date);
  assert.equal(run?.score ?? null, score, `${timing.agent} speed dimension matches measured timing`);
}
console.log('Equal-weight speed dimension scores match timing evidence; unsuccessful attempts are excluded.');

for (const t of timings.filter(t => t.dimension === 5 && t.status === 'completed')) { assert.equal(t.basis, 'flight-selected-booking-request-to-confirmation'); assert(t.request_to_confirmation_minutes >= t.minutes); }
