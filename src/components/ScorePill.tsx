import { Agent } from '@/lib/types';

/** Blue with the core mean once tested; until then the amount of public discussion, which is the only real signal. */
export function ScorePill({ agent }: { agent: Agent }) {
  if (agent.core !== null) {
    return (
      <span className="pill" title="Mean of scored core categories">
        {agent.core.toFixed(1)}
      </span>
    );
  }
  if (agent.endorsed !== null) {
    return (
      <span className="pill" title="Mean of scored endorsed categories (no core scores yet)">
        {agent.endorsed.toFixed(1)}
      </span>
    );
  }
  const n = agent.feedbackCount;
  return <span className="pill muted">{n === 1 ? '1 quote' : `${n} quotes`}</span>;
}
