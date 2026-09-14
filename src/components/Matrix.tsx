'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { track } from '@vercel/analytics';
import { Agent, Category } from '@/lib/types';
import { KINDS, KIND_LABEL, isKind } from '@/lib/kinds';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { SpeedCell } from './SpeedCell';
import { CoverageCell } from './CoverageCell';
import { StatusStrip } from './StatusStrip';
import { opinionRank } from '@/lib/score';
import { STATUS_CAPTION, STATUS_LABEL, STATUS_ORDER, benchStatus, coverage, type BenchStatus } from '@/lib/status';

interface MatrixProps {
  agents: Agent[];
  categories: Category[];
  short: Record<string, string>;
}

type View = 'benchmark' | 'opinion';
type SortKey = 'overall' | 'speed' | string;
/** Landing-page status treatments under review: a = sections, b = tiles + status column, c = inline coverage. */
export type Design = 'a' | 'b' | 'c';
const DESIGNS: Design[] = ['a', 'b', 'c'];

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

/** Reads ?kind= and ?design= after hydration so the grid itself can be prerendered with the defaults. */
function KindFromUrl({ onKind, onDesign }: { onKind: (k: string) => void; onDesign: (d: Design) => void }) {
  const params = useSearchParams();
  const kindParam = params.get('kind');
  const kind = kindParam === 'all' ? 'all' : isKind(kindParam) ? kindParam : 'general';
  const designParam = params.get('design');
  const design: Design = DESIGNS.includes(designParam as Design) ? (designParam as Design) : 'a';
  useEffect(() => {
    onKind(kind);
    onDesign(design);
  }, [kind, design, onKind, onDesign]);
  return null;
}

function hrefFor(kind: string, design: Design): string {
  const q = new URLSearchParams();
  if (kind !== 'general') q.set('kind', kind);
  if (design !== 'a') q.set('design', design);
  const qs = q.toString();
  return qs ? `/?${qs}` : '/';
}

export function Matrix({ agents, categories, short }: MatrixProps) {
  const router = useRouter();
  const [kind, setKindState] = useState<string>('general');
  const [design, setDesignState] = useState<Design>('a');
  const [view, setView] = useState<View>('benchmark');
  const [sort, setSort] = useState<SortKey>('overall');
  const [status, setStatus] = useState<BenchStatus | 'all'>('all');
  const [showPending, setShowPending] = useState(false);
  const opinion = view === 'opinion';
  const cols = opinion ? categories : categories.filter(c => c.scored !== false);

  const setKind = (k: string) => {
    track('kind_filter', { kind: k });
    setKindState(k);
    router.replace(hrefFor(k, design), { scroll: false });
  };
  const setDesign = (d: Design) => {
    setDesignState(d);
    router.replace(hrefFor(kind, d), { scroll: false });
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
  const inKind = useMemo(() => (kind === 'all' ? agents : agents.filter(a => a.kind === kind)), [agents, kind]);

  // One group when a kind is selected; every kind in display order when showing all.
  const groups = useMemo(() => {
    const kinds = kind === 'all' ? KINDS.map(k => k.key).filter(k => counts[k]) : [kind];
    const pool = status === 'all' ? inKind : inKind.filter(a => statusOf.get(a.slug) === status);
    const byStatusThenScore = (list: Agent[]) =>
      design === 'b' && !opinion
        ? [...sortAgents(list, sort, view)].sort((a, b) => STATUS_ORDER.indexOf(statusOf.get(a.slug)!) - STATUS_ORDER.indexOf(statusOf.get(b.slug)!))
        : sortAgents(list, sort, view);
    return kinds.map(k => ({ key: k, title: KIND_LABEL[k] ?? k, rows: byStatusThenScore(pool.filter(a => a.kind === k)) }));
  }, [inKind, sort, view, kind, counts, status, statusOf, design, opinion]);

  /** Design A: outer sections by status, kind sub-groups inside when showing all kinds. */
  const sections = useMemo(() => {
    const wanted = status === 'all' ? STATUS_ORDER : [status];
    return wanted.map(s => {
      const rows = inKind.filter(a => statusOf.get(a.slug) === s);
      const kinds = kind === 'all' ? KINDS.map(k => k.key).filter(k => rows.some(a => a.kind === k)) : [kind];
      return {
        status: s,
        count: rows.length,
        groups: kinds.map(k => ({ key: k, title: KIND_LABEL[k] ?? k, rows: sortAgents(rows.filter(a => a.kind === k), sort, view) })),
      };
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

  const aggCols = opinion ? 2 : design === 'c' ? 3 : 4; // name + (speed) + overall + (coverage/status)
  const span = cols.length + aggCols;

  const row = (agent: Agent) => {
    const st = statusOf.get(agent.slug)!;
    const cv = covOf.get(agent.slug)!;
    return (
      <tr key={agent.slug} className={design !== 'a' && st === 'pending' ? 'mx-pending' : undefined}>
        <th scope="row" className="mx-name">
          <Link href={`/agents/${agent.slug}`} className="mx-agent">
            <AgentIcon name={agent.name} icon={agent.icon} size={28} className="mx-icon" />
            <span className="mx-nm">
              {agent.name}
              {design === 'c' && !opinion && <span className={`st-dot st-${st} st-inline`} title={STATUS_LABEL[st]} />}
            </span>
          </Link>
        </th>
        {!opinion && design === 'b' && (
          <td className="mx-agg mx-status">
            <span className={`st-pill st-${st}`}>
              <span className={`st-dot st-${st}`} aria-hidden="true" />
              {STATUS_LABEL[st]}
              {st !== 'pending' && (
                <span className="st-pill-n">
                  {cv.scored}/{cv.applicable}
                </span>
              )}
            </span>
          </td>
        )}
        {!opinion && (
          <td className={`mx-agg mx-speed${sort === 'speed' ? ' sorted' : ''}`}>
            <SpeedCell usage={agent.usage} />
          </td>
        )}
        <td className={`mx-agg${sort === 'overall' ? ' sorted' : ''}${design === 'c' && !opinion ? ' mx-overall-c' : ''}`}>
          {opinion ? (
            <OpinionCell stat={agent.opinionOverall} />
          ) : design === 'c' ? (
            <span className="ov-stack">
              <ScoreCell value={agent.overall} aggregate />
              {st !== 'pending' && <span className={`ov-sub${st === 'completed' ? ' done' : ''}`}>{st === 'completed' ? 'final' : `${cv.scored} of ${cv.applicable}`}</span>}
            </span>
          ) : (
            <ScoreCell value={agent.overall} aggregate />
          )}
        </td>
        {!opinion && design === 'a' && (
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

  const kindHeader = (title: string, n: number, sub = false) => (
    <tr className={`mx-group${sub ? ' mx-sub' : ''}`}>
      <th scope="rowgroup" colSpan={span}>
        {title}
        <span className="mx-count">{n}</span>
      </th>
    </tr>
  );

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

  return (
    <div>
      <Suspense fallback={null}>
        <KindFromUrl onKind={setKindState} onDesign={setDesignState} />
      </Suspense>

      <div className="design-bar" role="tablist" aria-label="Design under review">
        <span>Design</span>
        {DESIGNS.map(d => (
          <button key={d} type="button" role="tab" aria-selected={design === d} className={design === d ? 'on' : ''} onClick={() => setDesign(d)}>
            {d.toUpperCase()}
          </button>
        ))}
        <span className="design-note">{design === 'a' ? 'sections + Tested column' : design === 'b' ? 'tiles + Status column' : 'inline coverage under Overall'}</span>
      </div>

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

      {!opinion && <StatusStrip agents={inKind} categories={categories} design={design} active={status} onPick={setStatus} />}

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
          {opinion ? 'Share of positive public quotes. Founder posts excluded.' : 'Scored 1–10 after real use. Overall is the mean of the dimensions scored so far.'}
        </p>
      </div>

      <div className="matrix-wrap">
        <table className={`matrix${opinion ? ' opinion' : ''} design-${design}`}>
          <colgroup>
            <col className="c-name" />
            {!opinion && design === 'b' && <col className="c-status" />}
            {!opinion && <col className="c-agg" />}
            <col className="c-agg" />
            {!opinion && design === 'a' && <col className="c-cov" />}
            {cols.map(c => (
              <col key={c.key} className="c-cat" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="mx-name">
                <span className="mx-label">Assistant</span>
              </th>
              {!opinion && design === 'b' && (
                <th scope="col" className="mx-agg mx-status">
                  <span className="mx-label">Status</span>
                </th>
              )}
              {!opinion && header('speed', 'Speed', 'mx-agg mx-speed', 'median reply time in the reviewer’s own thread')}
              {header('overall', 'Overall', 'mx-agg', opinion ? 'share of positive quotes' : 'mean of every dimension scored so far')}
              {!opinion && design === 'a' && (
                <th scope="col" className="mx-agg mx-cov" title="dimensions scored out of those that apply">
                  <span className="mx-label">Tested</span>
                </th>
              )}
              {cols.map(c => header(c.key, short[c.key] ?? c.label, '', c.label))}
            </tr>
          </thead>

          {design === 'a' && !opinion
            ? sections.map(sec => {
                const collapsed = sec.status === 'pending' && status === 'all' && !showPending;
                return (
                  <tbody key={sec.status} className={`mx-sec mx-sec-${sec.status}`}>
                    <tr className="mx-sechead">
                      <th scope="rowgroup" colSpan={span}>
                        <span className={`st-dot st-${sec.status}`} aria-hidden="true" />
                        {STATUS_LABEL[sec.status]}
                        <span className="mx-count">{sec.count}</span>
                        <span className="mx-secsub">{sec.count === 0 && sec.status === 'completed' ? 'None yet. An assistant lands here once every applicable dimension is scored.' : STATUS_CAPTION[sec.status]}</span>
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
                            {kind === 'all' && g.rows.length > 0 && kindHeader(g.title, g.rows.length, true)}
                            {g.rows.map(row)}
                          </Fragment>
                        ))}
                    {sec.status === 'pending' && status === 'all' && showPending && sec.count > 0 && pendingToggle(sec.count, true, () => setShowPending(false))}
                  </tbody>
                );
              })
            : groups.map(group => {
                const visible = design === 'c' && !opinion && status === 'all' ? group.rows.filter(a => statusOf.get(a.slug) !== 'pending') : group.rows;
                const hidden = group.rows.length - visible.length;
                return (
                  <tbody key={group.key}>
                    {kind === 'all' && kindHeader(group.title, group.rows.length)}
                    {(showPending ? group.rows : visible).map(row)}
                    {hidden > 0 && pendingToggle(hidden, showPending, () => setShowPending(v => !v))}
                  </tbody>
                );
              })}
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
