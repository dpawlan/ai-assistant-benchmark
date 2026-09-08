import { speedBucket } from '@/lib/score';
import { Usage } from '@/lib/types';

function short(s: number): string {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  return `${Math.round(s / 3600)}h`;
}

/** Median reply time from the reviewer's own thread; measured, not judged. */
export function SpeedCell({ usage }: { usage: Usage | null }) {
  if (!usage || usage.median_reply_s === null) {
    return (
      <span className="sc sc-null" title="No hands-on thread yet">
        —
      </span>
    );
  }
  const s = usage.median_reply_s;
  const title = `Median reply ${short(s)} over ${usage.messages} messages · slowest 10% ${usage.p90_reply_s === null ? '—' : short(usage.p90_reply_s)} · ${usage.unanswered} never answered`;
  return (
    <span className={`sc sc-${speedBucket(s)}`} title={title}>
      {short(s)}
    </span>
  );
}
