import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

export const HABIT_COLORS = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#14B8A6',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
] as const;

export type Habit = {
  id: string;
  name: string;
  color: string;
  // Local calendar days the habit was done, as YYYY-MM-DD.
  doneDates: string[];
};

type HabitsContextValue = {
  habits: Habit[];
  loaded: boolean;
  addHabit: (name: string, color: string) => void;
  toggleDone: (id: string, date: string) => void;
};

const STORAGE_KEY = 'habits:v1';

const HabitsContext = createContext<HabitsContextValue | null>(null);

// Uses the device's local date so "today" flips at the user's midnight, not UTC's.
export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseStoredHabits(raw: string | null): Habit[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Habit => typeof item?.id === 'string' && typeof item?.name === 'string')
      .map((item) => ({
        id: item.id,
        name: item.name,
        color: typeof item.color === 'string' ? item.color : HABIT_COLORS[0],
        doneDates: Array.isArray(item.doneDates)
          ? item.doneDates.filter((d): d is string => typeof d === 'string')
          : [],
      }));
  } catch {
    return [];
  }
}

// Habits and their done days are saved on the device with AsyncStorage.
export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled) setHabits(parseStoredHabits(raw));
      })
      .catch((error) => console.warn('Failed to load habits', error))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only save after the first load, so the empty initial state never overwrites saved data.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits)).catch((error) =>
      console.warn('Failed to save habits', error)
    );
  }, [habits, loaded]);

  const addHabit = (name: string, color: string) => {
    const habit: Habit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      color,
      doneDates: [],
    };
    setHabits((current) => [...current, habit]);
  };

  const toggleDone = (id: string, date: string) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;
        const done = habit.doneDates.includes(date);
        return {
          ...habit,
          doneDates: done ? habit.doneDates.filter((d) => d !== date) : [...habit.doneDates, date],
        };
      })
    );
  };

  return (
    <HabitsContext value={{ habits, loaded, addHabit, toggleDone }}>{children}</HabitsContext>
  );
}

export function useHabits() {
  const value = use(HabitsContext);
  if (!value) {
    throw new Error('useHabits must be used inside a HabitsProvider');
  }
  return value;
}
