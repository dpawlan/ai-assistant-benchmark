import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = readFileSync('src/lib/travel-transcripts.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', 'require', code)(mod, mod.exports, name => require(resolve('src/lib', name)));
const { getTravelTranscript } = mod.exports;
const reviewed = { 'grok-bot': [1, 2], miso: [1, 2], dots: [2], muse: [2], instinct: [3] };
const sensitivePatterns = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /https?:\/\//i,
  /\b\d{7,}\b/,
  /\b(?:\d[ -]?){13,19}\b/,
  /(?:ending|····)\s*\d{3,4}\b/i,
  /(?<!\d)\d{1,2}[/-]\d{1,2}[/-](?:19|20)?\d{2}(?!\d)/,
  /\b\d+\s+(?:[A-Za-z]+\s+){0,3}(?:Street|Avenue|Ave)\b/i,
];
for (const [agent, rounds] of Object.entries(reviewed)) {
  for (const round of rounds) {
    const messages = getTravelTranscript(agent, round);
    assert.ok(messages.length > 0, `${agent}: reviewed session is available`);
    for (const message of messages) {
      assert.ok(['user', 'agent'].includes(message.role));
      assert.equal(typeof message.text, 'string');
      for (const pattern of sensitivePatterns) assert.ok(!pattern.test(message.text), `${agent}: sensitive pattern remains`);
    }
  }
}
for (const [agent, round] of [['instinct', 1], ['instinct', 2], ['muse', 1], ['dots', 1], ['soar', 3], ['unknown', 1], ['constructor', 1], ['miso', 99]]) {
  assert.deepEqual(getTravelTranscript(agent, round), [], 'Unreviewed sessions must never fall back to another transcript');
}
assert.match(getTravelTranscript('instinct', 3).map(m => m.text).join('\n'), /\$443\.40/);
assert.ok(getTravelTranscript('grok-bot', 1).some(m => m.text.includes('The change went through')));
assert.ok(getTravelTranscript('miso', 1).some(m => m.text.includes('team member is sorting')));
console.log('Public transcripts: five reviewed assistants, sensitive-pattern checks, latest-session mapping and unknown-session exclusion passed. Manual review is also required for new exports.');
