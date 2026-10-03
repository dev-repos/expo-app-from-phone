import { router, useTheme } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { toDateKey, useHabits } from '@/habits/habits-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { habits, loaded, toggleDone } = useHabits();
  const today = toDateKey(new Date());

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
            return (
              <Pressable
                role="checkbox"
                aria-checked={done}
                aria-label={item.name}
                accessibilityHint={done ? 'Marks as not done today' : 'Marks as done today'}
                onPress={() => toggleDone(item.id, today)}
                style={({ pressed }) => [
                  styles.habitRow,
                  done
                    ? { backgroundColor: item.color, borderColor: item.color }
                    : { backgroundColor: colors.card, borderColor: colors.border },
                  { opacity: pressed ? 0.8 : 1 },
                ]}>
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
                {done && <Text style={styles.doneLabel}>Done today</Text>}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  doneLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
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
