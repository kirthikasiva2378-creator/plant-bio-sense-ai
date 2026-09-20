import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCrops } from '@/context/crops-context';
import { useTheme } from '@/hooks/use-theme';
import { CropItem } from '@/services/mock-data';

interface SwipeableCropCardProps {
  crop: CropItem;
  onPress: () => void;
  onDeleteReq: (crop: CropItem) => void;
}

function SwipeableCropCard({ crop, onPress, onDeleteReq }: SwipeableCropCardProps) {
  const theme = useTheme();
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          pan.setValue({ x: Math.max(-100, gestureState.dx), y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(pan, {
            toValue: { x: -80, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const resetSwipe = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.swipeContainer}>
      {/* REAR DELETE ACTION */}
      <View style={styles.rearDeleteContainer}>
        <Pressable
          onPress={() => {
            resetSwipe();
            onDeleteReq(crop);
          }}
          style={({ pressed }) => [
            styles.deleteActionButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.deleteActionIcon}>🗑️</Text>
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      </View>

      {/* FRONT CARD CONTENT */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.frontCardWrapper,
          { transform: [{ translateX: pan.x }] },
        ]}>
        <Card onPress={onPress} style={styles.cropCard}>
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
      </Animated.View>
    </View>
  );
}

export default function CropsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { crops, deleteCrop, restoreCrop, clearAllCrops, resetToDefaultCrops } = useCrops();

  // Confirmation Modal state
  const [targetToDelete, setTargetToDelete] = useState<CropItem | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<CropItem | null>(null);

  const isEmpty = crops.length === 0;

  const confirmDelete = () => {
    if (targetToDelete) {
      const deleted = deleteCrop(targetToDelete.id);
      if (deleted) {
        setRecentlyDeleted(deleted);
      }
      setTargetToDelete(null);
    }
  };

  const handleUndo = () => {
    if (recentlyDeleted) {
      restoreCrop(recentlyDeleted);
      setRecentlyDeleted(null);
    }
  };

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

            {/* 🌱 ADD CROP BUTTON */}
            <Pressable
              onPress={() => router.push('/add-crop')}
              style={({ pressed }) => [
                styles.addCropButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressedButton,
              ]}
              accessibilityLabel="Add New Crop"
              accessibilityRole="button">
              <Text style={styles.addCropButtonText}>🌱 Add Crop</Text>
            </Pressable>
          </View>

          {/* SWIPE INSTRUCTION / TESTING CONTROLS */}
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
              <Text style={[styles.swipeTipText, { color: theme.textSecondary }]}>
                Tip: Swipe left on any crop to delete
              </Text>
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
                <Text style={styles.emptyStateButtonText}>🌱 Add Your First Crop</Text>
              </Pressable>
            </Card>
          ) : (
            /* CROPS LIST VIEW WITH SWIPE DELETE */
            <View style={styles.cropsGrid}>
              {crops.map((crop) => (
                <SwipeableCropCard
                  key={crop.id}
                  crop={crop}
                  onPress={() =>
                    router.push({
                      pathname: '/crop-details',
                      params: { id: crop.id },
                    })
                  }
                  onDeleteReq={(item) => setTargetToDelete(item)}
                />
              ))}
            </View>
          )}

          {/* UNDO TOAST NOTIFICATION */}
          {!!recentlyDeleted && (
            <View style={[styles.undoToast, { backgroundColor: theme.text }]}>
              <Text style={styles.undoText}>
                Removed {recentlyDeleted.name}
              </Text>
              <Pressable onPress={handleUndo} style={styles.undoButton}>
                <Text style={[styles.undoButtonText, { color: theme.accent }]}>
                  UNDO
                </Text>
              </Pressable>
            </View>
          )}

          {/* CONFIRMATION DELETE MODAL */}
          <Modal
            visible={!!targetToDelete}
            transparent
            animationType="fade"
            onRequestClose={() => setTargetToDelete(null)}>
            <View style={styles.modalOverlay}>
              <Card style={styles.modalCard}>
                <Text style={styles.modalEmoji}>🗑️</Text>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Remove {targetToDelete?.name}?
                </Text>
                <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
                  Are you sure you want to remove this crop from your monitored list?
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => setTargetToDelete(null)}
                    style={({ pressed }) => [
                      styles.modalCancelButton,
                      { backgroundColor: theme.backgroundElement },
                      pressed && styles.pressed,
                    ]}>
                    <Text style={[styles.modalCancelText, { color: theme.text }]}>
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={confirmDelete}
                    style={({ pressed }) => [
                      styles.modalRemoveButton,
                      pressed && styles.pressedButton,
                    ]}>
                    <Text style={styles.modalRemoveText}>Remove</Text>
                  </Pressable>
                </View>
              </Card>
            </View>
          </Modal>

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
    paddingHorizontal: Spacing.three + 4,
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

  /* CONTROLS & TIPS */
  stateControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  swipeTipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  controlLink: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* CROPS GRID & SWIPEABLE CARD */
  cropsGrid: {
    gap: Spacing.three,
  },
  swipeContainer: {
    position: 'relative',
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  rearDeleteContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#D32F2F',
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 2,
  },
  deleteActionIcon: {
    fontSize: 18,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  frontCardWrapper: {
    width: '100%',
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

  /* UNDO TOAST */
  undoToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two + 2,
    marginTop: Spacing.two,
  },
  undoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  undoButton: {
    paddingHorizontal: Spacing.two,
  },
  undoButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalEmoji: {
    fontSize: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalRemoveButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRemoveText: {
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
