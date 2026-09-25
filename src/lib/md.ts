/** Shared helpers for the markdown content in data/: frontmatter, splitting, excerpts. */

export interface Frontmatter {
  [key: string]: string | string[];
}

/** Parses `key: value` lines; a key followed by indented `- item` lines becomes a list. */
export function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) return { meta: {}, body: raw.trim() };
  const meta: Frontmatter = {};
  let lastKey: string | null = null;
  for (const line of m[1].split('\n')) {
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && lastKey) {
      const cur = meta[lastKey];
      meta[lastKey] = Array.isArray(cur) ? [...cur, item[1].trim()] : [item[1].trim()];
      continue;
    }
    const i = line.indexOf(':');
    if (i > 0) {
      lastKey = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
      meta[lastKey] = v === '' ? [] : v;
    }
  }
  return { meta, body: m[2].trim() };
}

export const str = (v: string | string[] | undefined, fallback = '') => (typeof v === 'string' ? v : fallback);
export const list = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v : typeof v === 'string' && v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
export const isTrue = (v: string | string[] | undefined) => typeof v === 'string' && /^(true|yes)$/i.test(v);

/** Split a markdown body into the text before the first heading of `level` and the sections after it. */
export function splitSections(body: string, level: 2 | 3): { lead: string; sections: { heading: string; body: string }[] } {
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'm');
  const parts = body.split(new RegExp(`^(?=${'#'.repeat(level)} )`, 'm'));
  const lead = parts[0] && !re.test(parts[0]) ? parts[0].trim() : '';
  const sections = parts
    .filter(p => re.test(p))
    .map(p => {
      const [, heading] = re.exec(p)!;
      return { heading: heading.trim(), body: p.replace(re, '').trim() };
    });
  return { lead, sections };
}

/** First paragraph, with inline markdown stripped, for cards and previews. */
export function excerpt(md: string): string {
  const first = md.split(/\n\s*\n/).map(s => s.trim()).find(s => s && !s.startsWith('#') && !s.startsWith('PREVIEW ONLY')) ?? '';
  return first
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/\n/g, ' ');
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
