/** Pure head-to-head helpers, safe to import from client components. */
import { OpinionStat, Run, ScoreValue } from './types';

export interface CompareSide {
  slug: string;
  name: string;
  icon: string | null;
  tagline: string;
  site: string | null;
  overall: number | null;
  testedCount: number;
  opinionOverall: OpinionStat;
}

export type Winner = 'a' | 'b' | 'tie' | null;

export interface CompareRow {
  key: string;
  label: string;
  short: string;
  a: ScoreValue;
  b: ScoreValue;
  runA: Run | null;
  runB: Run | null;
  opinionA: OpinionStat | null;
  opinionB: OpinionStat | null;
  /** Higher latest-run score takes the check. Equal is a tie. Anything unscored on either side is left open. */
  winner: Winner;
}

export interface Tally {
  a: number;
  b: number;
  tie: number;
  /** Rows where at least one side has no tested score. */
  open: number;
  compared: number;
}

export interface Comparison {
  a: CompareSide;
  b: CompareSide;
  rows: CompareRow[];
  tally: Tally;
}

const SEP = '-vs-';

export function pairSlug(a: string, b: string): string {
  return `${a}${SEP}${b}`;
}

/** "poke-vs-grok-bot" -> ["poke", "grok-bot"]. Slugs never contain "-vs-". */
export function parsePair(pair: string): [string, string] | null {
  const i = pair.indexOf(SEP);
  if (i <= 0) return null;
  const a = pair.slice(0, i);
  const b = pair.slice(i + SEP.length);
  if (!a || !b || a === b || b.includes(SEP)) return null;
  return [a, b];
}

export function decide(a: ScoreValue, b: ScoreValue): Winner {
  if (typeof a !== 'number' || typeof b !== 'number') return null;
  if (a === b) return 'tie';
  return a > b ? 'a' : 'b';
}

export function tallyRows(rows: CompareRow[], keys: string[] = []): Tally {
  const pick = keys.length ? rows.filter(r => keys.includes(r.key)) : rows;
  const t: Tally = { a: 0, b: 0, tie: 0, open: 0, compared: 0 };
  for (const r of pick) {
    if (r.winner === null) t.open += 1;
    else {
      t.compared += 1;
      t[r.winner] += 1;
    }
  }
  return t;
}

/** One line for titles, share text and the card: "Poke beats Instinct 6–3" / "Across 9 tested dimensions." */
export function verdict(c: Comparison, focus: string[] = []): { headline: string; detail: string; tally: Tally } {
  const t = tallyRows(c.rows, focus);
  const noun = (n: number) => (n === 1 ? 'dimension' : 'dimensions');
  if (t.compared === 0) {
    return {
      headline: `${c.a.name} vs ${c.b.name}`,
      detail: focus.length ? `Not tested on the highlighted ${noun(focus.length)} yet.` : 'Not tested head to head yet.',
      tally: t,
    };
  }
  const headline =
    t.a === t.b ? `${c.a.name} and ${c.b.name} tie ${t.a}–${t.b}` : t.a > t.b ? `${c.a.name} beats ${c.b.name} ${t.a}–${t.b}` : `${c.b.name} beats ${c.a.name} ${t.b}–${t.a}`;
  const scope = focus.length ? `${focus.length} highlighted ${noun(focus.length)}` : `${t.compared} tested ${noun(t.compared)}`;
  const ties = t.tie ? `, ${t.tie} ${t.tie === 1 ? 'tie' : 'ties'}` : '';
  return { headline, detail: `Across ${scope}${ties}.`, tally: t };
}

/** Path segment for highlighted dimensions. "~" stays unencoded in URLs; a comma made the client router re-fetch in a loop. */
export const FOCUS_SEP = '~';

export function focusSegment(focus: string[]): string {
  return focus.join(FOCUS_SEP);
}

export function comparePath(a: string, b: string, focus: string[] = []): string {
  const base = `/compare/${pairSlug(a, b)}`;
  return focus.length ? `${base}/${focusSegment(focus)}` : base;
}

/** Pretty, pasteable image URL: /compare/a-vs-b[/focus]/card.png (rewritten to the API route in next.config). */
export function cardImagePath(a: string, b: string, focus: string[] = []): string {
  return `${comparePath(a, b, focus)}/card.png`;
}

export function cardPath(a: string, b: string, focus: string[] = [], download = false): string {
  const q = new URLSearchParams({ a, b });
  if (focus.length) q.set('focus', focus.join(','));
  if (download) q.set('download', '1');
  return `/api/og/compare?${q.toString()}`;
}

export const OUTCOME_LABEL: Record<string, string> = { pass: 'Pass', partial: 'Partial', fail: 'Fail', 'n/a': 'N/A' };

export function shortDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
