import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCrops } from '@/context/crops-context';
import { useTheme } from '@/hooks/use-theme';
import { CapturedImage, ScanStep } from '@/types/scan';

export default function ScanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ cropId?: string; cropName?: string }>();
  const { crops } = useCrops();

  // Selected crop context
  const [selectedCropName, setSelectedCropName] = useState<string>(
    params.cropName || (crops.length > 0 ? crops[0].name : 'General Plant')
  );

  // Scan state steps
  const [scanStep, setScanStep] = useState<ScanStep>('selection');
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Take photo with device camera
  const handleTakePhoto = async () => {
    try {
      setPermissionError(null);
      setLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        setPermissionError(
          'Camera permission is required to take photos of your crops. Please enable camera access in your device settings.'
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || `scan-${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
          fileSize: asset.fileSize,
        });
        setScanStep('preview');
      }
    } catch (err) {
      setPermissionError('Unable to open camera. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pick photo from gallery
  const handlePickFromGallery = async () => {
    try {
      setPermissionError(null);
      setLoading(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        setPermissionError(
          'Photo gallery access is required to select existing crop photos. Please enable gallery access in device settings.'
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || `gallery-${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
          fileSize: asset.fileSize,
        });
        setScanStep('preview');
      }
    } catch (err) {
      setPermissionError('Unable to open gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm image for analysis preparation
  const handleConfirmImage = () => {
    if (selectedImage) {
      setScanStep('preparing');
    }
  };

  // Reset scan flow
  const handleResetScan = () => {
    setSelectedImage(null);
    setPermissionError(null);
    setScanStep('selection');
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
            <Text style={[styles.title, { color: theme.text }]}>
              Scan Your Plant
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Take a clear photo of a leaf or plant to check for possible health problems.
            </Text>
          </View>

          {/* CROP CONTEXT BADGE / CHIP SELECTOR */}
          <Card style={styles.cropContextCard}>
            <View style={styles.cropContextRow}>
              <Text style={styles.cropContextEmoji}>🌿</Text>
              <View style={styles.cropContextTextGroup}>
                <Text style={[styles.cropContextLabel, { color: theme.textSecondary }]}>
                  SCANNING TARGET
                </Text>
                <Text style={[styles.cropContextValue, { color: theme.primary }]}>
                  {selectedCropName}
                </Text>
              </View>
            </View>

            {/* If crops exist, allow quick switching */}
            {crops.length > 0 && scanStep === 'selection' && (
              <View style={styles.cropSwitchRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.cropSwitchList}>
                    {crops.map((crop) => {
                      const isSelected = selectedCropName === crop.name;
                      return (
                        <Pressable
                          key={crop.id}
                          onPress={() => setSelectedCropName(crop.name)}
                          style={[
                            styles.cropChip,
                            {
                              backgroundColor: isSelected
                                ? theme.primary
                                : theme.backgroundElement,
                              borderColor: isSelected
                                ? theme.primary
                                : theme.border,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.cropChipText,
                              { color: isSelected ? '#FFFFFF' : theme.text },
                            ]}>
                            {crop.icon} {crop.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}
          </Card>

          {/* STEP 1: SELECTION & GUIDANCE STATE */}
          {scanStep === 'selection' && (
            <View style={styles.stepContainer}>
              {/* PERMISSION ERROR FALLBACK */}
              {!!permissionError && (
                <Card style={styles.errorCard}>
                  <Text style={styles.errorEmoji}>⚠️</Text>
                  <Text style={[styles.errorTitle, { color: '#D32F2F' }]}>
                    Access Permission Needed
                  </Text>
                  <Text style={[styles.errorText, { color: theme.textSecondary }]}>
                    {permissionError}
                  </Text>
                  <Pressable
                    onPress={handleTakePhoto}
                    style={({ pressed }) => [
                      styles.retryButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressed,
                    ]}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                  </Pressable>
                </Card>
              )}

              {/* SCAN GUIDANCE TIPS */}
              <Card style={styles.tipsCard}>
                <Text style={[styles.tipsTitle, { color: theme.text }]}>
                  Tips for a better scan
                </Text>
                
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Text style={[styles.tipCheck, { color: theme.secondary }]}>✓</Text>
                    <Text style={[styles.tipText, { color: theme.text }]}>
                      Use good natural light
                    </Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={[styles.tipCheck, { color: theme.secondary }]}>✓</Text>
                    <Text style={[styles.tipText, { color: theme.text }]}>
                      Keep the leaf clearly visible & focused
                    </Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={[styles.tipCheck, { color: theme.secondary }]}>✓</Text>
                    <Text style={[styles.tipText, { color: theme.text }]}>
                      Avoid blurry or shaky images
                    </Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={[styles.tipCheck, { color: theme.secondary }]}>✓</Text>
                    <Text style={[styles.tipText, { color: theme.text }]}>
                      Capture one affected leaf when possible
                    </Text>
                  </View>
                </View>
              </Card>

              {/* ACTION BUTTONS */}
              <View style={styles.actionButtonsContainer}>
                <Pressable
                  onPress={handleTakePhoto}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryActionButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.pressedButton,
                  ]}
                  accessibilityLabel="Take Photo with Camera"
                  accessibilityRole="button">
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.actionIcon}>📷</Text>
                      <Text style={styles.primaryActionText}>Take Photo</Text>
                    </>
                  )}
                </Pressable>

                <Pressable
                  onPress={handlePickFromGallery}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.secondaryActionButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    pressed && styles.pressed,
                  ]}
                  accessibilityLabel="Choose photo from Gallery"
                  accessibilityRole="button">
                  <Text style={styles.actionIcon}>🖼</Text>
                  <Text style={[styles.secondaryActionText, { color: theme.text }]}>
                    Choose from Gallery
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* STEP 2: IMAGE PREVIEW STATE */}
          {scanStep === 'preview' && selectedImage && (
            <View style={styles.stepContainer}>
              <Card style={styles.previewCard}>
                <View style={styles.previewHeaderRow}>
                  <Text style={[styles.previewStatusTitle, { color: theme.primary }]}>
                    Image Captured Successfully
                  </Text>
                  <Text style={[styles.previewStatusSub, { color: theme.textSecondary }]}>
                    Verify that the leaf is clear and well lit.
                  </Text>
                </View>

                {/* IMAGE PREVIEW FRAME */}
                <View style={styles.imageFrame}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                    contentFit="cover"
                    transition={200}
                  />
                </View>

                {/* PREVIEW ACTIONS */}
                <View style={styles.actionButtonsContainer}>
                  <Pressable
                    onPress={handleConfirmImage}
                    style={({ pressed }) => [
                      styles.primaryActionButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressedButton,
                    ]}
                    accessibilityLabel="Use This Image for Scan"
                    accessibilityRole="button">
                    <Text style={styles.primaryActionText}>Use This Image</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleResetScan}
                    style={({ pressed }) => [
                      styles.secondaryActionButton,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      pressed && styles.pressed,
                    ]}
                    accessibilityLabel="Choose another image or retake"
                    accessibilityRole="button">
                    <Text style={[styles.secondaryActionText, { color: theme.text }]}>
                      🔄 Choose Another
                    </Text>
                  </Pressable>
                </View>
              </Card>
            </View>
          )}

          {/* STEP 3: ANALYSIS PREPARATION STATE */}
          {scanStep === 'preparing' && selectedImage && (
            <View style={styles.stepContainer}>
              <Card variant="elevated" style={styles.prepCard}>
                <View style={[styles.prepIconCircle, { backgroundColor: theme.softGreen }]}>
                  <Text style={styles.prepEmoji}>🔬</Text>
                </View>

                <View style={styles.prepTextGroup}>
                  <Text style={[styles.prepTitle, { color: theme.primary }]}>
                    Preparing your scan...
                  </Text>
                  <Text style={[styles.prepSubtitle, { color: theme.textSecondary }]}>
                    Your image is formatted and ready for AI disease prediction.
                  </Text>
                </View>

                {/* DECOUPLED PAYLOAD SUMMARY BOX */}
                <View style={[styles.payloadBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <Text style={[styles.payloadLabel, { color: theme.textSecondary }]}>
                    PREPARED SCAN PAYLOAD
                  </Text>
                  <Text style={[styles.payloadItem, { color: theme.text }]}>
                    🌿 Target Crop: <Text style={{ fontWeight: '700' }}>{selectedCropName}</Text>
                  </Text>
                  <Text style={[styles.payloadItem, { color: theme.text }]}>
                    📷 Dimensions: <Text style={{ fontWeight: '700' }}>{selectedImage.width} x {selectedImage.height} px</Text>
                  </Text>
                  <Text style={[styles.payloadItem, { color: theme.text }]} numberOfLines={1}>
                    📁 File URI: <Text style={{ fontWeight: '600', fontSize: 12 }}>{selectedImage.uri}</Text>
                  </Text>
                </View>

                {/* PREPARATION ACTIONS */}
                <View style={styles.prepActions}>
                  <Pressable
                    onPress={handleResetScan}
                    style={({ pressed }) => [
                      styles.primaryActionButton,
                      { backgroundColor: theme.primary },
                      pressed && styles.pressedButton,
                    ]}
                    accessibilityLabel="Start a New Scan"
                    accessibilityRole="button">
                    <Text style={styles.primaryActionText}>↺ Start New Scan</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push('/crops')}
                    style={({ pressed }) => [
                      styles.secondaryActionButton,
                      { backgroundColor: theme.card, borderColor: theme.border },
                      pressed && styles.pressed,
                    ]}
                    accessibilityLabel="Return to My Crops"
                    accessibilityRole="button">
                    <Text style={[styles.secondaryActionText, { color: theme.text }]}>
                      View My Crops
                    </Text>
                  </Pressable>
                </View>
              </Card>
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
    gap: 4,
    paddingVertical: Spacing.one,
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

  /* CROP CONTEXT CARD */
  cropContextCard: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cropContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  cropContextEmoji: {
    fontSize: 22,
  },
  cropContextTextGroup: {
    flex: 1,
    gap: 2,
  },
  cropContextLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cropContextValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  cropSwitchRow: {
    marginTop: Spacing.one,
  },
  cropSwitchList: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cropChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 16,
    borderWidth: 1,
  },
  cropChipText: {
    fontSize: 13,
    fontWeight: '600',
  },

  /* STEPS CONTAINER */
  stepContainer: {
    gap: Spacing.three,
  },

  /* TIPS CARD */
  tipsCard: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tipsList: {
    gap: Spacing.two + 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  tipCheck: {
    fontSize: 16,
    fontWeight: '800',
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
  },

  /* ACTION BUTTONS */
  actionButtonsContainer: {
    gap: Spacing.two + 2,
    marginTop: Spacing.one,
  },
  primaryActionButton: {
    height: 52,
    borderRadius: Spacing.two + Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryActionButton: {
    height: 50,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionIcon: {
    fontSize: 18,
  },

  /* PREVIEW CARD */
  previewCard: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  previewHeaderRow: {
    gap: 4,
  },
  previewStatusTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  previewStatusSub: {
    fontSize: 13,
  },
  imageFrame: {
    width: '100%',
    height: 280,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },

  /* PREPARATION CARD */
  prepCard: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.four,
  },
  prepIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepEmoji: {
    fontSize: 34,
  },
  prepTextGroup: {
    alignItems: 'center',
    gap: 4,
  },
  prepTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  prepSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  payloadBox: {
    width: '100%',
    padding: Spacing.three,
    borderRadius: Spacing.two + 2,
    borderWidth: 1,
    gap: 6,
  },
  payloadLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  payloadItem: {
    fontSize: 13,
  },
  prepActions: {
    width: '100%',
    gap: Spacing.two + 2,
  },

  /* ERROR CARD */
  errorCard: {
    padding: Spacing.four,
    gap: Spacing.two,
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 28,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: 20,
    marginTop: Spacing.one,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
