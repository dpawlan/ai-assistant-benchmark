import Link from 'next/link';
import { Agent } from '@/lib/types';
import { AgentIcon } from './AgentIcon';
import { ScorePill } from './ScorePill';

interface AgentRowProps {
  agent: Agent;
  rank?: number;
}

/** One agent as a row: icon, name, tagline, and a score or quote-count pill on the right. */
export function AgentRow({ agent, rank }: AgentRowProps) {
  const inner = (
    <>
      <AgentIcon name={agent.name} icon={agent.icon} />
      <span className="row-body">
        <span className="row-name">{agent.name}</span>
        <span className="row-tag">{agent.tagline}</span>
      </span>
      <span className="row-slot">
        <ScorePill agent={agent} />
      </span>
    </>
  );

  if (rank !== undefined) {
    return (
      <Link href={`/agents/${agent.slug}`} className="chart-row">
        <span className="chart-rank">{rank}</span>
        {inner}
      </Link>
    );
  }

  return (
    <div className="cell">
      <Link href={`/agents/${agent.slug}`} className="row">
        {inner}
      </Link>
    </div>
  );
}
