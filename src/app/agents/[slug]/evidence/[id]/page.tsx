import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { formatDate, formatSeconds, getAgentDetail, getAllSlugs, getCategory, getEvidence, getRuns, listEvidenceIds } from '@/lib/data';
import { AgentIcon } from '@/components/AgentIcon';
import { ScoreCell } from '@/components/ScoreCell';

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().flatMap(slug => listEvidenceIds(slug).map(id => ({ slug, id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const ev = getEvidence(slug, id);
  const agent = getAgentDetail(slug);
  if (!ev || !agent) return { title: 'Not found' };
  const cat = getCategory(ev.category);
  return { title: `${agent.name} · ${cat?.label ?? ev.category} test`, description: `The redacted thread behind ${agent.name}'s score on ${cat?.label ?? ev.category}.` };
}

const OUTCOME: Record<string, string> = { pass: 'Pass', partial: 'Partial', fail: 'Fail', 'n/a': 'N/A' };

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
}

/** Render [email]-style redaction markers as muted chips inside a bubble. */
function withMarkers(text: string) {
  const parts = text.split(/(\[(?:email|phone|address|card|code|number|zip|name|link: [^\]]+)\])/g);
  return parts.map((p, i) => (/^\[(email|phone|address|card|code|number|zip|name|link: )/.test(p) ? <span key={i} className="redacted">{p}</span> : <Fragment key={i}>{p}</Fragment>));
}

export default async function EvidencePage({ params }: Props) {
  const { slug, id } = await params;
  const ev = getEvidence(slug, id);
  const agent = getAgentDetail(slug);
  if (!ev || !agent) notFound();

  const category = getCategory(ev.category);
  const run = getRuns(slug).find(r => r.id === id);
  const s = ev.signals;
  const excerpt = ev.excerpt;

  return (
    <div className="wrap">
      <div className="ag-top">
        <Link href={`/agents/${slug}`} className="back">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5l-5 5 5 5" />
          </svg>
          {agent.name}
        </Link>
      </div>

      <div className="page-head" style={{ paddingTop: 18 }}>
        <p className="cat-kicker">
          {ev.protocol === 'task' ? 'Published test' : 'Observed in use'} · <Link href={`/categories/${ev.category}`}>{category?.label ?? ev.category}</Link> · {formatDate(ev.date)}
        </p>
        <div className="ev-head">
          <AgentIcon name={agent.name} icon={agent.icon} size={56} />
          <div>
            <h1 className="page-title">
              {agent.name}: {category?.label.toLowerCase() ?? ev.category}
            </h1>
            {run && (
              <p className="page-sub" style={{ marginTop: 4 }}>
                {OUTCOME[run.outcome] ?? run.outcome}
                {run.notes ? ` · ${run.notes}` : ''}
              </p>
            )}
          </div>
          {run && <ScoreCell value={run.score} />}
        </div>
        <p className="ev-meta">
          <span>
            <b>{s.turns}</b> messages
          </span>
          <span>
            first reply <b>{formatSeconds(s.first_reply_s)}</b>
          </span>
          <span>
            over <b>{s.duration_min < 1 ? 'under a minute' : `${s.duration_min} min`}</b>
          </span>
          {s.agent_initiated && <span>started by the assistant</span>}
          {s.agent_asked_question && <span>it asked a question</span>}
          {s.agent_said_cant && <span>it said it couldn&apos;t</span>}
        </p>
      </div>

      {excerpt ? (
      <div className="chat" role="log" aria-label="Message thread, redacted">
        {excerpt.map((m, i) => {
          const prev = excerpt[i - 1];
          const gap = prev ? Date.parse(m.ts) - Date.parse(prev.ts) : Infinity;
          return (
            <Fragment key={`${m.ts}-${i}`}>
              {gap > 10 * 60 * 1000 && <div className="msg-ts">{timeLabel(m.ts)}</div>}
              <div className={`msg ${m.from}`}>
                {withMarkers(m.text)}
                {m.attachment && <div className="msg-att">📎 attachment not shown</div>}
              </div>
            </Fragment>
          );
        })}
      </div>
      ) : (
        <div className="ev-private">
          <div className="ev-private-row">
            <span className="il">What was asked</span>
            <span className="iv">{category?.label ?? ev.category}{ev.protocol === 'task' ? ', using the published prompt' : ', in normal use'}</span>
          </div>
          <div className="ev-private-row">
            <span className="il">Messages in the exchange</span>
            <span className="iv">{s.turns} ({s.my_messages} from the reviewer, {s.agent_messages} from {agent.name})</span>
          </div>
          <div className="ev-private-row">
            <span className="il">First reply</span>
            <span className="iv">{formatSeconds(s.first_reply_s)}</span>
          </div>
          <div className="ev-private-row">
            <span className="il">How it ended</span>
            <span className="iv">{s.agent_said_done ? 'It reported the task done' : s.agent_said_cant ? "It said it couldn't" : 'No explicit completion message'}</span>
          </div>
        </div>
      )}

      <p className="ev-note">
        {ev.excerpt
          ? `This is the reviewer's real iMessage thread with ${agent.name}, trimmed to this one test. Emails, phone numbers, addresses, card and confirmation numbers, links and personal names were replaced with bracketed markers before publishing. Times are UTC.`
          : `The reviewer's own iMessage thread with ${agent.name} is the source for this run. The message text stays private; what's published is the category, the date, the score, and the timings measured from the thread.`}
      </p>
    </div>
  );
}
