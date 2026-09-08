import Link from 'next/link';
import { ReactNode } from 'react';

interface ShelfProps {
  title: string;
  href?: string;
  sub?: string;
  id?: string;
  /** Stack rows vertically on phones instead of the horizontal 3-row carousel. */
  stack?: boolean;
  children: ReactNode;
}

export function Shelf({ title, href, sub, id, stack, children }: ShelfProps) {
  return (
    <section className="shelf" id={id}>
      <h2 className="shelf-title">
        {href ? (
          <Link href={href} className="shelf-head">
            {title}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 5l5 5-5 5" />
            </svg>
          </Link>
        ) : (
          <span className="shelf-head">{title}</span>
        )}
      </h2>
      {sub && <p className="shelf-sub">{sub}</p>}
      <div className={`shelf-grid${stack ? ' stack' : ''}`}>{children}</div>
    </section>
  );
}
