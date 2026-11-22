import type { Metadata } from 'next';
import { getIndexData } from '@/lib/data';
import { CommerceReport } from '@/components/CommerceReport';

export const metadata: Metadata = {
  title: 'AI Assistant Consumer Commerce Report',
  description: 'A 14% recorded order acceptance rate across 200 scored pairings: 25 AI assistants, eight shopping tasks. Here is what happened between the shopping request and the order confirmation.',
  alternates: { canonical: 'https://assistantbenchmark.com/reports/consumer-ai-commerce' },
  openGraph: {
    title: 'Would you let AI do your shopping?',
    description: '25 AI assistants. 200 shopping attempts. Only 14% ended in an accepted order.',
    url: 'https://assistantbenchmark.com/reports/consumer-ai-commerce',
    type: 'article',
    images: [{ url: 'https://assistantbenchmark.com/images/commerce/commerce-og.png', width: 1732, height: 908, alt: 'Would you let AI do your shopping? 14% of attempts ended in an accepted order: 28 out of 200.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Would you let AI do your shopping?',
    description: '25 AI assistants. 200 shopping attempts. Only 14% ended in an accepted order.',
    images: ['https://assistantbenchmark.com/images/commerce/commerce-og.png'],
  },
};

export default function CommerceReportPage() {
  const icons = Object.fromEntries(getIndexData().agents.map(a => [a.slug, a.icon]));
  return <CommerceReport icons={{ sones: '/logos/sones.png', robyn: '/logos/robyn.png', ...Object.fromEntries(['hark', 'zapia', 'tomo', 'dazzle', 'grok-bot'].map(slug => [slug, slug === 'grok-bot' ? '/logos/grokbot-app.png' : icons[slug] ?? null])) }} />;
}
