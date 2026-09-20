import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();

  const name = user?.name || 'Viveka Sharma';
  const email = user?.email || 'viveka@plantbiosense.ai';
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace('/landing');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* BACK HEADER */}
          <View style={styles.navHeader}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backNavButton, pressed && styles.pressed]}
              accessibilityLabel="Back to Dashboard"
              accessibilityRole="button">
              <Text style={[styles.backNavText, { color: theme.secondary }]}>
                ← Back to Dashboard
              </Text>
            </Pressable>
          </View>

          {/* USER AVATAR & NAME CARD */}
          <Card variant="elevated" style={styles.profileCard}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.softGreen }]}>
              <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                {initial}
              </Text>
            </View>

            <Text style={[styles.userName, { color: theme.text }]}>
              {name}
            </Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              {email}
            </Text>

            <View style={[styles.badgeContainer, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                🌱 Registered Crop Monitor
              </Text>
            </View>
          </Card>

          {/* PREFERENCES / SETTINGS PLACEHOLDERS */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              App Preferences & Settings
            </Text>

            <Card style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <Text style={styles.settingEmoji}>🔔</Text>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Crop Health Alerts
                  </Text>
                  <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                    Daily disease risk summaries & weather updates
                  </Text>
                </View>
                <Text style={[styles.settingTag, { color: theme.secondary }]}>Active</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.settingItem}>
                <Text style={styles.settingEmoji}>🌍</Text>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Region & Climate Context
                  </Text>
                  <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                    Local agricultural zone & soil presets
                  </Text>
                </View>
                <Text style={[styles.settingTag, { color: theme.textSecondary }]}>Default</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.settingItem}>
                <Text style={styles.settingEmoji}>🔒</Text>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Data Privacy & Storage
                  </Text>
                  <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                    Local crop history stored securely on device
                  </Text>
                </View>
                <Text style={[styles.settingTag, { color: theme.secondary }]}>Protected</Text>
              </View>
            </Card>
          </View>

          {/* LOGOUT BUTTON */}
          <View style={styles.logoutContainer}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.pressedButton,
              ]}
              accessibilityLabel="Sign out of account"
              accessibilityRole="button">
              <Text style={styles.logoutButtonText}>🚪 Sign Out</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.four,
  },
  contentContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },

  /* NAV HEADER */
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  backNavButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  backNavText: {
    fontSize: 15,
    fontWeight: '700',
  },

  /* PROFILE CARD */
  profileCard: {
    alignItems: 'center',
    padding: Spacing.five,
    gap: Spacing.two,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '800',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
  },
  badgeContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 16,
    marginTop: Spacing.one,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* SETTINGS */
  section: {
    gap: Spacing.two + 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  settingsCard: {
    padding: Spacing.three,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingTextGroup: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  settingTag: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },

  /* LOGOUT */
  logoutContainer: {
    marginTop: Spacing.two,
  },
  logoutButton: {
    height: 50,
    borderRadius: Spacing.two + Spacing.one,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '700',
  },

  /* STATES */
  pressed: {
    opacity: 0.7,
  },
  pressedButton: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
