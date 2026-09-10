'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { AgentIcon } from './AgentIcon';
import { comparePath } from '@/lib/compare-shared';
import { KIND_LABEL, KINDS } from '@/lib/kinds';

export interface GridAgent {
  slug: string;
  name: string;
  icon: string | null;
  kind: string;
  testedCount: number;
}

/** Tally for one unordered pair, keyed "a|b" with a < b alphabetically, counted from a's point of view. */
export interface PairTally {
  a: number;
  b: number;
  compared: number;
}

interface PairGridProps {
  agents: GridAgent[];
  tallies: Record<string, PairTally>;
  dimensions: number;
}

function key(x: string, y: string): string {
  return x < y ? `${x}|${y}` : `${y}|${x}`;
}

/** Wins, losses and compared rows for `me` against `them`, regardless of how the pair is stored. */
function versus(tallies: Record<string, PairTally>, me: string, them: string): { mine: number; theirs: number; compared: number } {
  const t = tallies[key(me, them)];
  if (!t) return { mine: 0, theirs: 0, compared: 0 };
  return me < them ? { mine: t.a, theirs: t.b, compared: t.compared } : { mine: t.b, theirs: t.a, compared: t.compared };
}

function record(tallies: Record<string, PairTally>, me: string, others: GridAgent[]): { w: number; l: number; e: number } {
  const r = { w: 0, l: 0, e: 0 };
  for (const o of others) {
    if (o.slug === me) continue;
    const v = versus(tallies, me, o.slug);
    if (!v.compared) continue;
    if (v.mine > v.theirs) r.w += 1;
    else if (v.mine < v.theirs) r.l += 1;
    else r.e += 1;
  }
  return r;
}

/** Reads ?a= after hydration so the grid can be prerendered with nothing picked. */
function PickedFromUrl({ agents, onPick }: { agents: GridAgent[]; onPick: (slug: string | null) => void }) {
  const params = useSearchParams();
  const a = params.get('a');
  const picked = a && agents.some(x => x.slug === a) ? a : null;
  useEffect(() => {
    onPick(picked);
  }, [picked, onPick]);
  return null;
}

/**
 * Logo grid for /compare. Tap an assistant to see every opponent with the current tally; tap an opponent to open
 * the scorecard. Grouped by peer group when more than one group has tested assistants.
 */
export function PairGrid({ agents, tallies, dimensions }: PairGridProps) {
  const router = useRouter();
  const [picked, setPickedState] = useState<string | null>(null);
  const me = picked ? agents.find(a => a.slug === picked) ?? null : null;

  const setPicked = (slug: string | null, push = true) => {
    setPickedState(slug);
    if (push) window.history.replaceState(null, '', slug ? `/compare?a=${slug}` : '/compare');
  };

  const pick = (slug: string) => {
    if (!me) {
      track('hh_pick', { agent: slug });
      setPicked(slug);
      return;
    }
    if (slug === me.slug) return;
    track('hh_open', { pair: `${me.slug}-vs-${slug}` });
    router.push(comparePath(me.slug, slug));
  };

  const groups = KINDS.map(k => ({ key: k.key, title: KIND_LABEL[k.key], rows: agents.filter(a => a.kind === k.key) })).filter(g => g.rows.length);
  const grouped = groups.length > 1;

  const tile = (a: GridAgent) => {
    if (me) {
      if (a.slug === me.slug) return null;
      const v = versus(tallies, me.slug, a.slug);
      const state = !v.compared ? 'open' : v.mine > v.theirs ? 'lead' : v.mine < v.theirs ? 'trail' : 'even';
      return (
        <Link key={a.slug} href={comparePath(me.slug, a.slug)} className={`hh-tile ${state}`} onClick={() => track('hh_open', { pair: `${me.slug}-vs-${a.slug}` })}>
          <AgentIcon name={a.name} icon={a.icon} size={64} />
          <span className="hh-tile-name">{a.name}</span>
          <span className="hh-tile-num">
            {v.mine}–{v.theirs}
          </span>
          <span className="hh-tile-sub">
            {!v.compared ? 'not compared yet' : state === 'lead' ? `${me.name} leads` : state === 'trail' ? `${a.name} leads` : 'even'}
          </span>
        </Link>
      );
    }
    const r = record(tallies, a.slug, agents);
    return (
      <button key={a.slug} type="button" className="hh-tile" onClick={() => pick(a.slug)}>
        <AgentIcon name={a.name} icon={a.icon} size={64} />
        <span className="hh-tile-name">{a.name}</span>
        <span className="hh-tile-num">
          {r.w}–{r.l}
          {r.e > 0 && <span className="hh-tile-even">–{r.e}</span>}
        </span>
        <span className="hh-tile-sub">
          {a.testedCount} of {dimensions} tested
        </span>
      </button>
    );
  };

  return (
    <>
      <Suspense fallback={null}>
        <PickedFromUrl agents={agents} onPick={s => setPicked(s, false)} />
      </Suspense>

      {me ? (
        <div className="hh-sel">
          <AgentIcon name={me.name} icon={me.icon} size={56} />
          <span className="hh-sel-body">
            <span className="hh-sel-name">{me.name}</span>
            <span className="hh-sel-sub">Pick an opponent. Each tally counts the dimensions {me.name} takes against the others.</span>
          </span>
          <button type="button" className="btn ghost" onClick={() => setPicked(null)}>
            Change
          </button>
        </div>
      ) : (
        <p className="hh-pick-note" style={{ marginTop: 0 }}>
          Pick an assistant to see every head to head. The record counts matchups won, lost and even.
        </p>
      )}

      {grouped ? (
        groups.map(g => {
          const tiles = g.rows.map(tile).filter(Boolean);
          if (!tiles.length) return null;
          return (
            <div key={g.key} className="hh-group">
              <h3 className="hh-group-title">{g.title}</h3>
              <div className="hh-grid">{tiles}</div>
            </div>
          );
        })
      ) : (
        <div className="hh-grid">{agents.map(tile)}</div>
      )}
    </>
  );
}
