'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { track } from '@vercel/analytics';
import { Agent, Category } from '@/lib/types';
import { KINDS, KIND_LABEL, isKind } from '@/lib/kinds';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { SpeedCell } from './SpeedCell';
import { CostMark } from './CostMark';
import { COST_KEYS, COST_LABEL, costOf, type CostKey } from '@/lib/cost';
import { CoverageCell } from './CoverageCell';
import { StatusStrip } from './StatusStrip';
import { opinionRank } from '@/lib/score';
import { STATUS_CAPTION, STATUS_LABEL, STATUS_ORDER, benchStatus, coverage, type BenchStatus } from '@/lib/status';

interface MatrixProps {
  agents: Agent[];
  categories: Category[];
  short: Record<string, string>;
  /** Grid page: no cost filter, no status strip, no Tested column, no caption. */
  compact?: boolean;
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

export function Matrix({ agents, categories, short, compact = false }: MatrixProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [kind, setKindState] = useState<string>('general');
  const [view, setView] = useState<View>('benchmark');
  const [sort, setSort] = useState<SortKey>('overall');
  const [status, setStatus] = useState<BenchStatus | 'all'>('all');
  const [showPending, setShowPending] = useState(false);
  const [cost, setCost] = useState<CostKey | 'all'>('all');
  const opinion = view === 'opinion';
  const cols = opinion ? categories : categories.filter(c => c.scored !== false);

  const setKind = (k: string) => {
    track('kind_filter', { kind: k });
    setKindState(k);
    router.replace(k === 'general' ? pathname : `${pathname}?kind=${k}`, { scroll: false });
  };

  const statusOf = useMemo(() => {
    const m = new Map<string, BenchStatus>();
    for (const a of agents) m.set(a.slug, benchStatus(a, categories));
    return m;
  }, [agents, categories]);
  const covOf = useMemo(() => {
    const m = new Map<string, ReturnType<typeof coverage>>();
    for (const a of agents) m.set(a.slug, coverage(a, categories));
    return m;
  }, [agents, categories]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of agents) c[a.kind] = (c[a.kind] ?? 0) + 1;
    return c;
  }, [agents]);

  /** Assistants in the selected peer group (or all of them). Status counts in the strip follow this set. */
  const kindPool = useMemo(() => (kind === 'all' ? agents : agents.filter(a => a.kind === kind)), [agents, kind]);
  const costCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of kindPool) {
      const k = costOf(a.access?.pricing);
      if (k) c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [kindPool]);
  const inKind = useMemo(() => (cost === 'all' ? kindPool : kindPool.filter(a => costOf(a.access?.pricing) === cost)), [kindPool, cost]);

  // One flat group, ranked by the sort key. "All" is a single ranking across kinds, not sub-groups.
  const groups = useMemo(() => [{ key: kind, title: KIND_LABEL[kind] ?? 'All', rows: sortAgents(inKind, sort, view) }], [inKind, sort, view, kind]);

  /** Benchmark view: outer sections by status, one flat ranking inside each. */
  const sections = useMemo(() => {
    const wanted = status === 'all' ? STATUS_ORDER : [status];
    return wanted.map(s => {
      const rows = inKind.filter(a => statusOf.get(a.slug) === s);
      return { status: s, count: rows.length, groups: [{ key: kind, title: KIND_LABEL[kind] ?? 'All', rows: sortAgents(rows, sort, view) }] };
    });
  }, [inKind, statusOf, status, kind, sort, view]);


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

  const showCov = !opinion && !compact;
  const aggCols = opinion ? 2 : showCov ? 4 : 3; // name + (speed) + overall + (tested)
  const span = cols.length + aggCols;

  const row = (agent: Agent) => {
    const cv = covOf.get(agent.slug)!;
    return (
      <tr key={agent.slug}>
        <th scope="row" className="mx-name">
          <Link href={`/agents/${agent.slug}`} className="mx-agent">
            <AgentIcon name={agent.name} icon={agent.icon} size={28} className="mx-icon" />
            <span className="mx-nmwrap">
              <span className="mx-nm">{agent.name}</span>
              <CostMark pricing={agent.access?.pricing} />
            </span>
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
        {showCov && (
          <td className="mx-agg mx-cov">
            <CoverageCell c={cv} />
          </td>
        )}
        {cols.map(c => (
          <td key={c.key} className={sort === c.key ? 'sorted' : undefined}>
            {opinion ? <OpinionCell stat={agent.opinion[c.key]} compact /> : <ScoreCell value={agent.scores[c.key]} />}
          </td>
        ))}
      </tr>
    );
  };

  const pendingToggle = (n: number, open: boolean, onToggle: () => void) => (
    <tr className="mx-toggle">
      <td colSpan={span}>
        <button type="button" onClick={onToggle} aria-expanded={open}>
          {open ? 'Hide' : 'Show'} {n} pending
          <svg className={`mx-chev${open ? ' open' : ''}`} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M5 8L1 3h8z" />
          </svg>
        </button>
      </td>
    </tr>
  );

  const segEl = (
    <div className="seg" role="tablist" aria-label="Score source">
      <button type="button" role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setView('benchmark')}>
        Scores
      </button>
      <button type="button" role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setView('opinion')}>
        Public opinion
      </button>
    </div>
  );

  return (
    <div>
      <Suspense fallback={null}>
        <KindFromUrl onKind={setKindState} />
      </Suspense>

      <div className={compact ? 'rank-bar' : undefined}>
      <div className="kind-bar" role="tablist" aria-label="Peer group">
        <button type="button" role="tab" aria-selected={kind === 'all'} className={`kind${kind === 'all' ? ' on' : ''}`} onClick={() => setKind('all')}>
          All
          <span className="kind-n">{agents.length}</span>
        </button>
        {KINDS.filter(k => counts[k.key]).map(k => (
          <button key={k.key} type="button" role="tab" aria-selected={kind === k.key} className={`kind${kind === k.key ? ' on' : ''}`} onClick={() => setKind(k.key)}>
            {k.label}
            <span className="kind-n">{counts[k.key]}</span>
          </button>
        ))}
      </div>
      {compact && segEl}
      </div>

      {!compact && <div className="cost-bar" role="group" aria-label="Cost">
        <span className="cost-bar-l">Cost</span>
        <button type="button" className={`cost-f${cost === 'all' ? ' on' : ''}`} aria-pressed={cost === 'all'} onClick={() => setCost('all')}>
          Any
        </button>
        {COST_KEYS.filter(k => costCounts[k]).map(k => (
          <button key={k} type="button" className={`cost-f${cost === k ? ' on' : ''}`} aria-pressed={cost === k} onClick={() => setCost(cost === k ? 'all' : k)}>
            {COST_LABEL[k]}
            <span className="kind-n">{costCounts[k]}</span>
          </button>
        ))}
      </div>}

      {!opinion && !compact && <StatusStrip agents={inKind} categories={categories} active={status} onPick={setStatus} />}

      {!compact && <div className="mx-bar">
        <div className="seg" role="tablist" aria-label="Scorecard view">
          <button type="button" role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setView('benchmark')}>
            Benchmark
          </button>
          <button type="button" role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setView('opinion')}>
            Public opinion
          </button>
        </div>
        {!compact && <p className="mx-caption">
          {opinion ? 'Share of positive public quotes. Founder posts excluded.' : 'Scored 1–10 after real use. Overall is the mean of the dimensions scored so far.'}
        </p>}
      </div>}

      <div className="matrix-wrap">
        <table className={`matrix${opinion ? ' opinion' : ''}`}>
          <colgroup>
            <col className="c-name" />
            {!opinion && <col className="c-agg" />}
            <col className="c-agg" />
            {showCov && <col className="c-cov" />}
            {cols.map(c => (
              <col key={c.key} className="c-cat" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="mx-name">
                <span className="mx-label">Assistant</span>
              </th>
              {!opinion && header('speed', 'Speed', 'mx-agg mx-speed', 'median reply time in the reviewer’s own thread')}
              {header('overall', 'Overall', 'mx-agg', opinion ? 'share of positive quotes' : 'mean of every dimension scored so far')}
              {showCov && (
                <th scope="col" className="mx-agg mx-cov" title="dimensions scored out of those that apply">
                  <span className="mx-label">Tested</span>
                </th>
              )}
              {cols.map(c => header(c.key, short[c.key] ?? c.label, '', c.label))}
            </tr>
          </thead>

          {!opinion
            ? sections.filter(sec => !(compact && sec.count === 0)).map(sec => {
                const collapsed = sec.status === 'pending' && status === 'all' && !showPending;
                return (
                  <tbody key={sec.status} className={`mx-sec mx-sec-${sec.status}`}>
                    <tr className="mx-sechead">
                      <th scope="rowgroup" colSpan={span}>
                        <span className={`st-dot st-${sec.status}`} aria-hidden="true" />
                        {STATUS_LABEL[sec.status]}
                        <span className="mx-count">{sec.count}</span>
                        {!compact && <span className="mx-secsub">{sec.count === 0 && sec.status === 'completed' ? 'None yet. An assistant lands here once every applicable dimension is scored.' : STATUS_CAPTION[sec.status]}</span>}
                      </th>
                    </tr>
                    {sec.count === 0 && sec.status !== 'completed' && (
                      <tr className="mx-empty">
                        <td colSpan={span}>Nothing here.</td>
                      </tr>
                    )}
                    {collapsed
                      ? pendingToggle(sec.count, false, () => setShowPending(true))
                      : sec.groups.map(g => (
                          <Fragment key={g.key}>
                            {g.rows.map(row)}
                          </Fragment>
                        ))}
                    {sec.status === 'pending' && status === 'all' && showPending && sec.count > 0 && pendingToggle(sec.count, true, () => setShowPending(false))}
                  </tbody>
                );
              })
            : groups.map(group => (
                <tbody key={group.key}>
                  {group.rows.map(row)}
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
