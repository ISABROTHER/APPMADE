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
import { Apple, CheckSquare, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

type SignUpStep = 0 | 1;

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [step, setStep] = useState<SignUpStep>(0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  const blobA = useRef(new Animated.Value(0)).current;
  const blobB = useRef(new Animated.Value(0)).current;

  const emailFocus = useRef(new Animated.Value(0)).current;
  const passFocus = useRef(new Animated.Value(0)).current;
  const confirmFocus = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;

  const shakeX = useRef(new Animated.Value(0)).current;

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
    return `${Math.round((passwordScore / 5) * 100)}%`;
  }, [passwordScore]);

  const canContinue = useMemo(() => {
    if (loading) return false;
    return email.trim().length > 0;
  }, [email, loading]);

  const canCreateAccount = useMemo(() => {
    if (loading) return false;
    if (!email.trim()) return false;
    if (!password) return false;
    if (!confirmPassword) return false;
    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [confirmPassword, email, loading, password]);

  const animateFocus = (v: Animated.Value, to: number) => {
    Animated.timing(v, {
      toValue: to,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const shake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -1, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 1, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -1, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const setAndShakeError = (msg: string) => {
    setError(msg);
    shake();
  };

  const handleContinue = () => {
    if (!email.trim()) {
      setAndShakeError('Please enter your email');
      return;
    }
    setError(null);
    setStep(1);
  };

  const handleBack = () => {
    setError(null);
    setStep(0);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setAndShakeError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setAndShakeError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setAndShakeError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setAndShakeError(signUpError.message);
      setLoading(false);
      return;
    }

    router.replace('/(tabs)');
  };

  const handleSocialSignUp = (provider: 'apple' | 'google') => {
    setAndShakeError(
      provider === 'apple'
        ? 'Apple sign-up is not connected yet. Tell me your auth provider (e.g., Supabase/Firebase) and I will wire it.'
        : 'Google sign-up is not connected yet. Tell me your auth provider (e.g., Supabase/Firebase) and I will wire it.'
    );
  };

  const handleGuest = () => {
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
      {
        translateX: shakeX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-7, 0, 7],
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
      <View pointerEvents="none" style={styles.bg}>
        <Animated.View style={[styles.blob, styles.blobA, blobATransform]} />
        <Animated.View style={[styles.blob, styles.blobB, blobBTransform]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageMax}>
            <Animated.View style={[styles.header, headerStyle]}>
              <View style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <CheckSquare size={44} color="#0A84FF" />
                </View>
              </View>

              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Fast signup, clean flow</Text>

              <View style={styles.progressRow}>
                <View style={[styles.dot, step === 0 ? styles.dotActive : styles.dotInactive]} />
                <View style={[styles.dot, step === 1 ? styles.dotActive : styles.dotInactive, styles.dotSecond]} />
                <Text style={styles.progressText}>{step === 0 ? 'Step 1 of 2' : 'Step 2 of 2'}</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.card, formStyle]}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.socialRow}>
                <Pressable
                  onPress={() => handleSocialSignUp('apple')}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.socialBtn,
                    styles.socialBtnFirst,
                    pressed && !loading ? styles.socialBtnPressed : null,
                    loading ? styles.socialBtnDisabled : null,
                  ]}>
                  <Apple size={18} color="#111827" />
                  <Text style={styles.socialText}>Apple</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleSocialSignUp('google')}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.socialBtn,
                    pressed && !loading ? styles.socialBtnPressed : null,
                    loading ? styles.socialBtnDisabled : null,
                  ]}>
                  <View style={styles.googleBadge}>
                    <Text style={styles.googleBadgeText}>G</Text>
                  </View>
                  <Text style={styles.socialText}>Google</Text>
                </Pressable>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {step === 0 && (
                <>
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
                        onChangeText={(t) => {
                          setEmail(t);
                          if (error) setError(null);
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#9CA3AF"
                        onFocus={() => animateFocus(emailFocus, 1)}
                        onBlur={() => animateFocus(emailFocus, 0)}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          if (!loading) handleContinue();
                        }}
                      />
                    </View>
                    <Text style={styles.helperText}>We will never share your email.</Text>
                  </Animated.View>

                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                      onPress={handleContinue}
                      disabled={!canContinue}
                      onPressIn={onPressInButton}
                      onPressOut={onPressOutButton}
                      style={({ pressed }) => [
                        styles.button,
                        pressed && canContinue ? styles.buttonPressed : null,
                        !canContinue ? styles.buttonDisabled : null,
                      ]}>
                      <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>
                  </Animated.View>

                  <Pressable onPress={handleGuest} style={styles.ghostBtn} hitSlop={8}>
                    <Text style={styles.ghostText}>Continue as guest</Text>
                  </Pressable>
                </>
              )}

              {step === 1 && (
                <>
                  <View style={styles.stepHeaderRow}>
                    <Pressable onPress={handleBack} disabled={loading} hitSlop={10}>
                      <Text style={styles.backText}>Back</Text>
                    </Pressable>
                    <Text style={styles.stepHint}>Set a password</Text>
                    <View style={{ width: 44 }} />
                  </View>

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
                        onChangeText={(t) => {
                          setPassword(t);
                          if (error) setError(null);
                        }}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#9CA3AF"
                        onFocus={() => animateFocus(passFocus, 1)}
                        onBlur={() => animateFocus(passFocus, 0)}
                        editable={!loading}
                        returnKeyType="next"
                      />
                      <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.trailingIcon} hitSlop={10}>
                        {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                      </Pressable>
                    </View>

                    <View style={styles.strengthRow}>
                      <View style={styles.strengthTrack}>
                        <View style={[styles.strengthFill, { width: strengthWidth }]} />
                      </View>
                      <Text style={styles.strengthText}>{strengthLabel}</Text>
                    </View>
                  </Animated.View>

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
                        onChangeText={(t) => {
                          setConfirmPassword(t);
                          if (error) setError(null);
                        }}
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

                    {confirmPassword.length > 0 && (
                      <Text style={[styles.matchText, password === confirmPassword ? styles.matchOk : styles.matchBad]}>
                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                      </Text>
                    )}
                  </Animated.View>

                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                      onPress={handleSignUp}
                      disabled={!canCreateAccount}
                      onPressIn={onPressInButton}
                      onPressOut={onPressOutButton}
                      style={({ pressed }) => [
                        styles.button,
                        pressed && canCreateAccount ? styles.buttonPressed : null,
                        !canCreateAccount ? styles.buttonDisabled : null,
                      ]}>
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.buttonText}>Create account</Text>
                      )}
                    </Pressable>
                  </Animated.View>

                  <Pressable onPress={handleGuest} style={styles.ghostBtn} hitSlop={8}>
                    <Text style={styles.ghostText}>Continue as guest</Text>
                  </Pressable>
                </>
              )}

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable hitSlop={8}>
                    <Text style={styles.link}>Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F9FAFB' },
  blob: { position: 'absolute', width: 260, height: 260, borderRadius: 260 },
  blobA: { top: -80, left: -90, backgroundColor: '#D6E9FF' },
  blobB: { bottom: -90, right: -90, backgroundColor: '#E9D6FF' },

  scrollContent: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  pageMax: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  header: { alignItems: 'center', marginTop: 8, marginBottom: 14 },
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
  title: { fontSize: 30, fontWeight: '800', color: '#0B1220', letterSpacing: -0.2 },
  subtitle: { marginTop: 6, fontSize: 14, color: '#6B7280' },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 999 },
  dotSecond: { marginLeft: 8 },
  dotActive: { backgroundColor: '#0A84FF' },
  dotInactive: { backgroundColor: '#D1D5DB' },
  progressText: { marginLeft: 10, fontSize: 12, color: '#6B7280', fontWeight: '700' },

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
  errorText: { color: '#B42318', fontSize: 13, fontWeight: '600' },

  socialRow: { flexDirection: 'row' },
  socialBtn: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  socialBtnFirst: { marginRight: 10 },
  socialBtnPressed: { opacity: 0.92 },
  socialBtnDisabled: { opacity: 0.6 },
  socialText: { fontSize: 14, color: '#111827', fontWeight: '800', marginLeft: 8 },
  googleBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadgeText: { fontSize: 12, fontWeight: '900', color: '#111827' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 10, fontSize: 12, color: '#9CA3AF', fontWeight: '800' },

  fieldWrap: { marginBottom: 14 },
  fieldGlow: { ...StyleSheet.absoluteFillObject, borderRadius: 14, backgroundColor: 'rgba(10,132,255,0.10)' },
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
  fieldIcon: { width: 28, alignItems: 'flex-start' },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#0B1220' },
  trailingIcon: { paddingLeft: 8, paddingVertical: 10 },

  helperText: { marginTop: 8, fontSize: 12, color: '#6B7280', fontWeight: '600', paddingHorizontal: 2 },

  stepHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  backText: { fontSize: 13, fontWeight: '900', color: '#0A84FF', paddingVertical: 6, paddingHorizontal: 6 },
  stepHint: { fontSize: 13, fontWeight: '900', color: '#111827' },

  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 2 },
  strengthTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 999, backgroundColor: '#0A84FF' },
  strengthText: { marginLeft: 10, fontSize: 12, color: '#6B7280', fontWeight: '800', width: 92, textAlign: 'right' },

  matchText: { marginTop: 8, fontSize: 12, fontWeight: '800', paddingHorizontal: 2 },
  matchOk: { color: '#067647' },
  matchBad: { color: '#B42318' },

  button: {
    backgroundColor: '#0A84FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  buttonPressed: { opacity: 0.92 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.2 },

  ghostBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 10 },
  ghostText: { fontSize: 13, fontWeight: '900', color: '#111827', opacity: 0.75 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingBottom: 2 },
  footerText: { fontSize: 14, color: '#6B7280' },
  link: { fontSize: 14, color: '#0A84FF', fontWeight: '900' },
});
