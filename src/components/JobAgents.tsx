import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import { JobLink } from './JobLink';
import { ScoreCell } from './ScoreCell';
import { CATEGORY_SHORT, JobAgent } from '@/lib/data';

const OUTCOME_WORD: Record<string, string> = { done: 'did it', partial: 'partly did it', failed: 'could not do it' };

/**
 * One chip per assistant. Solid = we tested it (links to the run's evidence, shows the score).
 * Hollow = someone reports it (links to their post). Wraps; never scrolls sideways.
 */
export function JobAgents({ agents, max = 8, jobKey }: { agents: JobAgent[]; max?: number; jobKey: string }) {
  if (!agents.length) return null;
  const shown = agents.slice(0, max);
  const rest = agents.length - shown.length;
  return (
    <div className="uc-logos">
      {shown.map(({ agent, tested, reported }) => {
        if (tested) {
          const dim = CATEGORY_SHORT[tested.run.category] ?? tested.run.category;
          const title = `${agent.name}: ${tested.run.outcome} · ${tested.run.score}/10 · ${tested.via === 'run' ? 'tested on this job' : `tested on ${dim}`}`;
          return (
            <Link key={agent.slug} href={tested.href} className="uc-logo solid" title={title}>
              <AgentIcon name={agent.name} icon={agent.icon} size={24} />
              {agent.name}
              <ScoreCell value={tested.run.score} />
            </Link>
          );
        }
        const r = reported!;
        const title = `${agent.name}: ${r.outcome ? OUTCOME_WORD[r.outcome] + '. ' : ''}${r.note ?? 'reported by ' + r.quote.author}`;
        return (
          <a key={agent.slug} href={r.quote.url} target="_blank" rel="noopener noreferrer" className="uc-logo hollow" title={title}>
            <AgentIcon name={agent.name} icon={agent.icon} size={24} />
            {agent.name}
          </a>
        );
      })}
      {rest > 0 && (
        <JobLink job={jobKey} via="more" className="uc-logo more">
          +{rest} more
        </JobLink>
      )}
    </div>
  );
}
