import { AgentIcon } from '@/components/AgentIcon';
import type { Agent } from '@/lib/types';
import type { Report } from '@/lib/reports';

/**
 * Cover illustration for a report: the test as a text thread. The task goes out, the pick
 * replies. Built from `cover_prompt` and `cover_reply` in the report's frontmatter (falling back
 * to the question), on the report's tint, so every report gets a distinct image with the same bones.
 */
export function ReportCover({ report, bySlug, size = 'card' }: { report: Report; bySlug: Record<string, Agent>; size?: 'card' | 'hero' | 'thumb' }) {
  const pick = bySlug[report.picks[0]?.slug];
  const prompt = report.cover.prompt || report.question;
  const reply = report.cover.reply || (pick ? `${pick.name} is on it.` : 'On it.');
  return (
    <div className={`rp-cover rp-cover-${size}`} style={{ background: `linear-gradient(160deg, ${report.cover.tint} 0%, #fff 140%)` }} aria-hidden="true">
      <div className="rp-scene">
        <div className="rp-bub out">
          <span>{prompt}</span>
        </div>
        <span className="rp-bub-meta">Delivered</span>
        <div className="rp-bub-row">
          {pick && <AgentIcon name={pick.name} icon={pick.icon} size={28} className="rp-bub-avatar" />}
          <div className="rp-bub in">
            <span>{reply}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
