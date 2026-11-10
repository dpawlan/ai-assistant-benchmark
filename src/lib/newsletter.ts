import { cache } from 'react';
import { connection } from 'next/server';
import { cleanIssueHtml, parseIssues, isMondayMorning, type NewsletterIssue } from './newsletter-feed';
import snapshot from '../../data/newsletter-snapshot.json';

export const NEWSLETTER_URL = 'https://assistant-benchmark-newsletter.beehiiv.com';
export const FEED_URL = 'https://rss.beehiiv.com/feeds/IqCwhrLcdy.xml';
export const getNewsletterIssues = cache(async (): Promise<NewsletterIssue[]> => {
  await connection();
  let latest: NewsletterIssue[] = [];
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: isMondayMorning() ? 900 : false }, cache: 'force-cache', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Feed status ${response.status}`);
    latest = parseIssues(await response.text());
  } catch {
    console.warn('[newsletter] Live feed unavailable; using saved archive.');
  }
  // Keep older issues even if Beehiiv limits the feed window. Live versions take precedence.
  const archive = new Map<string, NewsletterIssue>((snapshot as NewsletterIssue[]).map(issue => [issue.slug, { ...issue, html: cleanIssueHtml(issue.html) }]));
  for (const issue of latest) archive.set(issue.slug, issue);
  return [...archive.values()].sort((a, b) => b.date.localeCompare(a.date));
});

export function issueDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' }).format(new Date(date));
}
