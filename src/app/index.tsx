import { useTheme } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.emptyState}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet</Text>
        <Text style={[styles.emptyHint, { color: colors.text }]}>
          Small steps add up. Your habits will show up here once you add one.
        </Text>
      </View>
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
});
