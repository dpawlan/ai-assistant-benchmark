const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '../..');
const inventoryPath = path.join(root, 'data/research/lifecycle/inventory.json');
const articlePath = path.join(root, 'data/articles/the-ai-agent-market-map.md');

const bands = [
  [['Big lab & big tech', '#254268']],
  [['Consumer personal assistants', '#25513f']],
  [['Shopping & commerce', '#8c412c'], ['Travel', '#2c5469'], ['Finance & money', '#44622f'], ['Email & calendar', '#755227']],
  [['Multiplayer & group chat', '#603762'], ['Home, family & health', '#48602e'], ['Voice & phone', '#8c3846'], ['Open source & self-hosted', '#2d4a3c']],
  [['Work & productivity', '#29384e']],
  [['Agent orchestration & collaboration', '#315761'], ['Agent marketplaces & autonomous businesses', '#78573c']],
  [['Agent infrastructure', '#373535']],
];

const appearanceKinds = new Set([
  'announcement', 'launch', 'preview', 'waitlist', 'beta', 'release', 'app_release',
  'public_evidence', 'rename', 'migration', 'relaunch',
]);

const palette = { background: '#f3efe5', panel: '#faf8f2', border: '#d9d2c4', ink: '#24201a', muted: '#6d675b' };
const width = 4000;
const margin = 80;
const gap = 24;
const rowHeight = 165;

function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function text(value, x, y, options = {}) {
  const { size = 23, weight = 500, fill = palette.ink, align = 'start', font = 'Arial', spacing = 0 } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}" text-anchor="${align}" letter-spacing="${spacing}">${xml(value)}</text>`;
}

function rect(x, y, w, h, fill, radius = 0, stroke = 'none') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${radius}" stroke="${stroke}" stroke-width="2"/>`;
}

function nameLines(name, limit) {
  const lines = [''];
  for (const word of name.split(' ')) {
    const last = lines.length - 1;
    const next = lines[last] ? `${lines[last]} ${word}` : word;
    if (lines[last] && next.length > limit) lines.push(word);
    else lines[last] = next;
  }
  return lines;
}

async function build() {
  const [inventoryRaw, article, currentLogos, pastLogos] = await Promise.all([
    fs.readFile(inventoryPath, 'utf8'),
    fs.readFile(articlePath, 'utf8'),
    fs.readdir(path.join(root, 'public/logos/map')),
    fs.readdir(path.join(root, 'public/logos/timeline')),
  ]);
  const inventory = JSON.parse(inventoryRaw);
  const [, asOf] = article.match(/^updated: (\d{4}-\d{2}-\d{2})$/m);
  const categories = bands.flatMap(band => band.map(([category]) => category));
  const knownLogos = new Set(currentLogos);
  const historicalLogos = new Set(pastLogos);
  const products = [...categories, 'Historical assistants'].flatMap(category =>
    inventory.filter(product => product.category === category).map(product => {
      const { id, name, website, mapped, events, availability } = product;
      const logo = mapped && knownLogos.has(`${id}.webp`) ? `/logos/map/${id}.webp` :
        historicalLogos.has(`${id}.png`) ? `/logos/timeline/${id}.png` : null;
      const first = events.filter(event => appearanceKinds.has(event.kind) && event.precision !== 'year' &&
        event.timeline_eligible !== false && event.date <= asOf).map(event => event.date.slice(0, 7)).sort()[0] ?? null;
      const closed = events.filter(event => event.kind === 'shutdown' && event.date <= asOf)
        .map(event => event.date.slice(0, 7)).sort()[0] ?? null;
      return { id, name, category, website, logo, mapped, first, closed, ...(availability ? { availability } : {}) };
    })
  );
  if (products.length !== inventory.length || new Set(products.map(product => product.id)).size !== products.length) {
    throw new Error('Every product must have a unique ID and a known map category.');
  }
  const mapped = products.filter(product => product.mapped);
  if (mapped.some(product => !product.logo)) throw new Error('A current map product is missing its logo.');

  const sections = {};
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(asOf));
  const marks = [
    text('ASSISTANT BENCHMARK', margin, 58, { size: 24, weight: 700, fill: palette.muted, spacing: 4 }),
    text('The AI Agent Market Map', margin, 157, { size: 103, font: 'Georgia', weight: 700 }),
    text(`V3  ·  ${mapped.length} products  ·  ${categories.length} categories`, width - margin, 106, { size: 32, weight: 600, align: 'end' }),
    text(date, width - margin, 151, { size: 26, align: 'end', fill: palette.muted }),
    rect(margin, 187, width - margin * 2, 2, palette.ink),
  ];
  const composites = [];
  let y = 212;

  for (const band of bands) {
    const bandWidth = (width - margin * 2 - gap * (band.length - 1)) / band.length;
    const columns = band.length === 1 ? 16 : band.length === 2 ? 8 : 5;
    let bottom = y;
    for (const [index, [category, color]] of band.entries()) {
      const members = mapped.filter(product => product.category === category);
      const x = margin + index * (bandWidth + gap);
      const height = 74 + Math.ceil(members.length / columns) * rowHeight;
      sections[category] = [x, y, bandWidth, height];
      marks.push(
        rect(x, y, bandWidth, height, palette.panel, 26, palette.border),
        rect(x + 30, y + 29, 18, 18, color, 4),
        text(category, x + 64, y + 46, { size: 27, weight: 700 }),
        text(members.length, x + bandWidth - 33, y + 46, { size: 24, weight: 600, fill: palette.muted, align: 'end' }),
      );
      const columnWidth = (bandWidth - 54) / columns;
      for (const [i, product] of members.entries()) {
        const center = Math.round(x + 27 + columnWidth * (i % columns + 0.5));
        const top = y + 68 + Math.floor(i / columns) * rowHeight;
        const logo = await sharp(path.join(root, 'public', product.logo)).resize(82, 82, {
          fit: 'contain', background: '#ffffff00',
        }).png().toBuffer();
        marks.push(rect(center - 47, top, 94, 94, '#ffffff', 18, palette.border));
        composites.push({ input: logo, left: center - 41, top: top + 6 });
        const displayName = product.id === 'taskmarket' ? 'Taskmarket' : product.name;
        const lines = nameLines(displayName, Math.floor(columnWidth / 10));
        for (const [line, label] of lines.entries()) {
          marks.push(text(label, center, top + 116 + line * 20, { size: 20, align: 'middle' }));
        }
        if (product.availability) {
          marks.push(text(product.availability, center, top + 117 + lines.length * 20, { size: 17, align: 'middle', fill: palette.muted }));
        }
      }
      bottom = Math.max(bottom, y + height);
    }
    y = bottom + gap;
  }

  const height = y + 17;
  const artwork = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${rect(0, 0, width, height, palette.background)}${marks.join('')}</svg>`);
  const png = await sharp(artwork).composite(composites).png().toBuffer();
  const hash = crypto.createHash('sha256').update(png).digest('hex').slice(0, 10);
  const hero = `/images/articles/ai-agent-market-map-${hash}.png`;
  await Promise.all([
    fs.writeFile(path.join(root, 'public', hero), png),
    fs.writeFile(path.join(root, 'data/market-map-artwork.json'), `${JSON.stringify({ hero, width, height, sections }, null, 2)}\n`),
    fs.writeFile(path.join(root, 'data/market-map-timeline.json'), `${JSON.stringify({ asOf, products }, null, 2)}\n`),
    fs.writeFile(articlePath, article.replace(/^hero: .*$/m, `hero: ${hero}`)),
  ]);
  console.log(`${mapped.length} current products, ${categories.length} categories, ${products.length} timeline entries`);
  console.log(hero);
}

build().catch(error => { console.error(error); process.exitCode = 1; });
