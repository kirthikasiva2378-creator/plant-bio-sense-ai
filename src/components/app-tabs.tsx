import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { TabIcon } from '@/components/ui/tab-icon';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundElement,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: 'Crops',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="crops" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="scan" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="history" color={color} focused={focused} />
          ),
        }}
      />
      {/* Hidden screens from bottom tabs */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="landing" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="add-crop" options={{ href: null }} />
      <Tabs.Screen name="crop-details" options={{ href: null }} />
    </Tabs>
  );
}
