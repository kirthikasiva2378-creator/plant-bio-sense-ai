import React from 'react';
import { StyleSheet, View, Pressable, type ViewStyle, type StyleProp } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'flat' | 'elevated';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderRadius: Spacing.three,
    borderWidth: 1,
    padding: Spacing.four,
    ...(variant === 'elevated' && {
      shadowColor: '#172117',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    }),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && styles.pressed,
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});
