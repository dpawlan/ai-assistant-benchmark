'use client';

import { useMemo } from 'react';
import type { Agent, Category } from '@/lib/types';
import { STATUS_CAPTION, STATUS_LABEL, STATUS_ORDER, statusCounts, type BenchStatus } from '@/lib/status';

interface StatusStripProps {
  agents: Agent[];
  categories: Category[];
  active?: BenchStatus | 'all';
  onPick?: (s: BenchStatus | 'all') => void;
}

/** Completed / in progress / pending, so the headline count is read as coverage, not a finished table. */
export function StatusStrip({ agents, categories, active = 'all', onPick }: StatusStripProps) {
  const counts = useMemo(() => statusCounts(agents, categories), [agents, categories]);
  const total = agents.length || 1;
  const pct = (s: BenchStatus) => Math.round((counts[s] / total) * 100);

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
