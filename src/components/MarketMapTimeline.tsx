'use client';

import { useEffect, useState } from 'react';
import { monthIndex, formatMonth, type TimelineProduct } from '@/lib/market-map-timeline';
import styles from './MarketMapTimeline.module.css';

const ALL_CATEGORIES = 'All categories';
const COORDINATION_CATEGORIES = new Set(['Agent orchestration & collaboration', 'Agent marketplaces & autonomous businesses']);

export function MarketMapTimeline({ products, asOf }: { products: TimelineProduct[]; asOf: string }) {
  const currentMonth = monthIndex(asOf);
  const [month, setMonth] = useState(currentMonth);
  const [playing, setPlaying] = useState(false);
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [includePast, setIncludePast] = useState(false);

  const categories = Array.from(new Set(products.map(product => product.category)));
  const changeMonths = products.flatMap(product => [product.first, product.closed])
    .flatMap(date => date ? [monthIndex(date)] : [])
    .filter(date => date < currentMonth);
  const firstMonth = Math.min(currentMonth, ...changeMonths);
  const current = month === currentMonth;

  useEffect(() => {
    if (!playing || month >= currentMonth) return;

    const timer = window.setTimeout(() => {
      setMonth(previous => {
        const next = products.reduce((earliest, product) => {
          for (const date of [product.first, product.closed]) {
            if (!date) continue;
            const candidate = monthIndex(date);
            if (candidate > previous && candidate < earliest) earliest = candidate;
          }
          return earliest;
        }, currentMonth);
        return next;
      });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [currentMonth, month, playing, products]);

  const query = search.trim().toLowerCase();
  const visible = products.filter(product => {
    if (category !== ALL_CATEGORIES && product.category !== category) return false;
    if (!product.name.toLowerCase().includes(query)) return false;
    if (current) return includePast || product.mapped;
    if (!product.first || monthIndex(product.first) > month) return false;
    return includePast || !product.closed || monthIndex(product.closed) > month;
  });

  function changeMonth(value: number) {
    setPlaying(false);
    setMonth(value);
  }

  const isPlaying = playing && !current;

  return (
    <div className={styles.page}>
      <h1>The AI Agent Market Map</h1>

      <section className={styles.controls} aria-label="Timeline controls">
        <div className={styles.playback}>
          <button type="button" className={styles.play} onClick={() => {
            if (isPlaying) setPlaying(false);
            else {
              if (current) setMonth(firstMonth);
              setPlaying(true);
            }
          }}>{isPlaying ? 'Pause' : 'Play'}</button>
          <strong>{current ? 'Current map' : formatMonth(month)}</strong>
          {!current && <button type="button" className={styles.today} onClick={() => changeMonth(currentMonth)}>Back to current</button>}
        </div>
        <div className={styles.range}>
          <input
            aria-label="Market map month"
            aria-valuetext={current ? 'Current map' : formatMonth(month)}
            type="range"
            min={firstMonth}
            max={currentMonth}
            value={month}
            onChange={event => changeMonth(Number(event.currentTarget.value))}
          />
          <div className={styles.rangeLabels}><span>{formatMonth(firstMonth)}</span><span>{formatMonth(currentMonth)}</span></div>
        </div>
      </section>

      <div className={styles.toolbar}>
        <input type="search" aria-label="Find a product" placeholder="Find a product" value={search} onChange={event => setSearch(event.currentTarget.value)} />
        <select aria-label="Filter by category" value={category} onChange={event => setCategory(event.currentTarget.value)}>
          <option>{ALL_CATEGORIES}</option>
          {categories.map(name => <option key={name}>{name}</option>)}
        </select>
        <label className={styles.historical}>
          <input type="checkbox" checked={includePast} onChange={event => setIncludePast(event.currentTarget.checked)} />
          Include past products
        </label>
        <span className={styles.count}>{visible.length} {visible.length === 1 ? 'product' : 'products'}</span>
      </div>

      <div className={styles.map} aria-label="Market map products">
        {categories.map(name => {
          const members = visible.filter(product => product.category === name);
          if (!members.length) return null;

          const largeCategory = products.filter(product => product.category === name).length > 20;
          const columns = largeCategory ? styles.wide : COORDINATION_CATEGORIES.has(name) ? styles.half : '';
          return (
            <section key={name} aria-label={name} className={`${styles.group} ${columns}`}>
              <h2>{name}<span>{members.length}</span></h2>
              <div className={styles.logos}>
                {members.map(product => (
                  <a key={product.id} className={styles.product} href={product.website} target="_blank" rel="noreferrer">
                    {product.logo ? <img src={product.logo} width="52" height="52" alt="" loading="lazy" /> : <span className={styles.initial} aria-hidden="true">{product.name.charAt(0)}</span>}
                    <span>{product.name}</span>
                    {current && product.availability && <small className={styles.availability}>{product.availability}</small>}
                  </a>
                ))}
              </div>
            </section>
          );
        })}
        {!visible.length && <p className={styles.empty}>No products match this view.</p>}
      </div>
    </div>
  );
}
