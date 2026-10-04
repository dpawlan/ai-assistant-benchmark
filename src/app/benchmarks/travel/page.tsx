import type { Metadata } from 'next';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import { TravelBenchmark } from '@/components/TravelBenchmark';
import { getAgents } from '@/lib/data';
import { TRAVEL_PILOT, TRAVEL_NEXT } from '@/lib/travel-suite';

export const metadata: Metadata = { title: 'Travel benchmark · Design preview', robots: { index: false, follow: false } };

export default function TravelPage() {
  const cohort = [...TRAVEL_PILOT, ...TRAVEL_NEXT];
  const agents = getAgents().filter(a => cohort.includes(a.slug)).map(({ slug, name, icon, kind }) => ({ slug, name, icon, kind }));
  return <div className="wrap bs-wrap"><BenchmarkNav active="travel" /><TravelBenchmark agents={agents} /></div>;
}
