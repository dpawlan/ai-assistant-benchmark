import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/travel-recap-motion.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const fixtureModule = { exports: {} };
new Function('module', 'exports', output)(fixtureModule, fixtureModule.exports);
const { applyRecapSceneMotion } = fixtureModule.exports;
let writes = 0;
function element() {
  const styles = new Map(), attributes = new Map();
  let inert = false;
  return {
    style: { getPropertyValue: name => styles.get(name) ?? '', setProperty: (name, value) => { styles.set(name, value); writes++; } },
    dataset: new Proxy({}, { set: (target, name, value) => { target[name] = value; writes++; return true; } }),
    get inert() { return inert; }, set inert(value) { inert = value; writes++; },
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => { attributes.set(name, value); writes++; },
  };
}
const scenes = Array.from({ length: 9 }, () => ({ section: element(), heading: element() }));
function update(position, active = Math.floor(position), raw = position) {
  writes = 0;
  scenes.forEach(({ section, heading }, index) => applyRecapSceneMotion(section, heading, index, scenes.length, Math.max(0, Math.min(9, position)), raw, active));
  return writes;
}
update(2.4);
assert.equal(update(2.4), 0, 'A repeated frame must not touch the DOM');
assert.equal(update(2.41), 1, 'Only the active chapter progress changes in its settled state');
update(2.94);
assert.ok(update(3.04) <= 18, 'Only the outgoing/incoming layers change at a chapter transition');
assert.equal(scenes.filter(({ section }) => section.dataset.sceneVisible === 'true').length, 2);
assert.equal(scenes[2].section.inert, true);
assert.equal(scenes[3].section.inert, false);
assert.equal(scenes[3].section.getAttribute('aria-hidden'), 'false');
update(2.7);
assert.equal(scenes[2].section.inert, false, 'Reverse scrolling must restore chapter interactivity');
assert.equal(scenes[3].section.dataset.sceneVisible, 'false');
assert.equal(scenes[3].section.style.getPropertyValue('--scene-progress'), '0');
update(7.67);
assert.equal(scenes[7].section.dataset.sceneActive, 'true', 'A hash jump must skip safely to a distant chapter');
assert.equal(scenes[0].section.style.getPropertyValue('--scene-progress'), '1');
update(0, -1, -.2);
assert.equal(scenes.every(({ section }) => section.inert), true, 'Before the stage no chapter should take focus');
update(9, 9);
assert.equal(scenes.every(({ section }) => section.inert), true, 'The ordinary recap follows the final chapter');
assert.equal(update(9, 9), 0);
console.log('Recap motion: no repeated writes, one settled-frame write, bounded transitions, reverse scroll, hash jumps and accessibility state passed.');
