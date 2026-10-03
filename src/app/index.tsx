import { router, useTheme } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useHabits } from '@/habits/habits-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { habits } = useHabits();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {habits.length === 0 ? (
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
          renderItem={({ item }) => (
            <View style={[styles.habitRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.habitDot, { backgroundColor: item.color }]} />
              <Text style={[styles.habitName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          )}
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
  habitDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
