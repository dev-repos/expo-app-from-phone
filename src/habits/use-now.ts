import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { toDateKey } from '@/habits/habits-context';

// The current moment, refreshed at local midnight and whenever the app comes back to the
// foreground, so "today" doesn't go stale if the app is left open overnight.
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  const dateKey = toDateKey(now);

  useEffect(() => {
    const refresh = () => setNow(new Date());

    // Fires just after the next local midnight; re-armed each time the day changes.
    const current = new Date();
    const midnight = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    const timer = setTimeout(refresh, midnight.getTime() - current.getTime() + 1000);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && toDateKey(new Date()) !== dateKey) refresh();
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [dateKey]);

  return now;
}
