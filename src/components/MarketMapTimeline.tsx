'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { firstAppearance, statusAt, type TimelineProduct } from '@/lib/market-map-timeline';
import s from './MarketMapTimeline.module.css';

const DAY = 86400000;
const timestamp = (date: string) => Date.parse(`${date}T00:00:00Z`);
const iso = (time: number) => new Date(time).toISOString().slice(0, 10);
const format = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));

export function MarketMapTimeline({ products, asOf, researchTotal }: { products: TimelineProduct[]; asOf: string; researchTotal: number }) {
  const start = products.map(firstAppearance).filter((x): x is string => !!x).sort()[0];
  const min = timestamp(start), max = timestamp(asOf);
  const [date, setDate] = useState(asOf);
  const [playing, setPlaying] = useState(false);
  const [category, setCategory] = useState('All categories');
  const [showClosed, setShowClosed] = useState(false);
  const [selected, setSelected] = useState<TimelineProduct | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const categories = [...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => category === 'All categories' || p.category === category);
  const visible = filtered.filter(p => {
    const status = statusAt(p, date);
    return status !== 'not-yet' && (showClosed || status !== 'closed');
  });
  const closed = filtered.filter(p => statusAt(p, date) === 'closed');
  const recent = filtered.flatMap(p => p.events.filter(e => e.date <= date).map(e => ({ ...e, product: p }))).sort((a, b) => b.date.localeCompare(a.date));
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setDate(current => {
        const next = new Date(`${current}T00:00:00Z`);
        next.setUTCMonth(next.getUTCMonth() + 1);
        const nextEvent = products.flatMap(p => p.events.map(e => e.date)).filter(d => d > current).sort()[0];
        return iso(Math.min(next.getTime(), nextEvent ? timestamp(nextEvent) : max, max));
      });
    }, 650);
    return () => window.clearInterval(timer);
  }, [playing, max, products]);
  useEffect(() => { if (date === asOf) setPlaying(false); }, [date, asOf]);
  function changeDate(value: string) {
    if (!value || value < start || value > asOf) return;
    setPlaying(false); setDate(value);
  }
  function inspect(product: TimelineProduct) {
    setPlaying(false); setSelected(product); dialog.current?.showModal();
  }
  return <div className={s.page}>
    <header className={s.heading}>
      <div><p className={s.preview}>Interactive preview</p><h1>The AI Agent Market Map</h1><p className={s.intro}>Watch products arrive, evolve, and leave the market.</p></div>
      <Link className={s.articleLink} href="/articles/the-ai-agent-market-map">Read the full market map</Link>
    </header>
    <div className={s.research}><strong>{products.length} products in this preview</strong><span>Research covers {researchTotal} products. Only sourced events appear here.</span></div>
    <section className={s.controls} aria-label="Timeline controls">
      <div className={s.controlTop}>
        <div><label htmlFor="map-date">Market as of</label><input id="map-date" type="date" min={start} max={asOf} value={date} onChange={e => changeDate(e.target.value)} /></div>
        <div className={s.playback}><button onClick={() => { setDate(start); setPlaying(false); }} aria-label="Return to beginning">Reset</button><button className={s.play} onClick={() => { if (!playing && date === asOf) setDate(start); setPlaying(!playing); }}>{playing ? 'Pause' : 'Play timeline'}</button></div>
      </div>
      <input aria-label="Timeline date" type="range" min={min} max={max} step={DAY} value={timestamp(date)} onChange={e => changeDate(iso(Number(e.target.value)))} className={s.slider} />
      <div className={s.years}><span>{format(start)}</span>{['2025-01-01', '2026-01-01'].map(d => <span key={d} style={{ position: 'absolute', left: `${(timestamp(d)-min)/(max-min)*100}%`, transform: 'translateX(-50%)' }}>{d.slice(0,4)}</span>)}<span>{format(asOf)}</span></div>
    </section>
    <div className={s.toolbar}>
      <label>Category <select value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
      <label className={s.check}><input type="checkbox" checked={showClosed} onChange={e => setShowClosed(e.target.checked)} />Show closed products ({closed.length})</label>
      <span>{visible.length} shown in this sample</span>
    </div>
    <div className={s.content}>
      <section className={s.map} aria-label="Products at selected date">
        {categories.filter(c => category === 'All categories' || c === category).map(c => {
          const members = visible.filter(p => p.category === c);
          return <section key={c} className={s.group}><h2>{c}<span>{members.length}</span></h2><div className={s.logos}>
            {members.map(p => <button key={p.id} onClick={() => inspect(p)} className={`${s.product} ${statusAt(p,date) === 'closed' ? s.closed : ''}`} aria-label={`View ${p.name} history`}><img src={p.logo} width="64" height="64" alt="" /><span>{p.name}</span>{statusAt(p,date) === 'partial' && <small>Hosted shutdown</small>}{statusAt(p,date) === 'closed' && <small>Closed</small>}</button>)}
            {!members.length && <p className={s.empty}>No dated products in this sample yet.</p>}
          </div></section>;
        })}
      </section>
      <aside className={s.history}><h2>Latest events</h2><p>Up to {format(date)}</p><ol>{recent.slice(0, 7).map(e => <li key={`${e.product.id}-${e.date}-${e.kind}`}><time dateTime={e.date}>{format(e.date)}</time><button onClick={() => inspect(e.product)}>{e.product.name}</button><span className={e.kind.includes('shutdown') ? s.red : ''}>{e.label}</span></li>)}</ol>{recent.length === 0 && <p>No events yet.</p>}</aside>
    </div>
    <section className={s.note} aria-label="How dates work"><strong>How dates work</strong><p>Products enter on a documented launch or public announcement. Waitlists and previews are identified in their histories. A full shutdown removes a product; a partial shutdown stays visible with a label. These dates do not represent when we added products to our map. Logos show current branding and remain the same size.</p><p>This sample is incomplete and cannot measure total market size. Earlier availability and additional events are still being researched.</p></section>
    <dialog ref={dialog} className={s.dialog} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      {selected && <><button className={s.close} onClick={() => dialog.current?.close()} aria-label="Close product history">Close</button><img src={selected.logo} width="64" height="64" alt="" /><h2>{selected.name}</h2><p>{selected.description}</p><a href={selected.website} target="_blank" rel="noopener noreferrer">Visit {selected.name}</a><h3>Documented history</h3><ol>{selected.events.map(e => <li key={`${e.date}-${e.kind}`}><time dateTime={e.date}>{format(e.date)}</time><strong>{e.label}</strong><p>{e.note}</p><a href={e.source} target="_blank" rel="noopener noreferrer">Read the source</a>{e.date > date && <small>After the selected date</small>}</li>)}</ol></>}
    </dialog>
  </div>;
}
