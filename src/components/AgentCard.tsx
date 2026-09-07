import Link from 'next/link';
import { Agent } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const feedbackCount = agent.feedback.length;
  const hasScores = Object.values(agent.scores).some(
    score => score !== null && score !== 'n/a'
  );

  return (
    <Link href={`/agents/${agent.slug}`}>
      <article className="group bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-bubble-blue/20">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate group-hover:text-bubble-blue transition-colors">
                {agent.name}
              </h3>
              <span className={`status-badge ${agent.status === 'confirmed' ? 'status-confirmed' : 'status-stretch'}`}>
                {agent.status === 'confirmed' ? 'Confirmed' : 'Stretch'}
              </span>
            </div>
            <p className="text-sm text-secondary">{agent.vendor}</p>
          </div>
          
          <div className="flex-shrink-0 text-right">
            {hasScores ? (
              <div className="text-2xl font-semibold text-bubble-blue">
                --
              </div>
            ) : (
              <div className="text-sm text-secondary font-medium px-3 py-1 rounded-lg bg-bubble-gray/50">
                Unscored
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-secondary line-clamp-2 mb-4">
          {agent.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-secondary">
                {feedbackCount} {feedbackCount === 1 ? 'feedback' : 'feedbacks'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-bubble-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
