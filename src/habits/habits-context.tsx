import { createContext, use, useState, type ReactNode } from 'react';

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
};

type HabitsContextValue = {
  habits: Habit[];
  addHabit: (name: string, color: string) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

// In-memory only for now: habits reset when the app reloads.
export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  const addHabit = (name: string, color: string) => {
    const habit: Habit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      color,
    };
    setHabits((current) => [...current, habit]);
  };

  return <HabitsContext value={{ habits, addHabit }}>{children}</HabitsContext>;
}

export function useHabits() {
  const value = use(HabitsContext);
  if (!value) {
    throw new Error('useHabits must be used inside a HabitsProvider');
  }
  return value;
}
