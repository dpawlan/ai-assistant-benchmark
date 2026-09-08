import { Agent } from '@/lib/types';

/** Blue with the overall mean once tested; until then the amount of public discussion, which is the only real signal. */
export function ScorePill({ agent }: { agent: Agent }) {
  if (agent.overall !== null) {
    return (
      <span className="pill" title="Mean of every category scored">
        {agent.overall.toFixed(1)}
      </span>
    );
  }
  const n = agent.feedbackCount;
  return <span className="pill muted">{n === 1 ? '1 quote' : `${n} quotes`}</span>;
}
