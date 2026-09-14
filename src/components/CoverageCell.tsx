import type { Coverage } from '@/lib/status';

/** "11/15" with a hairline bar: how much of the rubric has been run for one assistant. */
export function CoverageCell({ c, compact = false }: { c: Coverage; compact?: boolean }) {
  if (c.scored === 0) return <span className="cov cov-0">—</span>;
  const pct = c.applicable ? Math.round((c.scored / c.applicable) * 100) : 0;
  const done = c.scored >= c.applicable;
  return (
    <span className={`cov${done ? ' cov-done' : ''}${compact ? ' cov-compact' : ''}`} title={`${c.scored} of ${c.applicable} applicable dimensions scored${c.na ? `, ${c.na} N/A` : ''}`}>
      <span className="cov-n">
        {c.scored}/{c.applicable}
      </span>
      <span className="cov-bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </span>
    </span>
  );
}
