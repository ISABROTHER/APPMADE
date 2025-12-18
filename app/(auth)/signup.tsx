import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { CheckSquare, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Entrance animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  // Background “blob” animations
  const blobA = useRef(new Animated.Value(0)).current;
  const blobB = useRef(new Animated.Value(0)).current;

  // Focus micro-interactions
  const emailFocus = useRef(new Animated.Value(0)).current;
  const passFocus = useRef(new Animated.Value(0)).current;
  const confirmFocus = useRef(new Animated.Value(0)).current;

  // Button press micro-interaction
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 650,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(blobA, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blobA, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(blobB, {
          toValue: 1,
          duration: 6200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blobB, {
          toValue: 0,
          duration: 6200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    loopA.start();
    loopB.start();

    return () => {
      loopA.stop();
      loopB.stop();
    };
  }, [blobA, blobB, formAnim, headerAnim]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 5);
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return 'Enter a password';
    if (passwordScore <= 1) return 'Weak';
    if (passwordScore === 2) return 'Fair';
    if (passwordScore === 3) return 'Good';
    if (passwordScore === 4) return 'Strong';
    return 'Very strong';
  }, [password, passwordScore]);

  const strengthWidth = useMemo(() => {
    // 0..5 -> 0..100
    return `${Math.round((passwordScore / 5) * 100)}%`;
  }, [passwordScore]);

  const animateFocus = (v: Animated.Value, to: number) => {
    Animated.timing(v, {
      toValue: to,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.replace('/(tabs)');
  };

  const blobATransform = {
    transform: [
      {
        translateX: blobA.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 30],
        }),
      },
      {
        translateY: blobA.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 25],
        }),
      },
      {
        scale: blobA.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.15],
        }),
      },
    ],
    opacity: blobA.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.55],
    }),
  } as const;

  const blobBTransform = {
    transform: [
      {
        translateX: blobB.interpolate({
          inputRange: [0, 1],
          outputRange: [25, -25],
        }),
      },
      {
        translateY: blobB.interpolate({
          inputRange: [0, 1],
          outputRange: [20, -15],
        }),
      },
      {
        scale: blobB.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.18],
        }),
      },
    ],
    opacity: blobB.interpolate({
      inputRange: [0, 1],
      outputRange: [0.25, 0.45],
    }),
  } as const;

  const headerStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  } as const;

  const formStyle = {
    opacity: formAnim,
    transform: [
      {
        translateY: formAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  } as const;

  const makeFieldAnimatedStyle = (focusV: Animated.Value) =>
    ({
      transform: [
        {
          scale: focusV.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.01],
          }),
        },
      ],
    }) as const;

  const makeGlowAnimatedStyle = (focusV: Animated.Value) =>
    ({
      opacity: focusV.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }) as const;

  const onPressInButton = () => {
    Animated.timing(buttonScale, {
      toValue: 0.98,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const onPressOutButton = () => {
    Animated.timing(buttonScale, {
      toValue: 1,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated background */}
      <View pointerEvents="none" style={styles.bg}>
        <Animated.View style={[styles.blob, styles.blobA, blobATransform]} />
        <Animated.View style={[styles.blob, styles.blobB, blobBTransform]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <CheckSquare size={44} color="#0A84FF" />
              </View>
            </View>

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join in under a minute</Text>
          </Animated.View>

          <Animated.View style={[styles.card, formStyle]}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <Animated.View style={[styles.fieldWrap, makeFieldAnimatedStyle(emailFocus)]}>
              <Animated.View style={[styles.fieldGlow, makeGlowAnimatedStyle(emailFocus)]} />
              <View style={styles.field}>
                <View style={styles.fieldIcon}>
                  <Mail size={18} color="#6B7280" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => animateFocus(emailFocus, 1)}
                  onBlur={() => animateFocus(emailFocus, 0)}
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>
            </Animated.View>

            {/* Password */}
            <Animated.View style={[styles.fieldWrap, makeFieldAnimatedStyle(passFocus)]}>
              <Animated.View style={[styles.fieldGlow, makeGlowAnimatedStyle(passFocus)]} />
              <View style={styles.field}>
                <View style={styles.fieldIcon}>
                  <Lock size={18} color="#6B7280" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => animateFocus(passFocus, 1)}
                  onBlur={() => animateFocus(passFocus, 0)}
                  editable={!loading}
                  returnKeyType="next"
                />
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.trailingIcon}
                  hitSlop={10}>
                  {showPassword ? (
                    <EyeOff size={18} color="#6B7280" />
                  ) : (
                    <Eye size={18} color="#6B7280" />
                  )}
                </Pressable>
              </View>

              <View style={styles.strengthRow}>
                <View style={styles.strengthTrack}>
                  <View style={[styles.strengthFill, { width: strengthWidth }]} />
                </View>
                <Text style={styles.strengthText}>{strengthLabel}</Text>
              </View>
            </Animated.View>

            {/* Confirm Password */}
            <Animated.View style={[styles.fieldWrap, makeFieldAnimatedStyle(confirmFocus)]}>
              <Animated.View style={[styles.fieldGlow, makeGlowAnimatedStyle(confirmFocus)]} />
              <View style={styles.field}>
                <View style={styles.fieldIcon}>
                  <Lock size={18} color="#6B7280" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => animateFocus(confirmFocus, 1)}
                  onBlur={() => animateFocus(confirmFocus, 0)}
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (!loading) void handleSignUp();
                  }}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword((s) => !s)}
                  style={styles.trailingIcon}
                  hitSlop={10}>
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="#6B7280" />
                  ) : (
                    <Eye size={18} color="#6B7280" />
                  )}
                </Pressable>
              </View>
            </Animated.View>

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                onPress={handleSignUp}
                disabled={loading}
                onPressIn={onPressInButton}
                onPressOut={onPressOutButton}
                style={({ pressed }) => [
                  styles.button,
                  pressed && !loading ? styles.buttonPressed : null,
                  loading ? styles.buttonDisabled : null,
                ]}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Create account</Text>
                )}
              </Pressable>
            </Animated.View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.link}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Background
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F9FAFB',
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
  },
  blobA: {
    top: -80,
    left: -90,
    backgroundColor: '#D6E9FF',
  },
  blobB: {
    bottom: -90,
    right: -90,
    backgroundColor: '#E9D6FF',
  },

  scrollContent: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },

  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  logoRing: {
    width: 82,
    height: 82,
    borderRadius: 82,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoInner: {
    width: 62,
    height: 62,
    borderRadius: 62,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0B1220',
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '600',
  },

  // Fields
  fieldWrap: {
    marginBottom: 14,
  },
  fieldGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    backgroundColor: 'rgba(10,132,255,0.10)',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    minHeight: 54,
  },
  fieldIcon: {
    width: 28,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0B1220',
  },
  trailingIcon: {
    paddingLeft: 8,
    paddingVertical: 10,
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  strengthTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#EEF2F7',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#0A84FF',
  },
  strengthText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
    width: 88,
    textAlign: 'right',
  },

  // Button
  button: {
    backgroundColor: '#0A84FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 2,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  link: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '800',
  },
});
