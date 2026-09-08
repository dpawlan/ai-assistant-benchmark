import { Metadata } from 'next';
import { ComparePage, compareMetadata } from '@/components/ComparePage';
import { getComparablePairs, pairSlug } from '@/lib/compare';

interface Props {
  params: Promise<{ pair: string }>;
}

/** Pairs where both sides have runs are built ahead of time; any other pair renders on first request. */
export function generateStaticParams() {
  return getComparablePairs().map(([a, b]) => ({ pair: pairSlug(a, b) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  return compareMetadata(pair);
}

export default async function Page({ params }: Props) {
  const { pair } = await params;
  return <ComparePage pair={pair} />;
}
