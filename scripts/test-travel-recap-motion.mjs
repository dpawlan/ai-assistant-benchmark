import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/travel-recap-motion.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
new Function('module', 'exports', output)(module, module.exports);
const { createRecapSceneRenderer } = module.exports;

// DOM doubles count attempted writes (including redundant ones) without needing a browser.
let writes = 0;
function element() {
  const values = {};
  const style = new Proxy({
    setProperty(key, value) { writes++; values[key] = value; },
    removeProperty(key) { writes++; delete values[key]; },
  }, {
    set(_, key, value) { writes++; values[key] = value; return true; },
    get(target, key) { return key in target ? target[key] : values[key]; },
  });
  const attributes = {};
  const dataset = new Proxy({}, { set(target, key, value) { writes++; target[key] = value; return true; } });
  return {
    values, style, attributes, dataset,
    set inert(value) { writes++; this.isInert = value; },
    setAttribute(key, value) { writes++; attributes[key] = value; },
    removeAttribute(key) { writes++; delete attributes[key]; if (key.startsWith('data-')) delete dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())]; },
  };
}
function scene(index) {
  const section = element(), heading = element(), canvas = element();
  section.querySelector = selector => selector === '[data-scene-heading]' ? heading : canvas;
  return { section, heading, canvas, renderer: createRecapSceneRenderer(section, index, 9) };
}
const scenes = Array.from({ length: 9 }, (_, index) => scene(index));
function render(position, active = Math.min(8, Math.max(0, Math.floor(position)))) {
  scenes.forEach(scene => scene.renderer.render(Math.min(9, Math.max(0, position)), active, position));
}
const snapshot = () => JSON.stringify(scenes.map(({ section, heading, canvas }) => [section.values, section.dataset, section.attributes, section.isInert, heading.values, canvas.values]));

// At the boundary the existing cross-fade is 50/50, with exactly one focusable scene.
render(2);
assert.ok(Math.abs(Number(scenes[1].section.style.opacity) - .5) < 1e-12);
assert.ok(Math.abs(Number(scenes[2].section.style.opacity) - .5) < 1e-12);
assert.equal(scenes.filter(scene => scene.section.dataset.sceneVisible === 'true').length, 2);
assert.equal(scenes[2].section.isInert, false);
assert.equal(scenes[1].section.isInert, true);
assert.equal(scenes[2].heading.style.opacity, '0');
render(2.5);
assert.equal(scenes[2].section.style.opacity, '1');
assert.equal(scenes[2].heading.style.opacity, '1');
assert.equal(scenes[2].canvas.style['--scene-progress'], '0.5');
// Scene/title styles must not cascade through the entire illustrated subtree.
assert.equal(scenes[2].section.style['--scene-progress'], undefined);
const stationaryWrites = writes;
render(2.5);
assert.equal(writes, stationaryWrites, 'stationary/duplicate scroll events do no DOM work');

// Fast jumps and reverse scrolling restore the same animation/accessibility state.
const positions = [0, .67, .9, 1, 1.1, 1.67, 2, 2.67, 4.95, 5, 6.67, 8.67, 9];
const forward = positions.map(position => { render(position); return snapshot(); });
for (let i = positions.length - 1; i >= 0; i--) {
  render(positions[i]);
  assert.equal(snapshot(), forward[i], `reverse scroll at ${positions[i]}`);
}
render(9, 9);
assert(scenes.every(scene => scene.section.isInert), 'comparison chapter releases all scene focus');

// Within a chapter only its progress changes; all eight settled scenes stay untouched.
render(2.4);
const before = writes;
for (let i = 1; i <= 120; i++) render(2.4 + i / 600);
const scrollWrites = writes - before;
assert.equal(scrollWrites, 120, 'one illustration progress write per frame, not nine scene rewrites');
console.log(`Travel motion: ${scrollWrites} DOM writes over 120 mid-chapter frames; cross-fades, reverse scrolling and focus states passed.`);

// Turning motion off clears all inline transforms/fades and allows normal reading.
scenes.forEach(scene => scene.renderer.reset());
assert(scenes.every(scene => !scene.section.isInert && !scene.section.attributes['aria-hidden']));
assert(scenes.every(scene => !scene.section.style.opacity && !scene.heading.style.transform && !scene.canvas.style['--scene-progress']));
render(2.5);
assert.equal(scenes[2].section.style.opacity, '1', 'animation can re-enable after reduced-motion mode');
console.log('Travel motion: normal-flow reset and re-enable passed.');
