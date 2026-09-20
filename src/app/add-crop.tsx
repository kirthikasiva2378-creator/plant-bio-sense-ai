import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCrops } from '@/context/crops-context';
import { useTheme } from '@/hooks/use-theme';

const GROWING_TYPES = [
  'Home Garden',
  'Terrace Garden',
  'Farm',
  'Greenhouse',
] as const;

export default function AddCropScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addCrop } = useCrops();

  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [growingType, setGrowingType] = useState<string>('Home Garden');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = () => {
    if (!cropName.trim()) {
      setErrorMsg('Please enter a crop name.');
      return;
    }

    setErrorMsg('');
    addCrop({
      name: cropName,
      variety,
      growingType,
    });

    router.replace('/crops');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            
            {/* NAV HEADER */}
            <View style={styles.navHeader}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                accessibilityLabel="Cancel and return"
                accessibilityRole="button">
                <Text style={[styles.closeText, { color: theme.textSecondary }]}>
                  ✕ Cancel
                </Text>
              </Pressable>
            </View>

            {/* SCREEN TITLE */}
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: theme.text }]}>
                Add New Crop
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Register a new plant to monitor its health and risk status.
              </Text>
            </View>

            {/* FORM CARD */}
            <Card style={styles.formCard}>
              {/* FIELD 1: CROP NAME */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Crop Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: errorMsg ? '#D32F2F' : theme.border,
                    },
                  ]}
                  placeholder="e.g. Tomato, Chilli, Cucumber"
                  placeholderTextColor={theme.textSecondary}
                  value={cropName}
                  onChangeText={(text) => {
                    setCropName(text);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoCapitalize="words"
                  autoFocus
                />
                {!!errorMsg && (
                  <Text style={styles.errorText}>
                    ⚠️ {errorMsg}
                  </Text>
                )}
              </View>

              {/* FIELD 2: VARIETY */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Crop Variety <Text style={[styles.optionalTag, { color: theme.textSecondary }]}>
                    (Optional)
                  </Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="e.g. Roma, Cherry, Guntur Red"
                  placeholderTextColor={theme.textSecondary}
                  value={variety}
                  onChangeText={setVariety}
                  autoCapitalize="words"
                />
              </View>

              {/* FIELD 3: GROWING LOCATION */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Growing Location / Type
                </Text>
                <View style={styles.chipGrid}>
                  {GROWING_TYPES.map((type) => {
                    const isSelected = growingType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setGrowingType(type)}
                        style={[
                          styles.chip,
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
                            styles.chipText,
                            {
                              color: isSelected ? '#FFFFFF' : theme.text,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}>
                          {isSelected ? '✓ ' : ''}{type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* SUBMIT BUTTON */}
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressedButton,
                ]}
                accessibilityLabel="Save and Add Crop"
                accessibilityRole="button">
                <Text style={styles.submitButtonText}>+ Add Crop</Text>
              </Pressable>
            </Card>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
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
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: Spacing.one,
  },
  closeButton: {
    paddingVertical: Spacing.one,
    paddingRight: Spacing.three,
    minHeight: 44,
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
  },

  /* TITLE SECTION */
  titleSection: {
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  /* FORM CARD */
  formCard: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  requiredStar: {
    color: '#D32F2F',
  },
  optionalTag: {
    fontWeight: '400',
    fontSize: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },

  /* CHIPS */
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: Spacing.two + Spacing.one,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
  },

  /* BUTTON */
  submitButton: {
    height: 52,
    borderRadius: Spacing.two + Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
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
