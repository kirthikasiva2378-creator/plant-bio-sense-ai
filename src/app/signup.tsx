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
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation does not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validateForm()) {
      await signup(fullName, email);
      router.replace('/');
    }
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
            
            {/* HEADER */}
            <View style={styles.titleSection}>
              <Text style={[styles.brandBadge, { color: theme.primary }]}>
                🌱 Plant BioSense AI
              </Text>
              <Text style={[styles.title, { color: theme.text }]}>
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Register to monitor your crops and receive AI health diagnosis.
              </Text>
            </View>

            {/* FORM CARD */}
            <Card style={styles.formCard}>
              {/* FULL NAME */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Full Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: errors.fullName ? '#D32F2F' : theme.border,
                    },
                  ]}
                  placeholder="e.g. Viveka Sharma"
                  placeholderTextColor={theme.textSecondary}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  autoCapitalize="words"
                />
                {!!errors.fullName && (
                  <Text style={styles.errorText}>⚠️ {errors.fullName}</Text>
                )}
              </View>

              {/* EMAIL */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Email Address <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: errors.email ? '#D32F2F' : theme.border,
                    },
                  ]}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {!!errors.email && (
                  <Text style={styles.errorText}>⚠️ {errors.email}</Text>
                )}
              </View>

              {/* PASSWORD */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Password <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: errors.password ? '#D32F2F' : theme.border,
                    },
                  ]}
                  placeholder="At least 6 characters"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  secureTextEntry
                />
                {!!errors.password && (
                  <Text style={styles.errorText}>⚠️ {errors.password}</Text>
                )}
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: theme.text }]}>
                  Confirm Password <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: errors.confirmPassword ? '#D32F2F' : theme.border,
                    },
                  ]}
                  placeholder="Re-enter password"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  secureTextEntry
                />
                {!!errors.confirmPassword && (
                  <Text style={styles.errorText}>⚠️ {errors.confirmPassword}</Text>
                )}
              </View>

              {/* SUBMIT BUTTON */}
              <Pressable
                onPress={handleSignup}
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressedButton,
                ]}
                accessibilityLabel="Create Account"
                accessibilityRole="button">
                <Text style={styles.submitButtonText}>Create Account</Text>
              </Pressable>

              {/* LINK TO LOGIN */}
              <Pressable
                onPress={() => router.push('/login')}
                style={({ pressed }) => [
                  styles.linkContainer,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                  Already have an account?{' '}
                  <Text style={{ color: theme.secondary, fontWeight: '700' }}>
                    Sign In
                  </Text>
                </Text>
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
    flexGrow: 1,
    paddingVertical: Spacing.four,
  },
  contentContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },

  /* TITLE */
  titleSection: {
    gap: 4,
  },
  brandBadge: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    gap: Spacing.one + 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  requiredStar: {
    color: '#D32F2F',
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

  /* BUTTON & LINKS */
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
  linkContainer: {
    paddingVertical: Spacing.one,
    alignItems: 'center',
  },
  linkText: {
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
