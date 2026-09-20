import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Spacing } from '@/constants/theme';
import { HealthStatusType } from '@/services/mock-data';

interface BadgeProps {
  label: string;
  statusType?: HealthStatusType;
}

export function Badge({ label, statusType = 'healthy' }: BadgeProps) {
  const getBadgeColors = () => {
    switch (statusType) {
      case 'attention':
      case 'warning':
        return {
          bg: '#FFF3E0',
          text: '#E65100',
          dot: '#F57C00',
        };
      case 'healthy':
      default:
        return {
          bg: '#E8F5E9',
          text: '#1B5E20',
          dot: '#2E7D32',
        };
    }
  };

  const colors = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.one + Spacing.half,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: Spacing.one,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
