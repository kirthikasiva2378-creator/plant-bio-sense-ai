import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LandingScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Animation values
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          
          {/* BRANDING ANIMATED HERO */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: logoFade,
                transform: [{ scale: logoScale }],
              },
            ]}>
            <View style={[styles.logoBadge, { backgroundColor: theme.softGreen }]}>
              <Text style={styles.logoEmoji}>🌱</Text>
            </View>

            <Text style={[styles.brandTitle, { color: theme.primary }]}>
              Plant BioSense AI
            </Text>

            <Text style={[styles.tagline, { color: theme.text }]}>
              Smarter Crop Health,{'\n'}Better Growing.
            </Text>
          </Animated.View>

          {/* CONTENT CARD */}
          <Animated.View style={{ opacity: contentFade, width: '100%' }}>
            <Card style={styles.contentCard}>
              <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
                Identify plant health problems, monitor your crops, and make better growing decisions with AI-powered visual diagnosis.
              </Text>

              {/* FEATURES HIGHLIGHTS */}
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={[styles.featureIcon, { color: theme.secondary }]}>✓</Text>
                  <Text style={[styles.featureText, { color: theme.text }]}>
                    Instant Crop Disease Risk Scanning
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={[styles.featureIcon, { color: theme.secondary }]}>✓</Text>
                  <Text style={[styles.featureText, { color: theme.text }]}>
                    Multi-Crop Inventory Health Monitoring
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <Text style={[styles.featureIcon, { color: theme.secondary }]}>✓</Text>
                  <Text style={[styles.featureText, { color: theme.text }]}>
                    Simple, Accessible Mobile Experience
                  </Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.actionContainer}>
                <Pressable
                  onPress={() => router.push('/signup')}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    { backgroundColor: theme.primary },
                    pressed && styles.pressedButton,
                  ]}
                  accessibilityLabel="Get Started"
                  accessibilityRole="button">
                  <Text style={styles.primaryButtonText}>Get Started →</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/login')}
                  style={({ pressed }) => [
                    styles.secondaryLink,
                    pressed && styles.pressed,
                  ]}
                  accessibilityLabel="Already have an account? Sign In"
                  accessibilityRole="button">
                  <Text style={[styles.secondaryLinkText, { color: theme.textSecondary }]}>
                    Already have an account?{' '}
                    <Text style={{ color: theme.secondary, fontWeight: '700' }}>
                      Sign In
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </Card>
          </Animated.View>

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
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.four,
  },
  contentContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.five,
  },

  /* HERO */
  heroSection: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  logoEmoji: {
    fontSize: 40,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
  },

  /* CARD & CONTENT */
  contentCard: {
    padding: Spacing.four + 2,
    gap: Spacing.four,
    width: '100%',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  featuresList: {
    gap: Spacing.two + 2,
    paddingVertical: Spacing.one,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  featureIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* ACTIONS */
  actionContainer: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  primaryButton: {
    height: 52,
    borderRadius: Spacing.two + Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryLink: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  secondaryLinkText: {
    fontSize: 14,
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
