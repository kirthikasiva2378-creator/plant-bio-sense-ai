import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCrops } from '@/context/crops-context';
import { useTheme } from '@/hooks/use-theme';

export default function CropDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { getCropById } = useCrops();

  const crop = params.id ? getCropById(params.id) : undefined;

  if (!crop) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundEmoji]}>🌱</Text>
          <Text style={[styles.notFoundTitle, { color: theme.text }]}>
            Crop Not Found
          </Text>
          <Text style={[styles.notFoundSubtitle, { color: theme.textSecondary }]}>
            The requested crop record could not be found or has been removed.
          </Text>
          <Pressable
            onPress={() => router.replace('/crops')}
            style={[styles.backButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.backButtonText}>Return to My Crops</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
              accessibilityLabel="Back to My Crops"
              accessibilityRole="button">
              <Text style={[styles.backNavText, { color: theme.secondary }]}>
                ← Back to My Crops
              </Text>
            </Pressable>
          </View>

          {/* CROP HEADER CARD */}
          <Card style={styles.cropHeaderCard}>
            <View style={styles.cropHeaderRow}>
              <View style={[styles.cropIconWrapper, { backgroundColor: theme.softGreen }]}>
                <Text style={styles.cropEmoji}>{crop.icon}</Text>
              </View>

              <View style={styles.cropTitleGroup}>
                <Text style={[styles.cropTitle, { color: theme.text }]}>
                  {crop.name}
                </Text>
                <Text style={[styles.cropSubtitle, { color: theme.textSecondary }]}>
                  {crop.growingType}{crop.variety ? ` • ${crop.variety}` : ''}
                </Text>
              </View>

              <Badge label={crop.status} statusType={crop.statusType} />
            </View>
          </Card>

          {/* HEALTH OVERVIEW CARD */}
          <Card variant="elevated" style={styles.metricsCard}>
            <Text style={[styles.cardSectionLabel, { color: theme.textSecondary }]}>
              HEALTH OVERVIEW
            </Text>

            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color: theme.primary }]}>
                {crop.healthScore}%
              </Text>
              <Text style={[styles.scoreSubtext, { color: theme.textSecondary }]}>
                Calculated health index rating
              </Text>
            </View>

            <ProgressBar percentage={crop.healthScore} height={12} />

            <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                  Last Checked
                </Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>
                  {crop.lastChecked}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                  Location
                </Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>
                  {crop.fieldLocation || crop.growingType}
                </Text>
              </View>
            </View>
          </Card>

          {/* PRIMARY ACTION — SCAN THIS PLANT */}
          <Card style={[styles.scanCTA, { backgroundColor: theme.softGreen, borderColor: theme.border }]}>
            <View style={styles.scanCTATextGroup}>
              <Text style={[styles.scanCTATitle, { color: theme.primary }]}>
                Visual AI Diagnosis Context
              </Text>
              <Text style={[styles.scanCTASubtitle, { color: theme.textSecondary }]}>
                Perform a camera scan for {crop.name} to detect potential disease risks early.
              </Text>
            </View>

            <Pressable
              onPress={() => router.push({ pathname: '/scan', params: { cropId: crop.id, cropName: crop.name } })}
              style={({ pressed }) => [
                styles.scanButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressedButton,
              ]}
              accessibilityLabel={`Scan ${crop.name} Plant`}
              accessibilityRole="button">
              <Text style={styles.scanButtonIcon}>📷</Text>
              <Text style={styles.scanButtonText}>Scan This Plant</Text>
            </Pressable>
          </Card>

          {/* RECENT DIAGNOSIS PLACEHOLDER */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Diagnosis History
            </Text>

            <Card style={styles.placeholderCard}>
              <View style={styles.placeholderRow}>
                <Text style={styles.placeholderEmoji}>📋</Text>
                <View style={styles.placeholderTextGroup}>
                  <Text style={[styles.placeholderTitle, { color: theme.text }]}>
                    No Disease Issues Detected
                  </Text>
                  <Text style={[styles.placeholderBody, { color: theme.textSecondary }]}>
                    Previous inspections show leaves and stems are within healthy conditions.
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* RISK STATUS PLACEHOLDER */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Risk Status Assessment
            </Text>

            <Card style={styles.placeholderCard}>
              <View style={styles.placeholderRow}>
                <Text style={styles.placeholderEmoji}>🛡️</Text>
                <View style={styles.placeholderTextGroup}>
                  <Text style={[styles.placeholderTitle, { color: theme.primary }]}>
                    Low Environmental Risk
                  </Text>
                  <Text style={[styles.placeholderBody, { color: theme.textSecondary }]}>
                    Monitored growing conditions for {crop.growingType} are currently favorable.
                  </Text>
                </View>
              </View>
            </Card>
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

  /* CROP HEADER CARD */
  cropHeaderCard: {
    padding: Spacing.three + Spacing.one,
  },
  cropHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cropIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: {
    fontSize: 26,
  },
  cropTitleGroup: {
    flex: 1,
    gap: 2,
  },
  cropTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cropSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },

  /* METRICS CARD */
  metricsCard: {
    gap: Spacing.three,
  },
  cardSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scoreRow: {
    gap: 2,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreSubtext: {
    fontSize: 13,
  },
  metaDivider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* SCAN CTA */
  scanCTA: {
    gap: Spacing.three,
  },
  scanCTATextGroup: {
    gap: 2,
  },
  scanCTATitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scanCTASubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  scanButton: {
    height: 52,
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

  /* SECTIONS */
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  placeholderCard: {
    padding: Spacing.three,
  },
  placeholderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  placeholderEmoji: {
    fontSize: 22,
  },
  placeholderTextGroup: {
    flex: 1,
    gap: 2,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  placeholderBody: {
    fontSize: 13,
    lineHeight: 18,
  },

  /* NOT FOUND */
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  notFoundEmoji: {
    fontSize: 48,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  notFoundSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two + Spacing.one,
    marginTop: Spacing.two,
  },
  backButtonText: {
    color: '#FFFFFF',
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
