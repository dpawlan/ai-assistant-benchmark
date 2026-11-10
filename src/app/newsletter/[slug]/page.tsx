import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsletterIssues, issueDate } from '@/lib/newsletter';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import '../newsletter.css';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = (await getNewsletterIssues()).find(i => i.slug === slug);
  if (!issue) return { title: 'Issue not found' };
  return { title: issue.title, description: issue.description, alternates: { canonical: issue.url }, openGraph: { images: ['/newsletter/weekly.png'] }, twitter: { card: 'summary_large_image', images: ['/newsletter/weekly.png'] } };
}
export default async function IssuePage({ params }: Props) {
  const { slug } = await params;
  const issues = await getNewsletterIssues();
  const index = issues.findIndex(i => i.slug === slug);
  if (index < 0) notFound();
  const issue = issues[index];
  return <div className="nl-reader">
    <nav className="nl-breadcrumb" aria-label="Breadcrumb"><Link href="/newsletter">Newsletter</Link><span aria-hidden="true">/</span><span>{issueDate(issue.date)}</span></nav>
    <header className="nl-article-head"><Image src="/newsletter/icon.png" alt="Assistant Benchmark newsletter" width={48} height={48} /><p className="nl-eyebrow">{issueDate(issue.date)} · {issue.minutes} MIN READ</p><h1>{issue.title}</h1><p>{issue.description}</p><span>By {issue.author}</span></header>
    <article className="nl-article" dangerouslySetInnerHTML={{ __html: issue.html }} />
    <p className="nl-source"><a href={issue.url} target="_blank" rel="noopener noreferrer">View original issue on Beehiiv ↗</a></p>
    <section className="nl-reader-signup"><h2>Get the next issue in your inbox.</h2><p>The AI Assistant Newsletter from Assistant Benchmark.</p><NewsletterSignup /></section>
    <nav className="nl-pagination" aria-label="More issues">{issues[index + 1] ? <Link href={`/newsletter/${issues[index + 1].slug}`}>← Previous issue</Link> : <span />}{issues[index - 1] ? <Link href={`/newsletter/${issues[index - 1].slug}`}>Next issue →</Link> : <Link href="/newsletter">All issues →</Link>}</nav>
  </div>;
}
