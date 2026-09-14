import { formatDate, getBenchmarkStats } from '@/lib/data';

/** Coverage line under the hero: how much of the benchmark has actually been run. */
export function BenchmarkStrip({ updated }: { updated: string }) {
  const s = getBenchmarkStats();

  return (
    <div className="bench-strip" role="status">
      <span className="bench-v">Benchmark v{s.version}</span>
      <span className="bench-sep" aria-hidden="true" />
      <span>{s.taskCount} tasks</span>
      <span className="bench-sep" aria-hidden="true" />
      <span>{s.runCount} runs</span>
      <span className="bench-sep" aria-hidden="true" />
      {s.lastTested && (
        <>
          <span>last test {formatDate(s.lastTested, 'short')}</span>
          <span className="bench-sep" aria-hidden="true" />
        </>
      )}
      <span>updated {formatDate(updated, 'short')}</span>
    </div>
  );
}
