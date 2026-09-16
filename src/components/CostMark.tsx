import { COST_LABEL, costOf } from '@/lib/cost';

/** Free / Free tier / Paid / Waitlist under an assistant's name. Nothing when pricing is not stated. */
export function CostMark({ pricing }: { pricing: string | null | undefined }) {
  const k = costOf(pricing);
  if (!k) return null;
  return <span className={`cost cost-${k}`}>{COST_LABEL[k]}</span>;
}
