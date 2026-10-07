import Link from 'next/link';
import type { Metadata } from 'next';
import { TravelTestReport } from '@/components/TravelTestReport';
import { getAgents } from '@/lib/data';

export const metadata: Metadata = { title: 'NYC to Chicago · Travel test preview', robots: { index: false, follow: false } };
export default async function TravelTestPage({ searchParams }: { searchParams: Promise<{ dimension?: string; assistant?: string }> }) {
  const { dimension, assistant } = await searchParams;
  const slugs = ['grok-bot', 'instinct', 'miso', 'muse', 'soar'];
  const agents = getAgents().filter(a => slugs.includes(a.slug)).map(({ slug, name, icon, usage }) => ({ slug, name, icon, usage }));
  return <div className="wrap mid">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel/grid">← Travel benchmark</Link></div>
    <div className="page-head"><p className="cat-kicker">Travel · Test report preview · October 6, 2026</p><h1 className="page-title">Which AI assistant can actually book your flight?</h1><p className="page-sub">Five assistants, the same opening request, and a Friday-night flight from New York to Chicago.</p></div>
    <TravelTestReport agents={agents} initialDimension={Number(dimension) || 5} selectedAgent={assistant} />
  </div>;
}
