import { Metadata } from 'next';
import { ComparePage, compareMetadata } from '@/components/ComparePage';

interface Props {
  params: Promise<{ pair: string; focus: string }>;
}

/** /compare/a-vs-b/email_replies~purchasing: the same page with those dimensions highlighted. Rendered on demand. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair, focus } = await params;
  return compareMetadata(pair, focus);
}

export default async function Page({ params }: Props) {
  const { pair, focus } = await params;
  return <ComparePage pair={pair} focusRaw={focus} />;
}
