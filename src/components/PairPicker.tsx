'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { comparePath } from '@/lib/compare-shared';

interface Option {
  slug: string;
  name: string;
}

/** Two pickers and a Go button. Only tested assistants are offered, since an untested side can never win a row. */
export function PairPicker({ options, initialA, initialB }: { options: Option[]; initialA?: string; initialB?: string }) {
  const router = useRouter();
  const [a, setA] = useState(initialA ?? options[0]?.slug ?? '');
  const [b, setB] = useState(initialB ?? options.find(o => o.slug !== (initialA ?? options[0]?.slug))?.slug ?? '');
  const ready = a && b && a !== b;

  const go = (e: FormEvent) => {
    e.preventDefault();
    if (ready) router.push(comparePath(a, b));
  };

  return (
    <form className="hh-pick" onSubmit={go}>
      <label className="hh-pick-side">
        <span className="hh-pick-label">Left</span>
        <select value={a} onChange={e => setA(e.target.value)}>
          {options.map(o => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <span className="hh-vs">vs</span>
      <label className="hh-pick-side">
        <span className="hh-pick-label">Right</span>
        <select value={b} onChange={e => setB(e.target.value)}>
          {options.map(o => (
            <option key={o.slug} value={o.slug}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn primary" disabled={!ready}>
        Compare
      </button>
    </form>
  );
}
