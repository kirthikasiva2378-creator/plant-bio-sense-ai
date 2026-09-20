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

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCrops } from '@/context/crops-context';
import { useTheme } from '@/hooks/use-theme';

export default function CropsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { crops, clearAllCrops, resetToDefaultCrops } = useCrops();

  const isEmpty = crops.length === 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.title, { color: theme.text }]}>
                My Crops
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Keep track of your plants and their health.
              </Text>
            </View>

            {/* + ADD CROP BUTTON */}
            <Pressable
              onPress={() => router.push('/add-crop')}
              style={({ pressed }) => [
                styles.addCropButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressedButton,
              ]}
              accessibilityLabel="Add New Crop"
              accessibilityRole="button">
              <Text style={styles.addCropButtonText}>+ Add Crop</Text>
            </Pressable>
          </View>

          {/* TESTING TOGGLES (Allows testing empty state vs default state) */}
          <View style={styles.stateControlsRow}>
            {isEmpty ? (
              <Pressable
                onPress={resetToDefaultCrops}
                style={({ pressed }) => [pressed && styles.pressed]}>
                <Text style={[styles.controlLink, { color: theme.secondary }]}>
                  ↺ Restore sample crops
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={clearAllCrops}
                style={({ pressed }) => [pressed && styles.pressed]}>
                <Text style={[styles.controlLink, { color: theme.textSecondary }]}>
                  Testing: Clear all crops (Test Empty State)
                </Text>
              </Pressable>
            )}
          </View>

          {/* MAIN CONTENT AREA */}
          {isEmpty ? (
            /* EMPTY STATE VIEW */
            <Card style={styles.emptyStateCard}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.softGreen }]}>
                <Text style={styles.emptyEmoji}>🌱</Text>
              </View>

              <View style={styles.emptyTextGroup}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  No Crops Added Yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Start by adding a crop to monitor its health and get disease risk alerts.
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/add-crop')}
                style={({ pressed }) => [
                  styles.emptyStateButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressedButton,
                ]}
                accessibilityLabel="Add Your First Crop"
                accessibilityRole="button">
                <Text style={styles.emptyStateButtonText}>+ Add Your First Crop</Text>
              </Pressable>
            </Card>
          ) : (
            /* CROPS LIST VIEW */
            <View style={styles.cropsGrid}>
              {crops.map((crop) => (
                <Card
                  key={crop.id}
                  onPress={() =>
                    router.push({
                      pathname: '/crop-details',
                      params: { id: crop.id },
                    })
                  }
                  style={styles.cropCard}>
                  <View style={styles.cropCardRow}>
                    {/* EMOJI ICON */}
                    <View style={[styles.cropIconWrapper, { backgroundColor: theme.backgroundElement }]}>
                      <Text style={styles.cropEmoji}>{crop.icon}</Text>
                    </View>

                    {/* CROP DETAILS */}
                    <View style={styles.cropDetailsGroup}>
                      <View style={styles.cropTitleRow}>
                        <Text style={[styles.cropName, { color: theme.text }]}>
                          {crop.name}
                        </Text>
                        <Badge label={crop.status} statusType={crop.statusType} />
                      </View>

                      <Text style={[styles.cropSubInfo, { color: theme.textSecondary }]}>
                        {crop.growingType}{crop.variety ? ` • ${crop.variety}` : ''}
                      </Text>

                      <View style={styles.cropFooterRow}>
                        <Text style={[styles.lastCheckedText, { color: theme.textSecondary }]}>
                          Last checked: {crop.lastChecked}
                        </Text>

                        <Text style={[styles.scoreText, { color: theme.primary }]}>
                          {crop.healthScore}% health
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

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
    gap: Spacing.three,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  addCropButton: {
    paddingHorizontal: Spacing.three + 2,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCropButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* CONTROLS */
  stateControlsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.one,
  },
  controlLink: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* CROPS GRID */
  cropsGrid: {
    gap: Spacing.three,
  },
  cropCard: {
    padding: Spacing.three + 2,
  },
  cropCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  cropIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: {
    fontSize: 24,
  },
  cropDetailsGroup: {
    flex: 1,
    gap: 4,
  },
  cropTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
  },
  cropSubInfo: {
    fontSize: 13,
  },
  cropFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  lastCheckedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* EMPTY STATE */
  emptyStateCard: {
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    marginVertical: Spacing.two,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTextGroup: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.two,
  },
  emptyStateButton: {
    height: 48,
    paddingHorizontal: Spacing.four,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
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
