import type { Metadata } from 'next';
import data from '../../../data/market-map-timeline.json';
import { MarketMapTimeline } from '@/components/MarketMapTimeline';

export const metadata: Metadata = {
  title: 'The AI Agent Market Map',
  description: 'Explore the interactive map of AI agents and infrastructure by category and over time.',
};
export default function MarketMapPage() {
  return <MarketMapTimeline products={data.products} asOf={data.asOf} />;
}
