import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AgentIcon } from '@/components/AgentIcon';
import { CopyPrompt } from '@/components/CopyPrompt';
import { ScoreCell } from '@/components/ScoreCell';
import { VoteButton } from '@/components/VoteButton';
import { QuoteItem, shortDate } from '@/components/QuoteItem';
import { CATEGORY_SHORT, getJob } from '@/lib/data';
import { getVoteCounts } from '@/lib/votes';

export const dynamic = 'force-dynamic';

const OUTCOME_LABEL: Record<string, string> = { done: 'Done', partial: 'Partly', failed: 'Failed' };

export async function generateMetadata({ params }: { params: Promise<{ job: string }> }): Promise<Metadata> {
  const { job: key } = await params;
  const job = getJob(key);
  if (!job) return { title: 'Use case' };
  return { title: job.title, description: job.one_liner };
}

/** Everything behind one job: who we tested on it, who reports it, and the prompt. */
export default async function JobPage({ params }: { params: Promise<{ job: string }> }) {
  const { job: key } = await params;
  const job = getJob(key);
  if (!job) notFound();
  const votes = await getVoteCounts([job.key]);
  const onThisJob = job.tested.filter(t => t.via === 'run');
  const onDimension = job.tested.filter(t => t.via === 'dimension');
  const dimLabel = job.dimension ? (CATEGORY_SHORT[job.dimension] ?? job.dimension) : null;

  return (
    <div className="wrap">
      <Link href="/use-cases" className="back">
        ‹ Use cases
      </Link>

      <div className="job-head">
        <div>
          <div className="uc-head">
            <Link href={`/use-cases?group=${job.group}`} className="chip">
              {job.groupLabel}
            </Link>
            {job.dimension && (
              <Link href={`/dimensions/${job.dimension}`} className="q-cat">
                {dimLabel}
              </Link>
            )}
          </div>
          <h1 className="page-title">{job.title}</h1>
          <p className="uc-sum">{job.one_liner}</p>
        </div>
        <VoteButton job={job.key} initialVotes={votes[job.key] ?? 0} />
      </div>

      <div className="uc-prompt">
        <span className="uc-prompt-label">{job.prompt_source === 'posted' ? 'What they sent' : 'Try sending'}</span>
        <span className="uc-prompt-text">{job.prompt}</span>
        <CopyPrompt text={job.prompt} job={job.key} />
      </div>
      {job.caveat && <p className="uc-caveat">{job.caveat}</p>}

      <section className="job-section">
        <h2>Tested</h2>
        {job.tested.length === 0 ? (
          <p className="sub">No hands-on runs on this job yet.</p>
        ) : (
          <>
            {onThisJob.length > 0 && <p className="sub">Hands-on runs of exactly this job.</p>}
            {onThisJob.map(t => (
              <TestedRow key={t.run.id} t={t} />
            ))}
            {onDimension.length > 0 && (
              <p className="sub" style={{ marginTop: onThisJob.length ? 14 : 0 }}>
                Latest run on the {dimLabel} dimension, which is the benchmark test closest to this job.
              </p>
            )}
            {onDimension.map(t => (
              <TestedRow key={t.run.id} t={t} />
            ))}
          </>
        )}
      </section>

      <section className="job-section">
        <h2>Reported</h2>
        {job.reported.length === 0 ? (
          <p className="sub">No public posts about this job yet.</p>
        ) : (
          <p className="sub">The posts this job came from, as written. Our one-line note sits above each; the words below are theirs.</p>
        )}
        <div className="quote-list">
          {job.reported.map(r => (
            <div key={r.quote.id} className="job-post">
              <div className="job-post-note">
                {r.outcome && <span className={`outcome ${r.outcome}`}>{OUTCOME_LABEL[r.outcome]}</span>}
                {r.note && <span>{r.note}</span>}
              </div>
              <QuoteItem quote={r.quote} agent={r.agent} />
            </div>
          ))}
        </div>
      </section>

      {job.submitted_by && (
        <p className="uc-note">
          Submitted by {job.submitted_by.handle}
          {job.submitted_by.vendor ? ', who works on this assistant.' : '.'}
        </p>
      )}
    </div>
  );
}

function TestedRow({ t }: { t: { agent: { slug: string; name: string; icon: string | null }; run: { id: string; outcome: string; protocol?: string; date: string; notes?: string; score: number | 'n/a' | null; evidence_url?: string }; href: string } }) {
  return (
    <div className="job-row">
      <AgentIcon name={t.agent.name} icon={t.agent.icon} size={32} />
      <div className="job-row-body">
        <Link href={`/agents/${t.agent.slug}`} className="job-row-name">
          {t.agent.name}
        </Link>
        {t.run.notes && <div>{t.run.notes}</div>}
        <div className="job-row-line">
          {t.run.outcome} · {t.run.protocol === 'task' ? 'test' : 'observed'} · {shortDate(t.run.date)}
          {t.run.evidence_url && (
            <>
              {' · '}
              <Link href={t.run.evidence_url}>Read the thread</Link>
            </>
          )}
        </div>
      </div>
      <ScoreCell value={t.run.score} />
    </div>
  );
}
