import type { Metadata } from 'next';
import { CommerceMethods } from '@/components/CommerceReport';
export const metadata: Metadata = { title:'Commerce report methods', alternates: { canonical: 'https://assistantbenchmark.com/reports/consumer-ai-commerce/methods' } };
export default function MethodsPage() { return <CommerceMethods standalone />; }
