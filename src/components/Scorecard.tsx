'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { CompareRow, Comparison, OUTCOME_LABEL, cardPath, comparePath, shortDate, verdict } from '@/lib/compare-shared';
import { Run } from '@/lib/types';

interface ScorecardProps {
  comparison: Comparison;
  initialFocus: string[];
}

function Check() {
  return (
    <span className="hh-check" aria-label="Wins this dimension">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 10.5l3.2 3.2L15 6.8" />
      </svg>
    </span>
  );
}

/** The score itself is the link: to the thread when there is one, otherwise to the profile. */
function ScoreLink({ run, slug, value, win }: { run: Run | null; slug: string; value: CompareRow['a']; win: boolean }) {
  const href = run?.evidence_url && run.evidence_url.startsWith('/') ? run.evidence_url : `/agents/${slug}`;
  const label = run?.evidence_url && run.evidence_url.startsWith('/') ? 'Read the thread' : 'Open profile';
  return (
    <Link href={href} className={`hh-score${win ? ' win' : ''}`} title={run ? label : 'Not tested'}>
      <ScoreCell value={value} />
      {win && <Check />}
    </Link>
  );
}

function Meta({ run }: { run: Run | null }) {
  if (!run) return <span className="hh-meta empty">Not tested</span>;
  return (
    <span className="hh-meta">
      {OUTCOME_LABEL[run.outcome] ?? run.outcome} · {run.protocol === 'task' ? 'test' : 'observed'} · {shortDate(run.date)}
    </span>
  );
}

/** The middle scorecard: one row per dimension, the check goes to the higher tested score. Tap a dimension to highlight it. */
export function Scorecard({ comparison, initialFocus }: ScorecardProps) {
  const { a, b, rows } = comparison;
  const [focus, setFocus] = useState<string[]>(initialFocus);
  const [copied, setCopied] = useState(false);

  const ordered = (keys: string[]) => rows.map(r => r.key).filter(k => keys.includes(k));

  const update = (next: string[]) => {
    const keys = ordered(next);
    setFocus(keys);
    window.history.replaceState(null, '', comparePath(a.slug, b.slug, keys));
  };
  const toggle = (key: string) => update(focus.includes(key) ? focus.filter(k => k !== key) : [...focus, key]);

  const v = verdict(comparison, focus);
  const all = verdict(comparison);
  const pagePath = comparePath(a.slug, b.slug, focus);
  /** Read at click time so the link carries whatever host the page is actually on. */
  const url = () => window.location.origin + pagePath;
  const shareText = `${v.headline}. ${v.detail}`;
  const pair = `${a.slug}-vs-${b.slug}`;
  const eventProps = () => ({ pair, focus: focus.join(',') });
  const postOnX = () => {
    track('post_on_x', eventProps());
    const intent = `https://x.com/intent/post?${new URLSearchParams({ text: shareText, url: url() }).toString()}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt('Copy this link', url());
    }
  };

  const share = async () => {
    track('share_card', { ...eventProps(), method: typeof navigator.share === 'function' ? 'sheet' : 'copy' });
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: v.headline, text: shareText, url: url() });
        return;
      } catch {
        /* cancelled: fall back to copy */
      }
    }
    copy();
  };

  const fileName = `${a.slug}-vs-${b.slug}${focus.length ? '-' + focus.join('-') : ''}.png`;

  const winner = v.tally.a === v.tally.b ? null : v.tally.a > v.tally.b ? 'a' : 'b';

  return (
    <div className="hh">
      <header className="hh-head">
        <Link href={`/agents/${a.slug}`} className={`hh-fighter hh-fa${winner === 'a' ? ' win' : ''}`}>
          <AgentIcon name={a.name} icon={a.icon} size={72} className="hh-icon" />
          <span className="hh-fname">{a.name}</span>
          <span className="hh-fmeta">
            <ScoreCell value={a.overall} aggregate /> overall
            {a.opinionOverall.n > 0 && (
              <>
                <OpinionCell stat={a.opinionOverall} compact /> public
              </>
            )}
          </span>
        </Link>
        <div className="hh-tally" aria-live="polite">
          <span className="hh-num">
            <b className={winner === 'a' ? 'lead' : ''}>{v.tally.a}</b>
            <span className="hh-dash">–</span>
            <b className={winner === 'b' ? 'lead' : ''}>{v.tally.b}</b>
          </span>
          <span className="hh-scope">{v.detail}</span>
          {focus.length > 0 && all.tally.compared > 0 && (
            <span className="hh-all">
              All tested: {all.tally.a}–{all.tally.b}
            </span>
          )}
        </div>
        <Link href={`/agents/${b.slug}`} className={`hh-fighter hh-fb${winner === 'b' ? ' win' : ''}`}>
          <AgentIcon name={b.name} icon={b.icon} size={72} className="hh-icon" />
          <span className="hh-fname">{b.name}</span>
          <span className="hh-fmeta">
            <ScoreCell value={b.overall} aggregate /> overall
            {b.opinionOverall.n > 0 && (
              <>
                <OpinionCell stat={b.opinionOverall} compact /> public
              </>
            )}
          </span>
        </Link>
      </header>

      <div className="hh-tools">
        <button type="button" className="btn primary" onClick={share}>
          {copied ? 'Link copied' : 'Share'}
        </button>
        <button type="button" className="btn ghost" onClick={postOnX}>
          Post on X
        </button>
        <a className="btn ghost" href={cardPath(a.slug, b.slug, focus, true)} download={fileName} onClick={() => track('save_card', eventProps())}>
          Save card
        </a>
        {focus.length > 0 && (
          <button type="button" className="hh-clear" onClick={() => update([])}>
            Clear highlights
          </button>
        )}
      </div>

      <div className={`hh-rows${focus.length ? ' focused' : ''}`} aria-label={`${a.name} vs ${b.name} by dimension`}>
        {rows.map(row => (
          <Row key={row.key} row={row} a={a.slug} b={b.slug} on={focus.includes(row.key)} toggle={() => toggle(row.key)} />
        ))}
      </div>

    </div>
  );
}

function Row({ row, a, b, on, toggle }: { row: CompareRow; a: string; b: string; on: boolean; toggle: () => void }) {
  const state = row.winner === null ? 'open' : row.winner === 'tie' ? 'tie' : 'won';
  return (
    <div className={`hh-row ${state}${on ? ' on' : ''}`}>
      <div className="hh-side hh-a">
        <ScoreLink run={row.runA} slug={a} value={row.a} win={row.winner === 'a'} />
        <Meta run={row.runA} />
        {row.runA?.notes && (
          <span className="hh-note" title={row.runA.notes}>
            {row.runA.notes}
          </span>
        )}
      </div>
      <button type="button" className="hh-cat" onClick={toggle} aria-pressed={on} title={on ? 'Remove highlight' : 'Highlight this dimension'}>
        <span className="hh-cat-label">{row.label}</span>
        {(row.winner === 'tie' || row.winner === null || on) && (
          <span className="hh-cat-sub">{row.winner === 'tie' ? 'Tie' : row.winner === null ? 'Not compared' : 'Highlighted'}</span>
        )}
      </button>
      <div className="hh-side hh-b">
        <ScoreLink run={row.runB} slug={b} value={row.b} win={row.winner === 'b'} />
        <Meta run={row.runB} />
        {row.runB?.notes && (
          <span className="hh-note" title={row.runB.notes}>
            {row.runB.notes}
          </span>
        )}
      </div>
    </div>
  );
}
