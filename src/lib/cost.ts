/** Cost buckets and funding copy. Pure helpers, safe to import from client components. */
import type { Funding } from './types';

export type CostKey = 'free' | 'free_tier' | 'paid' | 'waitlist';

export const COST_KEYS: CostKey[] = ['free', 'free_tier', 'paid', 'waitlist'];

export const COST_LABEL: Record<CostKey, string> = {
  free: 'Free',
  free_tier: 'Free tier',
  paid: 'Paid',
  waitlist: 'Waitlist',
};

/** Collapses the eight stored pricing values into what a reader decides on. Unknown stays unlabeled. */
export function costOf(pricing: string | null | undefined): CostKey | null {
  switch (pricing) {
    case 'free':
    case 'open-source':
      return 'free';
    case 'freemium':
      return 'free_tier';
    case 'paid':
    case 'credits':
    case 'per-order':
      return 'paid';
    case 'waitlist':
      return 'waitlist';
    default:
      return null;
  }
}

export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${+(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${n}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthYear(ym: string | null): string | null {
  const m = ym?.match(/^(\d{4})-(\d{2})/);
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : null;
}

/** Short headline for chips and head to head: "Raised $25M", "Part of Meta", "Acquired by Cognition". Null when nothing is public. */
export function fundingChip(f: Funding | null | undefined): string | null {
  if (!f) return null;
  if (f.acquired_by) return `Acquired by ${f.acquired_by}`;
  if (f.status === 'open_source') return 'Open source project';
  if (f.parent) return `Part of ${f.parent}`;
  if (typeof f.total_usd === 'number') return `Raised ${formatUsd(f.total_usd)}`;
  if (f.status === 'bootstrapped') return 'Bootstrapped';
  return null;
}

/** Profile row value. */
export function fundingSummary(f: Funding | null | undefined): string {
  if (!f) return 'Not researched';
  const parts: string[] = [];
  if (typeof f.total_usd === 'number') parts.push(`Raised ${formatUsd(f.total_usd)}`);
  if (f.acquired_by) parts.push(`acquired by ${f.acquired_by}`);
  else if (f.status === 'open_source') parts.push(parts.length ? 'open source' : 'Open source project');
  else if (f.parent) parts.push(`Part of ${f.parent}`);
  else if (f.status === 'bootstrapped') parts.push('Bootstrapped');
  if (!parts.length) return f.investors.length ? 'Backed, amount not disclosed' : 'Not disclosed';
  const s = parts.join(', ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function fundingRounds(f: Funding | null | undefined): string | null {
  if (!f?.rounds.length) return null;
  return f.rounds
    .map(r => [r.type, typeof r.amount_usd === 'number' ? formatUsd(r.amount_usd) : null, monthYear(r.date)].filter(Boolean).join(' '))
    .join(' · ');
}

export function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
