import { formatDate, getBenchmarkStats } from '@/lib/data';

/** Coverage line under the hero: how much of the benchmark has actually been run. */
export function BenchmarkStrip({ updated }: { updated: string }) {
  const s = getBenchmarkStats();
  const pct = s.agentCount ? Math.round((s.testedCount / s.agentCount) * 100) : 0;

  return (
    <div className="bench-strip" role="status">
      <span className="bench-v">Benchmark v{s.version}</span>
      <span className="bench-sep" aria-hidden="true" />
      <span>{s.taskCount} tasks</span>
      <span className="bench-sep" aria-hidden="true" />
      <span className="bench-cov">
        <span className="bench-bar" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </span>
        {s.testedCount} of {s.agentCount} tested
      </span>
      <span className="bench-sep" aria-hidden="true" />
      <span>{s.lastTested ? `last test ${formatDate(s.lastTested, 'short')}` : `data updated ${formatDate(updated, 'short')}`}</span>
      {s.classifiedCount > 0 && (
        <>
          <span className="bench-sep" aria-hidden="true" />
          <span>{s.classifiedCount} of {s.quoteCount} public quotes read for opinion</span>
        </>
      )}
    </div>
  );
}
