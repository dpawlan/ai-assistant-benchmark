import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { getNewsletterIssues, issueDate } from '@/lib/newsletter';
import './newsletter.css';

export const metadata: Metadata = {
  title: 'The AI Assistant Newsletter',
  description: 'New agents, real-world tests, and the changes worth your attention. Read the Assistant Benchmark newsletter and explore every issue.',
  openGraph: { title: 'The AI Assistant Newsletter', images: [{ url: '/newsletter/default.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/newsletter/default.png'] },
};

export default function NewsletterPage() {
  return <div className="nl-page">
    <section className="nl-hero">
      <div className="nl-pitch">
        <div className="nl-identity"><Image src="/newsletter/icon.png" alt="" width={48} height={48} /><span>THE ASSISTANT BENCHMARK NEWSLETTER</span></div>
        <h1>Keep up with AI agents and the agentic economy.</h1>
        <p className="nl-cadence">In your inbox every Monday morning.</p>
        <NewsletterSignup />
      </div>
      <Suspense fallback={null}><LatestIssue /></Suspense>
    </section>
    <Suspense fallback={null}><IssueArchive /></Suspense>
  </div>;
}

async function LatestIssue() {
  const latest = (await getNewsletterIssues())[0];
  return latest ? <Link className="nl-feature" href={`/newsletter/${latest.slug}`}>
        <div className="nl-cover"><Image src="/newsletter/weekly.png" alt="Last Week in AI Agents — Assistant Benchmark" width={1200} height={630} priority /></div>
        <div className="nl-feature-copy"><p className="nl-eyebrow">LATEST ISSUE · {issueDate(latest.date)}</p><h2>{latest.title}</h2><span className="nl-read">Read the issue <span aria-hidden="true">↗</span></span></div>
      </Link> : null;
}

async function IssueArchive() {
  const issues = await getNewsletterIssues();
  return <section className="nl-archive" id="issues"><div className="nl-archive-head"><div><p className="nl-eyebrow">THE ARCHIVE</p><h2>Every issue. Right here.</h2></div></div>
      <div className="nl-issue-list">{issues.map(issue => <Link href={`/newsletter/${issue.slug}`} className="nl-issue-row" key={issue.slug}><div><p className="nl-eyebrow">{issueDate(issue.date)} · {issue.minutes} MIN READ</p><h3>{issue.title}</h3></div><span className="nl-row-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </section>;
}
