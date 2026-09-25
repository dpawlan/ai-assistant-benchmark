import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { toBlocks } from '@/lib/articles';

/** Inline markdown: **bold**, *em*, [text](href). */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<b key={k++}>{m[1]}</b>);
    else if (m[2]) parts.push(<em key={k++}>{m[2]}</em>);
    else if (m[3]) parts.push(m[4].startsWith('/') ? <Link key={k++} href={m[4]}>{m[3]}</Link> : <a key={k++} href={m[4]}>{m[3]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function Markdown({ body }: { body: string }) {
  return (
    <>
      {toBlocks(body).map((b, i) => (
        <Fragment key={i}>
          {b.type === 'h2' && <h2><Inline text={b.text} /></h2>}
          {b.type === 'h3' && <h3><Inline text={b.text} /></h3>}
          {b.type === 'p' && <p className={b.text.startsWith('PREVIEW ONLY') ? 'art-note' : undefined}><Inline text={b.text} /></p>}
          {b.type === 'quote' && <blockquote><Inline text={b.text} /></blockquote>}
          {b.type === 'ul' && <ul>{b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}</ul>}
        </Fragment>
      ))}
    </>
  );
}
