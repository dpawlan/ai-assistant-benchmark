'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { AgentIcon } from './AgentIcon';
import { PairTally, comparePath, record, versus } from '@/lib/compare-shared';
import { KIND_LABEL, KINDS } from '@/lib/kinds';

export interface GridAgent {
  slug: string;
  name: string;
  icon: string | null;
  kind: string;
  testedCount: number;
}

interface PairGridProps {
  /** Already ranked: most matchups won first. */
  agents: GridAgent[];
  tallies: Record<string, PairTally>;
  dimensions: number;
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

/** Who leads a pair from `me`'s side, for tile colouring and captions. */
function state(v: { mine: number; theirs: number; compared: number }): 'open' | 'lead' | 'trail' | 'even' {
  if (!v.compared) return 'open';
  return v.mine > v.theirs ? 'lead' : v.mine < v.theirs ? 'trail' : 'even';
}

/**
 * Spotlight for /compare: two dropdowns and a live tally that opens the scorecard.
 * Defaults to the top two of the ranking.
 */
export function PairSpotlight({ agents, tallies }: { agents: GridAgent[]; tallies: Record<string, PairTally> }) {
  const [a, setA] = useState(agents[0]?.slug ?? '');
  const [b, setB] = useState(agents[1]?.slug ?? '');
  const A = agents.find(x => x.slug === a);
  const B = agents.find(x => x.slug === b);
  if (!A || !B) return null;
  const same = a === b;
  const v = versus(tallies, a, b);
  const s = state(v);
  const caption = same
    ? 'Pick two different assistants'
    : s === 'open'
      ? 'No dimension tested on both sides yet'
      : s === 'even'
        ? `Even over ${v.compared} compared`
        : `${s === 'lead' ? A.name : B.name} leads over ${v.compared} compared`;
  const href = comparePath(a, b);

  const select = (value: string, onChange: (v: string) => void, label: string) => (
    <label className="hh-spot-side">
      <span className="hh-pick-label">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {agents.map(o => (
          <option key={o.slug} value={o.slug}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="hh-spot">
      <div className="hh-spot-form">
        {select(a, setA, 'Left')}
        <span className="hh-vs">vs</span>
        {select(b, setB, 'Right')}
      </div>
      {same ? (
        <div className="hh-spot-preview off">
          <span className="hh-spot-caption">{caption}</span>
        </div>
      ) : (
        <Link href={href} className="hh-spot-preview" onClick={() => track('hh_open', { pair: `${a}-vs-${b}`, via: 'spotlight' })}>
          <span className="hh-spot-fighter">
            <AgentIcon name={A.name} icon={A.icon} size={56} />
            <span className="hh-spot-name">{A.name}</span>
          </span>
          <span className="hh-spot-mid">
            <span className={`hh-spot-num ${s}`}>
              <b className={s === 'lead' ? 'on' : ''}>{v.mine}</b>
              <span className="hh-spot-dash">–</span>
              <b className={s === 'trail' ? 'on' : ''}>{v.theirs}</b>
            </span>
            <span className="hh-spot-caption">{caption}</span>
            <span className="hh-spot-cta">Open scorecard</span>
          </span>
          <span className="hh-spot-fighter right">
            <span className="hh-spot-name">{B.name}</span>
            <AgentIcon name={B.name} icon={B.icon} size={56} />
          </span>
        </Link>
      )}
    </div>
  );
}

/**
 * Logo grid for /compare, ranked by matchups won. Tap an assistant to see every opponent with the current tally;
 * tap an opponent to open the scorecard. Grouped by peer group when more than one group has tested assistants.
 */
export function PairGrid({ agents, tallies, dimensions }: PairGridProps) {
  const router = useRouter();
  const [picked, setPickedState] = useState<string | null>(null);
  const me = picked ? agents.find(a => a.slug === picked) ?? null : null;
  const slugs = agents.map(a => a.slug);

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
    track('hh_open', { pair: `${me.slug}-vs-${slug}`, via: 'grid' });
    router.push(comparePath(me.slug, slug));
  };

  const groups = KINDS.map(k => ({ key: k.key, title: KIND_LABEL[k.key], rows: agents.filter(a => a.kind === k.key) })).filter(g => g.rows.length);
  const grouped = groups.length > 1;

  const tile = (a: GridAgent, i: number) => {
    if (me) {
      if (a.slug === me.slug) return null;
      const v = versus(tallies, me.slug, a.slug);
      const s = state(v);
      return (
        <Link
          key={a.slug}
          href={comparePath(me.slug, a.slug)}
          className={`hh-tile ${s}`}
          onClick={() => track('hh_open', { pair: `${me.slug}-vs-${a.slug}`, via: 'grid' })}
        >
          <AgentIcon name={a.name} icon={a.icon} size={64} />
          <span className="hh-tile-name">{a.name}</span>
          <span className="hh-tile-num">
            {v.mine}–{v.theirs}
          </span>
          <span className="hh-tile-sub">
            {s === 'open' ? 'not compared yet' : s === 'lead' ? `${me.name} leads` : s === 'trail' ? `${a.name} leads` : 'even'}
          </span>
        </Link>
      );
    }
    const r = record(tallies, a.slug, slugs);
    return (
      <button key={a.slug} type="button" className="hh-tile" onClick={() => pick(a.slug)}>
        <span className="hh-tile-rank">{i + 1}</span>
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
          Ranked by matchups won. Pick an assistant to see every head to head; the record reads won–lost, with a third number for even
          matchups.
        </p>
      )}

      {grouped ? (
        groups.map(g => {
          const tiles = g.rows.map(a => tile(a, agents.indexOf(a))).filter(Boolean);
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
