import { getAgents, rankAgents } from '@/lib/data';
import { AgentStatus } from '@/lib/types';
import { AgentRow } from './AgentRow';
import { Shelf } from './Shelf';

const COPY: Record<AgentStatus, { title: string; sub: string }> = {
  confirmed: {
    title: 'Confirmed',
    sub: 'Personal assistants you text.',
  },
  stretch: {
    title: 'Stretch',
    sub: 'Voice, hardware, desktop and infra. N/A where the rubric doesn’t apply.',
  },
};

export function RosterPage({ status }: { status: AgentStatus }) {
  const agents = rankAgents(getAgents().filter(a => a.status === status));
  const { title, sub } = COPY[status];

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{sub}</p>
      </div>
      <Shelf title={`${agents.length} assistants`} stack>
        {agents.map(agent => (
          <AgentRow key={agent.slug} agent={agent} />
        ))}
      </Shelf>
    </div>
  );
}
