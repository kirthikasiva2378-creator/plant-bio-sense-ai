import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ProgressBarProps {
  percentage: number;
  height?: number;
  showPercentageLabel?: boolean;
}

export function ProgressBar({ percentage, height = 10, showPercentageLabel = false }: ProgressBarProps) {
  const theme = useTheme();
  const clampedValue = Math.min(100, Math.max(0, percentage));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: theme.backgroundElement, height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedValue}%`,
              backgroundColor: theme.secondary,
              height,
            },
          ]}
        />
      </View>
      {showPercentageLabel && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {clampedValue}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  track: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
