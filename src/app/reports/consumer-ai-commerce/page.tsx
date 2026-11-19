import type { Metadata } from 'next';
import { getIndexData } from '@/lib/data';
import { CommerceReport } from '@/components/CommerceReport';

export const metadata: Metadata = {
  title: 'AI Assistant Consumer Commerce Report',
  description: 'A 14% recorded order acceptance rate across 200 scored pairings: 25 AI assistants, eight shopping tasks. Here is what happened between the shopping request and the order confirmation.',
  robots: { index: false, follow: false },
};

export default function CommerceReportPage() {
  const icons = Object.fromEntries(getIndexData().agents.map(a => [a.slug, a.icon]));
  return <CommerceReport icons={{ sones: '/logos/sones.png', robyn: '/logos/robyn.png', ...Object.fromEntries(['hark', 'zapia', 'tomo', 'dazzle', 'grok-bot'].map(slug => [slug, slug === 'grok-bot' ? '/logos/grokbot-app.png' : icons[slug] ?? null])) }} />;
}
