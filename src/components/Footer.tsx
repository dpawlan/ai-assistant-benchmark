import Link from 'next/link';
import { formatDate } from '@/lib/data';
import { IndexData } from '@/lib/types';

export function Footer({ index }: { index: IndexData }) {
  return (
    <footer>
      <div className="hr" />
      <p>
        {index.agent_count} assistants · {index.feedback_count} public quotes · updated {formatDate(index.updated)}
      </p>
      <p className="links">
        <Link href="/dimensions">Dimensions</Link> · <Link href="/request">Request a test</Link>
      </p>
    </footer>
  );
}
