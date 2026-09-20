import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import {
  MOCK_USER_PROFILE,
  MOCK_CROP_HEALTH_SUMMARY,
  MOCK_CROPS_LIST,
  MOCK_CROP_RISK,
} from '@/services/mock-data';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const displayName = user?.name ? user.name : 'Welcome to Plant BioSense';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'PB';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* 1. ELEGANT HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.greetingText, { color: theme.textSecondary }]}>
                {MOCK_USER_PROFILE.greeting}
              </Text>
              <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
                {displayName}
              </Text>
            </View>

            {/* Profile Avatar Button */}
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [
                styles.avatarButton,
                { backgroundColor: theme.softGreen, borderColor: theme.border },
                pressed && styles.pressed,
              ]}
              accessibilityLabel="View Profile"
              accessibilityRole="button">
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {initial}
              </Text>
            </Pressable>
          </View>

          {/* 2. MAIN HEALTH SUMMARY CARD */}
          <Card variant="elevated" style={styles.healthSummaryCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
                Your Crop Health
              </Text>
              <Badge
                label={MOCK_CROP_HEALTH_SUMMARY.status}
                statusType={MOCK_CROP_HEALTH_SUMMARY.statusType}
              />
            </View>

            <View style={styles.scoreRow}>
              <Text style={[styles.percentageText, { color: theme.primary }]}>
                {MOCK_CROP_HEALTH_SUMMARY.percentage}%
              </Text>
              <Text style={[styles.scoreSubtext, { color: theme.textSecondary }]}>
                Overall health index across all active plots
              </Text>
            </View>

            {/* Progress Visualization */}
            <View style={styles.progressWrapper}>
              <ProgressBar percentage={MOCK_CROP_HEALTH_SUMMARY.percentage} height={12} />
            </View>

            <Text style={[styles.timestampText, { color: theme.textSecondary }]}>
              {MOCK_CROP_HEALTH_SUMMARY.lastUpdated}
            </Text>
          </Card>

          {/* 3. PRIMARY ACTION - SCAN PLANT */}
          <Card style={[styles.scanActionCard, { backgroundColor: theme.softGreen, borderColor: theme.border }]}>
            <View style={styles.scanCardContent}>
              <View style={styles.scanIconBadge}>
                <Text style={styles.scanIconEmoji}>📷</Text>
              </View>
              
              <View style={styles.scanTextGroup}>
                <Text style={[styles.scanTitle, { color: theme.primary }]}>
                  Check Your Plant
                </Text>
                <Text style={[styles.scanSubtitle, { color: theme.textSecondary }]}>
                  Take a photo to identify possible crop diseases instantly.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/scan')}
              style={({ pressed }) => [
                styles.scanButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressedButton,
              ]}
              accessibilityLabel="Scan Plant Camera"
              accessibilityRole="button">
              <Text style={styles.scanButtonIcon}>📷</Text>
              <Text style={styles.scanButtonText}>Scan Plant</Text>
            </Pressable>
          </Card>

          {/* 4. MY CROPS SECTION */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                My Crops
              </Text>
              <Pressable
                onPress={() => router.push('/crops')}
                style={({ pressed }) => [pressed && styles.pressedText]}>
                <Text style={[styles.viewAllText, { color: theme.secondary }]}>
                  View all →
                </Text>
              </Pressable>
            </View>

            <View style={styles.cropsList}>
              {MOCK_CROPS_LIST.map((crop) => (
                <Card
                  key={crop.id}
                  onPress={() => router.push('/crops')}
                  style={styles.cropCard}>
                  <View style={styles.cropCardRow}>
                    <View style={[styles.cropIconContainer, { backgroundColor: theme.backgroundElement }]}>
                      <Text style={styles.cropEmoji}>{crop.icon}</Text>
                    </View>

                    <View style={styles.cropInfo}>
                      <Text style={[styles.cropName, { color: theme.text }]}>
                        {crop.name}
                      </Text>
                      <Text style={[styles.cropLocation, { color: theme.textSecondary }]}>
                        {crop.fieldLocation}
                      </Text>
                    </View>

                    <View style={styles.cropStatusColumn}>
                      <Badge label={crop.status} statusType={crop.statusType} />
                      <Text style={[styles.cropScoreText, { color: theme.textSecondary }]}>
                        {crop.healthScore}% score
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* 5. CROP RISK SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Crop Risk
            </Text>

            <Card style={styles.riskCard}>
              <View style={styles.riskCardRow}>
                <View style={[styles.riskIconBadge, { backgroundColor: theme.softGreen }]}>
                  <Text style={styles.riskEmoji}>🛡️</Text>
                </View>

                <View style={styles.riskTextGroup}>
                  <View style={styles.riskBadgeRow}>
                    <Text style={[styles.riskStatusText, { color: theme.primary }]}>
                      {MOCK_CROP_RISK.statusText}
                    </Text>
                    <Badge label="Low Risk" statusType="healthy" />
                  </View>
                  <Text style={[styles.riskDescription, { color: theme.textSecondary }]}>
                    {MOCK_CROP_RISK.description}
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* 6. QUICK ACCESS SHORTCUTS */}
          <View style={styles.quickAccessSection}>
            <Text style={[styles.quickAccessLabel, { color: theme.textSecondary }]}>
              Quick Access
            </Text>
            
            <View style={styles.shortcutsRow}>
              <Pressable
                onPress={() => router.push('/crops')}
                style={({ pressed }) => [
                  styles.shortcutChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.shortcutEmoji}>🌱</Text>
                <Text style={[styles.shortcutText, { color: theme.text }]}>My Crops</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/scan')}
                style={({ pressed }) => [
                  styles.shortcutChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.shortcutEmoji}>📷</Text>
                <Text style={[styles.shortcutText, { color: theme.text }]}>Scan</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/history')}
                style={({ pressed }) => [
                  styles.shortcutChip,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.shortcutEmoji}>📜</Text>
                <Text style={[styles.shortcutText, { color: theme.text }]}>History</Text>
              </Pressable>
            </View>
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

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  headerTextGroup: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.three,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* HEALTH SUMMARY CARD */
  healthSummaryCard: {
    gap: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  scoreRow: {
    gap: Spacing.one,
  },
  percentageText: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 48,
  },
  scoreSubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  progressWrapper: {
    marginTop: Spacing.one,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  /* SCAN ACTION CARD */
  scanActionCard: {
    gap: Spacing.three,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  scanIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconEmoji: {
    fontSize: 22,
  },
  scanTextGroup: {
    flex: 1,
    gap: 2,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scanSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  scanButton: {
    height: 50,
    borderRadius: Spacing.two + Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  scanButtonIcon: {
    fontSize: 18,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  /* SECTIONS GENERAL */
  sectionContainer: {
    gap: Spacing.two + Spacing.one,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* CROPS LIST */
  cropsList: {
    gap: Spacing.two + Spacing.one,
  },
  cropCard: {
    padding: Spacing.three,
  },
  cropCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cropIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: {
    fontSize: 22,
  },
  cropInfo: {
    flex: 1,
    gap: 2,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cropLocation: {
    fontSize: 13,
  },
  cropStatusColumn: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cropScoreText: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* RISK CARD */
  riskCard: {
    padding: Spacing.three,
  },
  riskCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  riskIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskEmoji: {
    fontSize: 20,
  },
  riskTextGroup: {
    flex: 1,
    gap: 4,
  },
  riskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  riskStatusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },

  /* QUICK ACCESS */
  quickAccessSection: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  quickAccessLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  shortcutChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one + Spacing.half,
    paddingVertical: Spacing.two + Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
  },
  shortcutEmoji: {
    fontSize: 16,
  },
  shortcutText: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* INTERACTION STATES */
  pressed: {
    opacity: 0.8,
  },
  pressedButton: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  pressedText: {
    opacity: 0.7,
  },
});
