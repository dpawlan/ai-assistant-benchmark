import Link from 'next/link';
import type { Metadata } from 'next';
import { BenchmarkNav } from '@/components/BenchmarkNav';

export const metadata: Metadata = { title: 'Work benchmark · In development', robots: { index: false, follow: false } };

export default function WorkPage() {
  return <div className="wrap bs-wrap"><BenchmarkNav active="work" /><div className="bs-preview"><span className="bs-dot" /> Design preview <span>Work benchmark in development</span></div><header className="bs-work-hero"><p className="bs-eyebrow">THE WORK BENCHMARK</p><h1>Less busywork.<br />More work done.</h1><p>A dedicated benchmark for how assistants handle your working day. The scope below is proposed; tests, scoring anchors and a cohort have not been selected.</p><Link className="bs-text-link" href="/?kind=work">Explore work assistants on the General benchmark →</Link></header><div className="bs-work-grid">{[['Email & calendar', 'Handle the inbox, resolve conflicts and coordinate schedules.'], ['Research & documents', 'Find reliable answers and turn them into useful deliverables.'], ['Connected workflows', 'Carry a task across tools without losing the details.'], ['Follow-through', 'Track commitments, respect permissions and close the loop.']].map(([name, text], i) => <article key={name}><span className="bs-eyebrow">PROPOSED AREA 0{i + 1}</span><h2>{name}</h2><p>{text}</p><span className="bs-badge">Protocol not defined</span></article>)}</div><p className="bs-work-foot">General results remain available. Work-specific rankings will begin once a shared protocol and evidence are in place.</p></div>;
}
