import { AgentIcon } from '@/components/AgentIcon';
import type { Agent } from '@/lib/types';
import type { Report } from '@/lib/reports';

/**
 * Featured image for a report, composed from the assistants it ranks so every report has one
 * with the same proportions. `report.cover.agents` lists them in order; the first is the pick.
 */
export function ReportCover({ report, bySlug, size = 'card' }: { report: Report; bySlug: Record<string, Agent>; size?: 'card' | 'hero' }) {
  const travel = report.key === 'consumer-ai-travel';
  const agents = report.cover.agents.map(s => bySlug[s]).filter(Boolean);
  const [lead, ...rest] = agents;
  const big = size === 'hero' ? 96 : 64;
  const small = size === 'hero' ? 44 : 32;
  return (
    <div className={`rp-cover rp-cover-icons rp-cover-${size}${travel ? " rp-cover-travel" : ""}`} style={{ background: report.cover.tint }} aria-hidden="true">
      {travel && <svg className="rp-travel-art" viewBox="0 0 320 320" fill="none" focusable="false">
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.22">
          <circle cx="160" cy="160" r="138" />
          <ellipse cx="160" cy="160" rx="76" ry="138" />
          <ellipse cx="160" cy="160" rx="138" ry="52" />
          <path d="M22 160h276M160 22v276" />
        </g>
        <path d="M35 239C43 101 185 8 279 86" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.5" />
        <circle cx="35" cy="239" r="4" fill="currentColor" opacity="0.5" />
        <path d="M0-20C2-20 3-17 3-14V-5L18 5V9L3 4V14L8 18V21L0 18L-8 21V18L-3 14V4L-18 9V5L-3-5V-14C-3-17-2-20 0-20Z" transform="translate(279 86) rotate(120)" fill="currentColor" opacity="0.65" />
      </svg>}
      {lead && <AgentIcon name={lead.name} icon={lead.icon} size={big} className="rp-cover-lead" />}
      <div className="rp-cover-rest">
        {rest.slice(0, 6).map(a => (
          <AgentIcon key={a.slug} name={a.name} icon={a.icon} size={small} className="rp-cover-small" />
        ))}
      </div>
    </div>
  );
}
