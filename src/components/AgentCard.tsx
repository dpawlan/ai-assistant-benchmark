import Link from 'next/link';
import { Agent } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function SignalIndicator({ signal }: { signal: Agent['publicSignal'] }) {
  if (!signal || signal === 'unknown') return null;
  
  const config = {
    high: { label: 'High signal', color: 'bg-[#248a3d]' },
    medium: { label: 'Medium signal', color: 'bg-[#bf5600]' },
    low: { label: 'Low signal', color: 'bg-secondary' },
  };

  const { label, color } = config[signal];

  return (
    <span 
      className="flex items-center gap-1.5 text-micro text-secondary"
      title={label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {signal}
    </span>
  );
}

export function AgentCard({ agent }: AgentCardProps) {
  const displaySite = agent.site 
    ? agent.site.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : null;

  return (
    <Link 
      href={`/agents/${agent.slug}`}
      className="list-row group"
    >
      <div className="avatar mr-4">
        {getInitial(agent.name)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-body-semibold truncate group-hover:text-accent transition-colors">
            {agent.name}
          </h3>
          <span className={`badge ${agent.status === 'confirmed' ? 'badge-confirmed' : 'badge-stretch'}`}>
            {agent.status === 'confirmed' ? 'Confirmed' : 'Stretch'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          {displaySite && (
            <span className="text-caption text-secondary truncate">
              {displaySite}
            </span>
          )}
          <SignalIndicator signal={agent.publicSignal} />
        </div>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        <div className="text-right">
          <div className="text-caption text-secondary">
            {agent.feedbackCount} {agent.feedbackCount === 1 ? 'feedback' : 'feedbacks'}
          </div>
        </div>
        
        <svg 
          className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </div>
    </Link>
  );
}
