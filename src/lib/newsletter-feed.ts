import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';
export const NEWSLETTER_URL = 'https://assistant-benchmark-newsletter.beehiiv.com';
export type NewsletterIssue = { slug: string; title: string; description: string; url: string; date: string; author: string; html: string; minutes: number };

export function cleanIssueHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'], '*': ['id'] },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }),
    },
  });
}

export function parseIssues(xml: string): NewsletterIssue[] {
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid newsletter feed');
  const parsed = new XMLParser({ ignoreAttributes: false, processEntities: false }).parse(xml);
  const raw = parsed?.rss?.channel?.item;
  if (!raw) throw new Error('Newsletter feed contains no issues');
  const text = (value: unknown) => sanitizeHtml(typeof value === 'string' ? value : '', { allowedTags: [], allowedAttributes: {} }).replace(/&amp;/g, '&');
  const issues = (Array.isArray(raw) ? raw : [raw]).map((item): NewsletterIssue => {
    const url = new URL(item.link);
    if (url.protocol !== 'https:' || ![new URL(NEWSLETTER_URL).hostname, 'at-your-service.beehiiv.com'].includes(url.hostname)) throw new Error('Unexpected issue URL');
    const slug = url.pathname.split('/').filter(Boolean).pop()!;
    const html = cleanIssueHtml(String(item['content:encoded'] ?? ''));
    if (!html) throw new Error('Newsletter issue has no content');
    return { slug, title: text(item.title), description: text(item.description), url: url.href, date: new Date(item.pubDate).toISOString(), author: text(item['dc:creator']) || 'David Pawlan', html, minutes: Math.max(1, Math.ceil(text(html).split(/\s+/).length / 220)) };
  });
  return issues.sort((a, b) => b.date.localeCompare(a.date));
}

export function isMondayMorning(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const day = parts.find(p => p.type === 'weekday')?.value;
  const hour = Number(parts.find(p => p.type === 'hour')?.value);
  return day === 'Mon' && hour >= 6 && hour < 12;
}

