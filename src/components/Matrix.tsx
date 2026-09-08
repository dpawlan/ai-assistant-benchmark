'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Agent, Category } from '@/lib/types';
import { KINDS, KIND_LABEL, isKind } from '@/lib/kinds';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { SpeedCell } from './SpeedCell';
import { opinionRank } from '@/lib/score';

interface MatrixProps {
  agents: Agent[];
  categories: Category[];
  short: Record<string, string>;
}

type View = 'benchmark' | 'opinion';
type SortKey = 'overall' | 'speed' | string;

function benchValue(agent: Agent, key: SortKey): number {
  if (key === 'overall') return agent.overall ?? -1;
  if (key === 'speed') return agent.usage?.median_reply_s === null || agent.usage?.median_reply_s === undefined ? -1e9 : -agent.usage.median_reply_s;
  const v = agent.scores[key];
  return typeof v === 'number' ? v : v === 'n/a' ? -2 : -1;
}

function opinionValue(agent: Agent, key: SortKey): number {
  if (key === 'speed') return benchValue(agent, key);
  return opinionRank(key === 'overall' ? agent.opinionOverall : agent.opinion[key]);
}

function sortAgents(list: Agent[], key: SortKey, view: View): Agent[] {
  const value = view === 'opinion' ? opinionValue : benchValue;
  return [...list].sort(
    (a, b) =>
      value(b, key) - value(a, key) ||
      (view === 'opinion' ? (key === 'overall' ? b.opinionOverall.n - a.opinionOverall.n : (b.opinion[key]?.n ?? 0) - (a.opinion[key]?.n ?? 0)) : 0) ||
      (b.overall ?? -1) - (a.overall ?? -1) ||
      b.feedbackCount - a.feedbackCount ||
      a.name.localeCompare(b.name),
  );
}

/** Reads ?kind= after hydration so the grid itself can be prerendered with the default group. */
function KindFromUrl({ onKind }: { onKind: (k: string) => void }) {
  const params = useSearchParams();
  const kindParam = params.get('kind');
  const kind = kindParam === 'all' ? 'all' : isKind(kindParam) ? kindParam : 'general';
  useEffect(() => {
    onKind(kind);
  }, [kind, onKind]);
  return null;
}

export function Matrix({ agents, categories, short }: MatrixProps) {
  const router = useRouter();
  const [kind, setKindState] = useState<string>('general');
  const [view, setView] = useState<View>('benchmark');
  const [sort, setSort] = useState<SortKey>('overall');
  const opinion = view === 'opinion';

  const setKind = (k: string) => {
    setKindState(k);
    router.replace(k === 'general' ? '/' : `/?kind=${k}`, { scroll: false });
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of agents) c[a.kind] = (c[a.kind] ?? 0) + 1;
    return c;
  }, [agents]);

  // One group when a kind is selected; every kind in display order when showing all.
  const groups = useMemo(() => {
    const kinds = kind === 'all' ? KINDS.map(k => k.key).filter(k => counts[k]) : [kind];
    return kinds.map(k => ({ key: k, title: KIND_LABEL[k] ?? k, rows: sortAgents(agents.filter(a => a.kind === k), sort, view) }));
  }, [agents, sort, view, kind, counts]);


  const header = (key: SortKey, label: string, cls: string, full = label) => {
    const active = sort === key;
    return (
      <th key={key} scope="col" className={`${cls}${active ? ' sorted' : ''}`.trim()} aria-sort={active ? 'descending' : 'none'}>
        <button type="button" onClick={() => setSort(key)} title={full}>
          <span className="mx-label">
            {label}
            {active && (
              <svg className="mx-sort" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path d="M5 8L1 3h8z" />
              </svg>
            )}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div>
      <Suspense fallback={null}>
        <KindFromUrl onKind={setKindState} />
      </Suspense>
      <div className="kind-bar" role="tablist" aria-label="Peer group">
        {KINDS.filter(k => counts[k.key]).map(k => (
          <button key={k.key} type="button" role="tab" aria-selected={kind === k.key} className={`kind${kind === k.key ? ' on' : ''}`} onClick={() => setKind(k.key)}>
            {k.label}
            <span className="kind-n">{counts[k.key]}</span>
          </button>
        ))}
        <button type="button" role="tab" aria-selected={kind === 'all'} className={`kind${kind === 'all' ? ' on' : ''}`} onClick={() => setKind('all')}>
          All
          <span className="kind-n">{agents.length}</span>
        </button>
      </div>

      <div className="mx-bar">
        <div className="seg" role="tablist" aria-label="Scorecard view">
          <button type="button" role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setView('benchmark')}>
            Benchmark
          </button>
          <button type="button" role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setView('opinion')}>
            Public opinion
          </button>
        </div>
        <p className="mx-caption">
          {opinion ? 'Share of positive public quotes. Founder posts excluded.' : 'Scored 1–10 after real use.'}
        </p>
      </div>

      <div className="matrix-wrap">
        <table className={`matrix${opinion ? ' opinion' : ''}`}>
          <colgroup>
            <col className="c-name" />
            {!opinion && <col className="c-agg" />}
            <col className="c-agg" />
            {categories.map(c => (
              <col key={c.key} className="c-cat" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="mx-name">
                <span className="mx-label">Assistant</span>
              </th>
              {!opinion && header('speed', 'Speed', 'mx-agg mx-speed', 'median reply time in the reviewer’s own thread')}
              {header('overall', 'Overall', 'mx-agg', opinion ? 'share of positive quotes' : 'mean of every dimension scored')}
              {categories.map(c => header(c.key, short[c.key] ?? c.label, '', c.label))}
            </tr>
          </thead>
          {groups.map(group => (
            <tbody key={group.key}>
              {kind === 'all' && (
                <tr className="mx-group">
                  <th scope="rowgroup" colSpan={categories.length + (opinion ? 2 : 3)}>
                    {group.title}
                    <span className="mx-count">{group.rows.length}</span>
                  </th>
                </tr>
              )}
              {group.rows.map(agent => (
                <tr key={agent.slug}>
                  <th scope="row" className="mx-name">
                    <Link href={`/agents/${agent.slug}`} className="mx-agent">
                      <AgentIcon name={agent.name} icon={agent.icon} size={28} className="mx-icon" />
                      <span className="mx-nm">{agent.name}</span>
                    </Link>
                  </th>
                  {!opinion && (
                    <td className={`mx-agg mx-speed${sort === 'speed' ? ' sorted' : ''}`}>
                      <SpeedCell usage={agent.usage} />
                    </td>
                  )}
                  <td className={`mx-agg${sort === 'overall' ? ' sorted' : ''}`}>
                    {opinion ? <OpinionCell stat={agent.opinionOverall} /> : <ScoreCell value={agent.overall} aggregate />}
                  </td>
                  {categories.map(c => (
                    <td key={c.key} className={sort === c.key ? 'sorted' : undefined}>
                      {opinion ? <OpinionCell stat={agent.opinion[c.key]} compact /> : <ScoreCell value={agent.scores[c.key]} />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {opinion ? (
        <p className="matrix-key">
          <span className="sc op sc-5">
            <span className="op-v">90%</span>
          </span>{' '}
          positive
          <span className="key-gap" />
          <span className="sc op sc-0">
            <span className="op-v">50%</span>
          </span>{' '}
          split
          <span className="key-gap" />
          <span className="sc op sc-n2">
            <span className="op-v">20%</span>
          </span>{' '}
          negative
          <span className="key-gap" />
          <span className="sc op sc-5 thin">
            <span className="op-v">100%</span>
            <span className="op-n">thin</span>
          </span>{' '}
          under 15 quotes
          <span className="key-gap" />
          <span className="sc sc-null">—</span> none
        </p>
      ) : (
        <p className="matrix-key">
          <span className="sc sc-5">9</span> <span className="sc sc-3">6</span> <span className="sc sc-1">2</span> score
          <span className="key-gap" />
          <span className="sc sc-5">11s</span> median reply
          <span className="key-gap" />
          <span className="sc sc-null">—</span> not tested
          <span className="key-gap" />
          <span className="sc sc-na">N/A</span> doesn&apos;t apply
          <span className="key-gap" />
          <Link href="/dimensions#how">How scoring works</Link>
        </p>
      )}
    </div>
  );
}
