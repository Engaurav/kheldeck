import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../core/theme/ThemeContext';

interface NumberChipPadProps {
  min?: number;
  max?: number;
  selectedValue: number | null;
  onSelect: (value: number) => void;
  disabledValues?: number[];
  accentColor?: string;
  label?: string;
}

export const NumberChipPad: React.FC<NumberChipPadProps> = ({
  min = 1,
  max = 13,
  selectedValue,
  onSelect,
  disabledValues = [],
  accentColor,
  label,
}) => {
  const { theme, isDark } = useTheme();
  const numbers: number[] = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  const activeColor = accentColor || theme.colors.accentPrimary;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {numbers.map((num) => {
          const isSelected = selectedValue === num;
          const isDisabled = disabledValues.includes(num);

          return (
            <TouchableOpacity
              key={num}
              activeOpacity={0.7}
              disabled={isDisabled}
              onPress={() => onSelect(num)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? activeColor
                    : isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(15, 23, 42, 0.05)',
                  borderColor: isSelected
                    ? activeColor
                    : isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(15, 23, 42, 0.10)',
                  opacity: isDisabled ? 0.35 : 1,
                },
                isSelected &&
                  Platform.select({
                    web: {
                      boxShadow: `0 0 16px ${activeColor}80`,
                      transform: 'scale(1.05)',
                    } as any,
                    default: {
                      elevation: 6,
                    },
                  }),
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : theme.colors.textPrimary,
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    minWidth: 44,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
  },
  chipText: {
    fontSize: 16,
  },
});
