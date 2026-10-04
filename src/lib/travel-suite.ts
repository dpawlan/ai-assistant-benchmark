/** Proposed cohorts and protocol structure. These are not scored runs. */
export const TRAVEL_PILOT = ['soar', 'muse', 'instinct', 'grok-bot', 'dots'];
export const TRAVEL_NEXT = ['miso', 'odessia', 'town', 'pally', 'ollie'];
export const TRAVEL_STAGES = [
  { key: 'plan', label: 'Plan & shop', short: 'Planning', description: 'Find the right trip, at the real price.' },
  { key: 'booking', label: 'Booking', short: 'Booking', description: 'From a recommendation to a ticket in your name.' },
  { key: 'changes', label: 'Changes & refunds', short: 'Changes', description: 'Change plans and get your money back.' },
  { key: 'extras', label: 'Special requests', short: 'Requests', description: 'Handle the details that make a trip yours.' },
  { key: 'before', label: 'Before the trip', short: 'Pre-trip', description: 'Documents, check-in and a boarding pass in hand.' },
  { key: 'disruptions', label: 'Disruptions', short: 'Disruptions', description: 'Recover when the trip does not go to plan.' },
] as const;

export type TravelAgent = { slug: string; name: string; icon: string | null; kind: string };
