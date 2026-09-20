import React from 'react';
import { View, StyleSheet, Text, type ColorValue } from 'react-native';

export type TabIconName = 'home' | 'crops' | 'scan' | 'history' | 'profile';

interface TabIconProps {
  name: TabIconName;
  color: ColorValue;
  focused?: boolean;
  size?: number;
}

export function TabIcon({ name, color, focused = false, size = 24 }: TabIconProps) {
  // Render clean vector icon badge/symbol based on tab name
  const renderIconSymbol = () => {
    switch (name) {
      case 'home':
        return '🏠';
      case 'crops':
        return '🌱';
      case 'scan':
        return '📷';
      case 'history':
        return '📜';
      case 'profile':
        return '👤';
      default:
        return '📌';
    }
  };

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      <Text style={{ fontSize: size - 4, textAlign: 'center' }}>
        {renderIconSymbol()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  focusedContainer: {
    transform: [{ scale: 1.1 }],
  },
});
