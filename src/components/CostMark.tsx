import { COST_LABEL, costOf } from '@/lib/cost';

/** Free / Free tier / Paid / Waitlist under an assistant's name: a text label, or a small icon under review. */
export function CostMark({ pricing, mode = 'label' }: { pricing: string | null | undefined; mode?: 'label' | 'icon' }) {
  const k = costOf(pricing);
  if (!k) return null;
  if (mode === 'label') return <span className={`cost cost-${k}`}>{COST_LABEL[k]}</span>;
  return (
    <span className={`cost-ic cost-${k}`} title={COST_LABEL[k]} aria-label={COST_LABEL[k]} role="img">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        {k === 'free' && (
          <>
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <path d="M4.8 8.2l2.1 2.1 4.3-4.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {k === 'free_tier' && (
          <>
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 1.8a6.2 6.2 0 0 1 0 12.4z" fill="currentColor" />
          </>
        )}
        {k === 'paid' && (
          <>
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <text x="8" y="11.6" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="-apple-system, Helvetica, Arial, sans-serif">$</text>
          </>
        )}
        {k === 'waitlist' && (
          <>
            <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}
