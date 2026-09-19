import { Metadata } from 'next';
import Link from 'next/link';
import { JobCard } from '@/components/JobCard';
import { UseCaseFilters } from '@/components/UseCaseFilters';
import { getJobGroups, getJobs, jobMatches, rankJobs } from '@/lib/data';
import { getVoteCounts } from '@/lib/votes';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Use cases',
  description: 'What people get AI assistants to do, and which assistants can actually do it. One entry per job, with the assistants we tested and the ones people report.',
};

/** One card per job, ranked by upvotes, hands-on tests, reports and engagement. ?group= filters, ?sort=new reorders. */
export default async function UseCasesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const groups = getJobGroups();
  const group = typeof params.group === 'string' && groups.some(g => g.key === params.group) ? params.group : null;
  const sort = params.sort === 'new' ? 'new' : 'top';
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 80) : '';
  const jobs = getJobs().filter(j => (!group || j.group === group) && jobMatches(j, q));
  const votes = await getVoteCounts(jobs.map(j => j.key));
  const ranked = rankJobs(jobs, votes, sort);

  return (
    <div className="wrap mid">
      <div className="page-head uc-head-row">
        <div>
          <h1 className="page-title">Use cases</h1>
          <p className="page-sub">
            What people get these assistants to do, and which ones can actually do it. Solid logos are jobs we tested; hollow ones are jobs people
            report.
          </p>
        </div>
        <Link href="/use-cases/submit" className="btn ghost">
          Submit a use case
        </Link>
      </div>

      <UseCaseFilters groups={groups} group={group} sort={sort} q={q} />

      {ranked.length === 0 ? (
        <p className="empty-state">{q ? `Nothing matches "${q}".` : 'No use cases here yet.'}</p>
      ) : (
        <>
          <ol className="uc-list">
            {ranked.map(job => (
              <JobCard key={job.key} job={job} />
            ))}
          </ol>
          <p className="empty-state" id="uc-empty" hidden>
            Nothing matches that search.
          </p>
        </>
      )}

      <p className="uc-note">
        Ranked by upvotes, hands-on tests, how many assistants people report doing the job, and engagement on the posts; newer jobs get a small lift.
        Founder and vendor posts are left out. The scorecard, not this page, is the benchmark.
      </p>
    </div>
  );
}
