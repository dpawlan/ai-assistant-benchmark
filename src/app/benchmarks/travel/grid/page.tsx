import type { Metadata } from 'next';
import { TravelBenchmark } from '@/components/TravelBenchmark';
import { getAgents } from '@/lib/data';
import { TRAVEL_PILOT, TRAVEL_NEXT } from '@/lib/travel-suite';

export const metadata: Metadata = { title: 'Travel scorecard grid · Design preview', robots: { index: false, follow: false } };

export default function TravelGridPage() {
  const cohort = [...TRAVEL_PILOT, ...TRAVEL_NEXT];
  const agents = getAgents().filter(a => cohort.includes(a.slug) || a.travel.completed > 0).map(({ slug, name, icon, kind, travel, opinion, usage }) => ({ slug, name, icon, kind, travel, travelOpinion: opinion.travel, usage }));
  return <div className="wrap mid"><TravelBenchmark agents={agents} grid /></div>;
}
