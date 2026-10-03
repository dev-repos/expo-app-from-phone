import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitRow } from '@/components/habit-row';
import { toDateKey, useHabits, type Habit } from '@/habits/habits-context';
import { getLastSevenDays, getStreak } from '@/habits/streaks';
import { useNow } from '@/habits/use-now';
import { useAppColors } from '@/theme/colors';
import { confirmDestructive } from '@/utils/confirm';

// Haptics are a native nicety; on web they'd fall back to the vibration API, which we skip.
function tap(style: Haptics.ImpactFeedbackStyle) {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style).catch(() => {});
}

export default function HomeScreen() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { habits, loaded, toggleDone, removeHabit } = useHabits();
  const now = useNow();
  const today = toDateKey(now);

  const toggle = (habit: Habit, done: boolean) => {
    if (!done) tap(Haptics.ImpactFeedbackStyle.Light);
    toggleDone(habit.id, today);
  };

  const askToDelete = (habit: Habit) => {
    tap(Haptics.ImpactFeedbackStyle.Medium);
    confirmDestructive({
      title: `Delete "${habit.name}"?`,
      message: 'Its streak and history will be removed. This can’t be undone.',
      confirmText: 'Delete',
      onConfirm: () => removeHabit(habit.id),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!loaded ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet</Text>
          <Text style={[styles.emptyHint, { color: colors.muted }]}>
            Small steps add up. Tap “Add habit” to start your first one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <Text style={[styles.tip, { color: colors.muted }]}>
              Tap to tick off today · Long-press to delete
            </Text>
          }
          renderItem={({ item }) => {
            const done = item.doneDates.includes(today);
            return (
              <HabitRow
                habit={item}
                done={done}
                streak={getStreak(item.doneDates, now)}
                week={getLastSevenDays(item.doneDates, now)}
                onToggle={() => toggle(item, done)}
                onDelete={() => askToDelete(item)}
              />
            );
          }}
        />
      )}

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/add-habit')}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Add habit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  emoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 280,
  },
  list: {
    gap: 12,
    padding: 24,
  },
  tip: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  addButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
