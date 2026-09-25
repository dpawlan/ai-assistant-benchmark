import { AgentIcon } from '@/components/AgentIcon';
import type { Agent } from '@/lib/types';
import type { Report } from '@/lib/reports';

/**
 * Featured image for a report, composed from the assistants it ranks so every report has one
 * with the same proportions. `report.cover.agents` lists them in order; the first is the pick.
 */
export function ReportCover({ report, bySlug, size = 'card' }: { report: Report; bySlug: Record<string, Agent>; size?: 'card' | 'hero' }) {
  const agents = report.cover.agents.map(s => bySlug[s]).filter(Boolean);
  const [lead, ...rest] = agents;
  const big = size === 'hero' ? 96 : 64;
  const small = size === 'hero' ? 44 : 32;
  return (
    <div className={`rp-cover rp-cover-icons rp-cover-${size}`} style={{ background: report.cover.tint }} aria-hidden="true">
      {lead && <AgentIcon name={lead.name} icon={lead.icon} size={big} className="rp-cover-lead" />}
      <div className="rp-cover-rest">
        {rest.slice(0, 6).map(a => (
          <AgentIcon key={a.slug} name={a.name} icon={a.icon} size={small} className="rp-cover-small" />
        ))}
      </div>
    </div>
  );
}
