import Link from 'next/link';
import { CopyPrompt } from './CopyPrompt';
import { JobAgents } from './JobAgents';
import { JobLink } from './JobLink';
import { VoteButton } from './VoteButton';
import { CATEGORY_SHORT, RankedJob } from '@/lib/data';

/** One job on the use-cases list: who can do it first, then the prompt. */
export function JobCard({ job }: { job: RankedJob }) {
  const tested = new Set(job.tested.map(t => t.agent.slug)).size;
  const reported = new Set(job.reported.map(r => r.agent.slug)).size;
  return (
    <li className="uc" id={job.key}>
      <span className="uc-rank">{job.rank}</span>
      <div className="uc-body">
        <div className="uc-head">
          <Link href={`/use-cases?group=${job.group}`} className="chip">
            {job.groupLabel}
          </Link>
          {job.dimension && (
            <Link href={`/dimensions/${job.dimension}`} className="q-cat">
              {CATEGORY_SHORT[job.dimension] ?? job.dimension}
            </Link>
          )}
        </div>
        <h2 className="uc-title">
          <JobLink job={job.key} via="card">
            {job.title}
          </JobLink>
        </h2>
        <p className="uc-sum">{job.one_liner}</p>
        <JobAgents agents={job.agents} jobKey={job.key} />
        <div className="uc-prompt">
          <span className="uc-prompt-label">{job.prompt_source === 'posted' ? 'What they sent' : 'Try sending'}</span>
          <span className="uc-prompt-text">{job.prompt}</span>
          <CopyPrompt text={job.prompt} job={job.key} />
        </div>
        {job.caveat && <p className="uc-caveat">{job.caveat}</p>}
        <div className="uc-meta">
          <VoteButton job={job.key} initialVotes={job.votes} compact />
          <span>
            {tested} tested · {reported} reported
          </span>
          {job.submitted_by && (
            <span>
              Submitted by {job.submitted_by.handle}
              {job.submitted_by.vendor ? ' · works on this assistant' : ''}
            </span>
          )}
          <JobLink job={job.key} via="card">
            Details
          </JobLink>
        </div>
      </div>
    </li>
  );
}
