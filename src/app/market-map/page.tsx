import type { Metadata } from 'next';
import data from '../../../data/market-map-timeline.json';
import { MarketMapTimeline } from '@/components/MarketMapTimeline';

export const metadata: Metadata = {
  title: 'AI Agent Market Map · Timeline preview',
  description: 'Explore sourced AI product announcements, launches and shutdowns over time.',
  robots: { index: false, follow: false },
};
export default function MarketMapPage() {
  return <MarketMapTimeline products={data.products} asOf={data.asOf} researchTotal={data.researchTotal} />;
}
