'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AgentIcon } from './AgentIcon';
import { OpinionCell } from './OpinionCell';
import { ScoreCell } from './ScoreCell';
import { CompareRow, Comparison, OUTCOME_LABEL, cardImagePath, cardPath, comparePath, shortDate, verdict } from '@/lib/compare-shared';
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

function RunLine({ run, slug }: { run: Run | null; slug: string }) {
  if (!run) return <span className="hh-run empty">Not tested</span>;
  const thread = run.evidence_url ? (
    run.evidence_url.startsWith('/') ? (
      <Link href={run.evidence_url}>Thread</Link>
    ) : (
      <a href={run.evidence_url} target="_blank" rel="noopener noreferrer">
        Evidence
      </a>
    )
  ) : (
    <Link href={`/agents/${slug}`}>Profile</Link>
  );
  return (
    <span className="hh-run">
      <span className="hh-run-meta">
        {OUTCOME_LABEL[run.outcome] ?? run.outcome} · {run.protocol === 'task' ? 'test' : 'observed'} · {shortDate(run.date)} · {thread}
      </span>
      {run.notes && <span className="hh-note">{run.notes}</span>}
    </span>
  );
}

/** The middle scorecard: one row per dimension, the check goes to the higher tested score. Tap a dimension to highlight it. */
export function Scorecard({ comparison, initialFocus }: ScorecardProps) {
  const { a, b, rows } = comparison;
  const [focus, setFocus] = useState<string[]>(initialFocus);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
  const postOnX = () => {
    const intent = `https://x.com/intent/post?${new URLSearchParams({ text: shareText, url: url() }).toString()}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  };

  const flash = (text: string) => {
    setNote(text);
    setTimeout(() => setNote(null), 3500);
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

  const imagePath = cardImagePath(a.slug, b.slug, focus);
  const imageUrl = () => window.location.origin + imagePath;
  const fileName = `${a.slug}-vs-${b.slug}${focus.length ? '-' + focus.join('-') : ''}.png`;

  const fetchCard = async () => {
    const res = await fetch(cardPath(a.slug, b.slug, focus));
    if (!res.ok) throw new Error(`card ${res.status}`);
    return res.blob();
  };

  /** Hand the PNG itself to the share sheet (phones), else copy the image (desktop), else download it. */
  const shareCard = async () => {
    setBusy(true);
    try {
      const blob = await fetchCard();
      const file = new File([blob], fileName, { type: 'image/png' });
      if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: v.headline, text: `${shareText} ${url()}` });
          return;
        } catch {
          return; /* cancelled */
        }
      }
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          flash('Card copied as an image. Paste it anywhere.');
          return;
        } catch {
          /* clipboard blocked: fall through */
        }
      }
      window.location.href = cardPath(a.slug, b.slug, focus, true);
      flash('Downloading the card.');
    } catch {
      flash('Could not load the card. Try the download link.');
    } finally {
      setBusy(false);
    }
  };

  const copyImageLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl());
      flash('Image link copied.');
    } catch {
      window.prompt('Copy this image link', imageUrl());
    }
  };

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
        <div className="hh-tool-group">
          <span className="hh-tool-label">Link</span>
          <button type="button" className="btn primary" onClick={share}>
            {copied ? 'Link copied' : 'Share'}
          </button>
          <button type="button" className="btn ghost" onClick={copy}>
            Copy link
          </button>
          <button type="button" className="btn ghost" onClick={postOnX}>
            Post on X
          </button>
        </div>
        <div className="hh-tool-group">
          <span className="hh-tool-label">Card</span>
          <button type="button" className="btn primary" onClick={shareCard} disabled={busy}>
            {busy ? 'Preparing…' : 'Share card'}
          </button>
          <a className="btn ghost" href={cardPath(a.slug, b.slug, focus, true)} download={fileName}>
            Download PNG
          </a>
          <button type="button" className="btn ghost" onClick={copyImageLink}>
            Copy image link
          </button>
        </div>
        <div className="hh-tool-group">
          <Link className="btn ghost" href={comparePath(b.slug, a.slug, focus)}>
            Swap sides
          </Link>
          {focus.length > 0 && (
            <button type="button" className="hh-clear" onClick={() => update([])}>
              Clear highlights
            </button>
          )}
        </div>
      </div>
      {note && (
        <p className="hh-note-flash" role="status">
          {note}
        </p>
      )}

      <p className="hh-hint">
        {focus.length
          ? `${focus.length} ${focus.length === 1 ? 'dimension' : 'dimensions'} highlighted. The tally, link and share card follow your picks.`
          : 'Tap a dimension to highlight it. The tally, link and share card follow your picks.'}
      </p>

      <div className={`hh-rows${focus.length ? ' focused' : ''}`} aria-label={`${a.name} vs ${b.name} by dimension`}>
        {rows.map(row => (
          <Row key={row.key} row={row} a={a.slug} b={b.slug} on={focus.includes(row.key)} toggle={() => toggle(row.key)} />
        ))}
      </div>

      <section className="hh-card">
        <h2 className="ag-h2">Share card</h2>
        <p className="ag-sub">This is the image behind the link preview. Tap it to open full size, or press and hold to save on a phone.</p>
        <a className="hh-card-link" href={imagePath} target="_blank" rel="noopener noreferrer">
          {/* Rendered by /api/og/compare; a plain img so the preview always matches the real card. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hh-card-img" src={cardPath(a.slug, b.slug, focus)} width={1200} height={630} alt={`${v.headline}. ${v.detail}`} />
        </a>
        <p className="hh-card-url">
          <code>{imagePath}</code>
        </p>
      </section>
    </div>
  );
}

function Row({ row, a, b, on, toggle }: { row: CompareRow; a: string; b: string; on: boolean; toggle: () => void }) {
  const state = row.winner === null ? 'open' : row.winner === 'tie' ? 'tie' : 'won';
  return (
    <div className={`hh-row ${state}${on ? ' on' : ''}`}>
      <div className="hh-side hh-a">
        <span className="hh-scoreline">
          {row.winner === 'a' && <Check />}
          <ScoreCell value={row.a} />
        </span>
        <RunLine run={row.runA} slug={a} />
        {row.opinionA && (
          <span className="hh-op">
            <OpinionCell stat={row.opinionA} compact /> public
          </span>
        )}
      </div>
      <button type="button" className="hh-cat" onClick={toggle} aria-pressed={on} title={on ? 'Remove highlight' : 'Highlight this dimension'}>
        <span className="hh-cat-label">{row.label}</span>
        <span className="hh-cat-sub">{row.winner === 'tie' ? 'Tie' : row.winner === null ? 'Not compared' : on ? 'Highlighted' : ''}</span>
      </button>
      <div className="hh-side hh-b">
        <span className="hh-scoreline">
          <ScoreCell value={row.b} />
          {row.winner === 'b' && <Check />}
        </span>
        <RunLine run={row.runB} slug={b} />
        {row.opinionB && (
          <span className="hh-op">
            <OpinionCell stat={row.opinionB} compact /> public
          </span>
        )}
      </div>
    </div>
  );
}
