import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Habit } from '@/habits/habits-context';
import type { DayStatus } from '@/habits/streaks';
import { textOn, useAppColors } from '@/theme/colors';

type Props = {
  habit: Habit;
  done: boolean;
  streak: number;
  week: DayStatus[];
  onToggle: () => void;
  onDelete: () => void;
};

export function HabitRow({ habit, done, streak, week, onToggle, onDelete }: Props) {
  const colors = useAppColors();
  const streakText = streak === 1 ? '1 day' : `${streak} days`;
  // When ticked, the row fills with the habit colour and everything on it switches to a readable ink.
  const ink = done ? textOn(habit.color) : colors.text;
  const faintInk = ink === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(17,24,39,0.2)';

  return (
    <Pressable
      role="checkbox"
      aria-checked={done}
      aria-label={`${habit.name}, streak ${streakText}`}
      accessibilityHint={
        done ? 'Marks as not done today. Long-press to delete.' : 'Marks as done today. Long-press to delete.'
      }
      accessibilityActions={[{ name: 'delete', label: 'Delete habit' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'delete') onDelete();
      }}
      onPress={onToggle}
      onLongPress={onDelete}
      style={({ pressed }) => [
        styles.row,
        done
          ? { backgroundColor: habit.color, borderColor: habit.color }
          : { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={styles.top}>
        <View
          style={[
            styles.checkCircle,
            done ? { backgroundColor: ink, borderColor: ink } : { borderColor: habit.color },
          ]}>
          {done && <Text style={[styles.checkMark, { color: habit.color }]}>✓</Text>}
        </View>
        <Text style={[styles.name, { color: ink }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <Text style={[styles.streak, { color: done ? ink : colors.muted }]}>
          {streak > 0 ? `🔥 ${streakText}` : 'No streak'}
        </Text>
      </View>
      <View style={styles.week} aria-hidden>
        {week.map((day) => {
          const dotColor = done
            ? day.done
              ? ink
              : faintInk
            : day.done
              ? habit.color
              : colors.border;
          return (
            <View key={day.dateKey} style={styles.weekDay}>
              <View
                style={[
                  styles.weekDot,
                  {
                    borderColor: dotColor,
                    backgroundColor: day.done || done ? dotColor : 'transparent',
                  },
                ]}
              />
              <Text
                style={[
                  styles.weekLabel,
                  { color: done ? ink : colors.muted },
                  day.isToday && [styles.weekLabelToday, { color: ink }],
                ]}>
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  streak: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
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
  },
  weekLabelToday: {
    fontWeight: '700',
  },
});
