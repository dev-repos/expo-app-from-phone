import { toDateKey } from '@/habits/habits-context';

// Steps back through local calendar days with setDate, so DST changes never skip or repeat a day.
function daysBefore(from: Date, count: number) {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  date.setDate(date.getDate() - count);
  return date;
}

// Days in a row the habit was done, ending today, or yesterday if today isn't ticked yet.
export function getStreak(doneDates: string[], now: Date = new Date()) {
  const done = new Set(doneDates);
  let offset = done.has(toDateKey(now)) ? 0 : 1;
  let streak = 0;
  while (done.has(toDateKey(daysBefore(now, offset)))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

export type DayStatus = {
  dateKey: string;
  // Single-letter weekday for the label under the dot, e.g. "M".
  label: string;
  done: boolean;
  isToday: boolean;
};

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// The last 7 days, oldest first, so today sits on the right.
export function getLastSevenDays(doneDates: string[], now: Date = new Date()): DayStatus[] {
  const done = new Set(doneDates);
  return Array.from({ length: 7 }, (_, i) => {
    const date = daysBefore(now, 6 - i);
    const dateKey = toDateKey(date);
    return {
      dateKey,
      label: WEEKDAY_LETTERS[date.getDay()],
      done: done.has(dateKey),
      isToday: i === 6,
    };
  });
}
