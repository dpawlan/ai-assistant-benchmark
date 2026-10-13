/** Render the travel report's header as a 1200×630 share card. Run from the repo root. */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';

const assistants = [
  ['miso', 'Miso'], ['instinct', 'Instinct'], ['grok-bot', 'GrokBot'], ['dots', 'Dots'], ['muse', 'Muse'],
];
const planePath = 'm12 0 3 9 9 5v3l-9-2v6l3 2v1l-6-1-6 1v-1l3-2v-6l-9 2v-3l9-5z';
const plane = (left, top, rotation) => h('svg', {
  width: 24, height: 24, viewBox: '0 0 24 24', fill: '#377eae',
  style: { position: 'absolute', left, top, opacity: .3, transform: `rotate(${rotation}deg)` },
}, h('path', { d: planePath }));
const card = h('div', { style: {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  width: 1200, height: 630, background: '#eef1f5', color: '#1d1d1f', fontFamily: 'Inter',
} },
  plane(105, 140, 60), plane(1025, 116, -80), plane(175, 455, 80), plane(1080, 470, -65),
  h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 76, fontWeight: 700, lineHeight: 1.07, letterSpacing: '-3.8px' } },
    h('div', null, 'Would you let AI'),
    h('div', { style: { color: '#0875e1' } }, 'book your next flight?'),
  ),
  h('div', { style: { display: 'flex', gap: 40, marginTop: 46 } },
    ...assistants.map(([slug, name]) => h('div', { key: slug, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80, gap: 13 } },
      h('img', { src: `data:image/png;base64,${readFileSync(`public/logos/${slug}.png`).toString('base64')}`, width: 56, height: 56, alt: name, style: { borderRadius: 15 } }),
      h('div', { style: { fontSize: 16, fontWeight: 500 } }, name),
    )),
  ),
  h('div', { style: { display: 'flex', marginTop: 28, fontSize: 17, fontWeight: 500 } }, 'By David Pawlan'),
  h('div', { style: { display: 'flex', position: 'absolute', bottom: 30, fontSize: 16, color: '#637080', fontWeight: 500 } }, 'Assistant Benchmark'),
);
const response = new ImageResponse(card, {
  width: 1200, height: 630,
  fonts: [
    { name: 'Inter', data: readFileSync('src/assets/fonts/Inter-Medium.ttf'), weight: 500, style: 'normal' },
    { name: 'Inter', data: readFileSync('src/assets/fonts/Inter-Bold.ttf'), weight: 700, style: 'normal' },
  ],
});
mkdirSync('public/og/reports', { recursive: true });
writeFileSync('public/og/reports/consumer-ai-travel.png', Buffer.from(await response.arrayBuffer()));
console.log('Created public/og/reports/consumer-ai-travel.png (1200×630).');
