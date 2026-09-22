import Link from 'next/link';
import { Metadata } from 'next';
import { formatDate, getAgents } from '@/lib/data';
import { getReports } from '@/lib/reports';
import { AgentIcon } from '@/components/AgentIcon';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
  const reports = getReports();
  const agents = Object.fromEntries(getAgents().map(a => [a.slug, a]));
  return (
    <div className="wrap mid">
      <div className="page-head">
        <h1 className="page-title">Reports</h1>
        <p className="page-sub">
          One report per question you would actually ask, kept current. Each pick comes from runs of the same published test, and every update names the run behind it.
        </p>
      </div>
      <p className="rp-preview">Preview with placeholder prose. Scores in the tables are real; the write-ups are illustrative.</p>
      <div className="rp-list">
        {reports.map(r => {
          const pick = agents[r.pick];
          return (
            <Link key={r.key} href={`/reports/${r.key}`} className="rp-card">
              <span className="rp-card-q">{r.question}</span>
              <span className="rp-card-verdict">
                {pick && <AgentIcon name={pick.name} icon={pick.icon} size={28} className="rp-card-icon" />}
                <span>
                  <span className="rp-card-pick">{pick?.name ?? r.pick}</span>
                  <span className="rp-card-line">{r.verdict}</span>
                </span>
              </span>
              <span className="rp-card-meta">
                Updated {formatDate(r.updated)}
                {r.changes.length > 0 && ` after "${r.changes[0].title}"`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
