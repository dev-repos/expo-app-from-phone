import { router, useTheme } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { toDateKey, useHabits } from '@/habits/habits-context';
import { getLastSevenDays, getStreak } from '@/habits/streaks';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { habits, loaded, toggleDone } = useHabits();
  const now = new Date();
  const today = toDateKey(now);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!loaded ? (
        <View style={styles.emptyState}>
          <ActivityIndicator />
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet</Text>
          <Text style={[styles.emptyHint, { color: colors.text }]}>
            Small steps add up. Your habits will show up here once you add one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const done = item.doneDates.includes(today);
            const streak = getStreak(item.doneDates, now);
            const week = getLastSevenDays(item.doneDates, now);
            const streakText = streak === 1 ? '1 day' : `${streak} days`;
            return (
              <Pressable
                role="checkbox"
                aria-checked={done}
                aria-label={`${item.name}, streak ${streakText}`}
                accessibilityHint={done ? 'Marks as not done today' : 'Marks as done today'}
                onPress={() => toggleDone(item.id, today)}
                style={({ pressed }) => [
                  styles.habitRow,
                  done
                    ? { backgroundColor: item.color, borderColor: item.color }
                    : { backgroundColor: colors.card, borderColor: colors.border },
                  { opacity: pressed ? 0.8 : 1 },
                ]}>
                <View style={styles.habitTop}>
                  <View
                    style={[
                      styles.checkCircle,
                      done
                        ? { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' }
                        : { borderColor: item.color },
                    ]}>
                    {done && <Text style={[styles.checkMark, { color: item.color }]}>✓</Text>}
                  </View>
                  <Text
                    style={[styles.habitName, { color: done ? '#FFFFFF' : colors.text }]}
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.streakLabel,
                      { color: done ? '#FFFFFF' : colors.text },
                      streak === 0 && styles.streakLabelEmpty,
                    ]}>
                    {streak > 0 ? `🔥 ${streakText}` : 'No streak'}
                  </Text>
                </View>
                <View style={styles.week} aria-hidden>
                  {week.map((day) => (
                    <View key={day.dateKey} style={styles.weekDay}>
                      <View
                        style={[
                          styles.weekDot,
                          done
                            ? {
                                backgroundColor: day.done ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                                borderColor: day.done ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                              }
                            : {
                                backgroundColor: day.done ? item.color : 'transparent',
                                borderColor: day.done ? item.color : colors.border,
                              },
                        ]}
                      />
                      <Text
                        style={[
                          styles.weekLabel,
                          { color: done ? '#FFFFFF' : colors.text },
                          day.isToday && styles.weekLabelToday,
                        ]}>
                        {day.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/add-habit')}
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        ]}>
        <Text style={styles.addButtonText}>Add habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: 280,
  },
  list: {
    gap: 12,
  },
  habitRow: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  habitTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  streakLabelEmpty: {
    opacity: 0.5,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Lines the strip up under the name, past the 28px check circle and its 12px gap.
    marginLeft: 40,
  },
  weekDay: {
    alignItems: 'center',
    gap: 4,
  },
  weekDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  weekLabel: {
    fontSize: 11,
    opacity: 0.6,
  },
  weekLabelToday: {
    fontWeight: '700',
    opacity: 1,
  },
  habitName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
