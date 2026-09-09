/** Peer groups for the scorecard. Order is display order. */
export const KINDS = [
  { key: 'general', label: 'General', plural: 'general assistants' },
  { key: 'travel', label: 'Travel', plural: 'travel assistants' },
  { key: 'email', label: 'Email', plural: 'email assistants' },
  { key: 'finance', label: 'Finance', plural: 'finance assistants' },
  { key: 'shopping', label: 'Shopping', plural: 'shopping assistants' },
  { key: 'games', label: 'Games', plural: 'game makers' },
  { key: 'work', label: 'Work & teams', plural: 'team and agent-builder products' },
  { key: 'infra', label: 'Infra & hardware', plural: 'infrastructure and hardware products' },
] as const;

export type Kind = (typeof KINDS)[number]['key'];

export const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map(k => [k.key, k.label]));

export function isKind(v: string | null | undefined): v is Kind {
  return !!v && KINDS.some(k => k.key === v);
}
