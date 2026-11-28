export interface TimelineProduct {
  id: string;
  name: string;
  category: string;
  website: string;
  logo: string | null;
  mapped: boolean;
  first: string | null;
  closed: string | null;
  availability?: string;
}

export function monthIndex(date: string): number {
  const [year, month] = date.split('-').map(Number);
  return year * 12 + month - 1;
}

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function formatMonth(index: number): string {
  return monthFormatter.format(Date.UTC(Math.floor(index / 12), index % 12, 1));
}
