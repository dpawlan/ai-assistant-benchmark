import type { Metadata } from 'next';
import { CommerceMethods } from '@/components/CommerceReport';
export const metadata: Metadata = { title:'Commerce report methods', robots:{index:false,follow:false} };
export default function MethodsPage() { return <CommerceMethods standalone />; }
