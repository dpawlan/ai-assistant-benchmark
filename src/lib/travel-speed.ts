/** Provisional fixed thresholds for completed booking attempts, in minutes. */
export const BOOKING_SPEED_BANDS = [
  { maxMinutes: 5, score: 10 },
  { maxMinutes: 10, score: 9 },
  { maxMinutes: 15, score: 8 },
  { maxMinutes: 20, score: 7 },
  { maxMinutes: 30, score: 6 },
  { maxMinutes: 45, score: 5 },
  { maxMinutes: 60, score: 4 },
  { maxMinutes: 90, score: 3 },
  { maxMinutes: 120, score: 2 },
];

export function bookingSpeedScore(minutes: number | null, status: string): number | null {
  if (status !== 'completed' || minutes === null || !Number.isFinite(minutes) || minutes <= 0) return null;
  return BOOKING_SPEED_BANDS.find(band => minutes <= band.maxMinutes)?.score ?? 1;
}
