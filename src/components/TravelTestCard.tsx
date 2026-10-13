import Link from 'next/link';
import { getReport } from '@/lib/reports';

export function TravelTestCard() {
  const report = getReport('consumer-ai-travel');
  if (!report) return null;
  return <section className="shelf travel-test-card">
    <p className="cat-kicker">Consumer report · Travel</p>
    <h2 className="ag-h2"><Link href="/reports/consumer-ai-travel">{report.title} →</Link></h2>
    <p className="ag-sub">{report.excerpt}</p>
  </section>;
}
