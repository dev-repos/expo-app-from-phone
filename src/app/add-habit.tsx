import { router, useTheme } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { HABIT_COLORS, useHabits } from '@/habits/habits-context';

export default function AddHabitScreen() {
  const { colors } = useTheme();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);

  const canSave = name.trim().length > 0;

  const close = () => {
    // On web the modal can be opened directly by URL, so there may be nothing to go back to.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const save = () => {
    if (!canSave) return;
    addHabit(name, color);
    close();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Drink water"
        placeholderTextColor="#9CA3AF"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={save}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
      />

      <Text style={[styles.label, { color: colors.text }]}>Colour</Text>
      <View style={styles.swatches}>
        {HABIT_COLORS.map((swatch) => {
          const selected = swatch === color;
          return (
            <Pressable
              key={swatch}
              accessibilityRole="radio"
              accessibilityLabel={`Colour ${swatch}`}
              accessibilityState={{ selected }}
              onPress={() => setColor(swatch)}
              style={[
                styles.swatch,
                { backgroundColor: swatch, borderColor: selected ? colors.text : 'transparent' },
              ]}
            />
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSave }}
        disabled={!canSave}
        onPress={save}
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: color, opacity: !canSave ? 0.4 : pressed ? 0.8 : 1 },
        ]}>
        <Text style={styles.saveButtonText}>Save habit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
