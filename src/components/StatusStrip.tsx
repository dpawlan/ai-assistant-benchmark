'use client';

import { useMemo } from 'react';
import type { Agent, Category } from '@/lib/types';
import { STATUS_CAPTION, STATUS_LABEL, STATUS_ORDER, statusCounts, type BenchStatus } from '@/lib/status';

interface StatusStripProps {
  agents: Agent[];
  categories: Category[];
  /** a = stacked bar with three counters; b = three stat tiles; c = one sentence with inline dots. */
  design: 'a' | 'b' | 'c';
  active?: BenchStatus | 'all';
  onPick?: (s: BenchStatus | 'all') => void;
}

/** Completed / in progress / pending, so the headline count is read as coverage, not a finished table. */
export function StatusStrip({ agents, categories, design, active = 'all', onPick }: StatusStripProps) {
  const counts = useMemo(() => statusCounts(agents, categories), [agents, categories]);
  const total = agents.length || 1;
  const pct = (s: BenchStatus) => Math.round((counts[s] / total) * 100);

  if (design === 'b') {
    return (
      <div className="st-tiles" role="group" aria-label="Benchmark coverage">
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            type="button"
            className={`st-tile st-${s}${active === s ? ' on' : ''}`}
            onClick={() => onPick?.(active === s ? 'all' : s)}
            aria-pressed={active === s}
          >
            <span className="st-tile-n">{counts[s]}</span>
            <span className="st-tile-l">
              <span className={`st-dot st-${s}`} aria-hidden="true" />
              {STATUS_LABEL[s]}
            </span>
            <span className="st-tile-c">{STATUS_CAPTION[s]}</span>
          </button>
        ))}
      </div>
    );
  }

  if (design === 'c') {
    return (
      <p className="st-line" role="status">
        {STATUS_ORDER.map((s, i) => (
          <span key={s} className="st-line-item">
            {i > 0 && <span className="bench-sep" aria-hidden="true" />}
            <span className={`st-dot st-${s}`} aria-hidden="true" />
            <b>{counts[s]}</b> {STATUS_LABEL[s].toLowerCase()}
          </span>
        ))}
        <span className="bench-sep" aria-hidden="true" />
        <span className="st-line-note">Overall is a partial mean until an assistant is completed.</span>
      </p>
    );
  }

  return (
    <div className="st-strip" role="group" aria-label="Benchmark coverage">
      <div className="st-bar" aria-hidden="true">
        {STATUS_ORDER.map(s => (
          <span key={s} className={`st-seg st-${s}`} style={{ width: `${pct(s)}%` }} />
        ))}
      </div>
      <div className="st-legend">
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            type="button"
            className={`st-key${active === s ? ' on' : ''}`}
            onClick={() => onPick?.(active === s ? 'all' : s)}
            aria-pressed={active === s}
            title={STATUS_CAPTION[s]}
          >
            <span className={`st-dot st-${s}`} aria-hidden="true" />
            <b>{counts[s]}</b> {STATUS_LABEL[s].toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
