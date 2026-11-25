export interface MarketEvent {
  date: string;
  precision: string;
  kind: string;
  label: string;
  note: string;
  source: string;
  source_type: string;
  verified_on: string;
}
export interface TimelineProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  logo: string;
  events: MarketEvent[];
}
export function firstAppearance(product: TimelineProduct) {
  return product.events.find(e => ['launch', 'announcement', 'preview'].includes(e.kind))?.date;
}
export function statusAt(product: TimelineProduct, date: string) {
  const first = firstAppearance(product);
  if (!first || first > date) return 'not-yet';
  const events = product.events.filter(e => e.date <= date);
  if (events.some(e => e.kind === 'shutdown')) return 'closed';
  if (events.some(e => e.kind === 'partial_shutdown')) return 'partial';
  return 'present';
}
