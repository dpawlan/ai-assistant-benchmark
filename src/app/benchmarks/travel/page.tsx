import type { Metadata } from 'next';
import { TravelBenchmark } from '@/components/TravelBenchmark';
import { getAgents } from '@/lib/data';
import { TRAVEL_PILOT, TRAVEL_NEXT } from '@/lib/travel-suite';

export const metadata: Metadata = { title: 'Travel benchmark · Design preview', robots: { index: false, follow: false } };

export default function TravelPage() {
  const cohort = [...TRAVEL_PILOT, ...TRAVEL_NEXT];
  const agents = getAgents().filter(a => cohort.includes(a.slug) || a.travel.completed > 0).map(({ slug, name, icon, kind, travel, opinion }) => ({ slug, name, icon, kind, travel, travelOpinion: opinion.travel }));
  return <div className="wrap mid"><TravelBenchmark agents={agents} /></div>;
}
