import React, { useEffect, useRef, useState } from 'react';
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
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#EEF1F4';
const CARD = '#FFFFFF';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const BORDER = '#E6E9EE';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // "Remember me" is UI-only for now; wire to secure storage if you want later.
    router.replace('/(tabs)');
  };

  const pageAnimStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  } as const;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          <Animated.View style={[styles.phoneCard, pageAnimStyle]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
              <ChevronLeft size={18} color={TEXT} />
            </Pressable>

            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>
              Enter your email and password to securely access{'\n'}your account and manage your services.
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.inputPill}>
              <View style={styles.leftIcon}>
                <Mail size={18} color={MUTED} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={MUTED}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError(null);
                }}
                editable={!loading}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputPill}>
              <View style={styles.leftIcon}>
                <Lock size={18} color={MUTED} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={MUTED}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (!loading) void handleSignIn();
                }}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.rightIcon} hitSlop={10}>
                {showPassword ? <EyeOff size={18} color={MUTED} /> : <Eye size={18} color={MUTED} />}
              </Pressable>
            </View>

            {/* Remember / Forgot */}
            <View style={styles.rowBetween}>
              <Pressable
                onPress={() => setRememberMe((v) => !v)}
                style={styles.rememberRow}
                hitSlop={8}>
                <View style={[styles.checkbox, rememberMe ? styles.checkboxOn : null]}>
                  {rememberMe ? <View style={styles.checkboxDot} /> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Link href="/(auth)/forgot-password" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.forgotText}>Forgot Password</Text>
                </Pressable>
              </Link>
            </View>

            {/* Button */}
            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && !loading ? styles.primaryBtnPressed : null,
                loading ? styles.primaryBtnDisabled : null,
              ]}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryBtnText}>Login</Text>}
            </Pressable>

            {/* Switch */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don’t have an account? </Text>
              <Link href="/(auth)/signup" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.switchLink}>Sign Up here</Text>
                </Pressable>
              </Link>
            </View>

            {/* Divider */}
            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or Continue With Account</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <Pressable
                onPress={() => setError('Facebook sign-in is not connected yet.')}
                style={[styles.socialBtn, styles.socialBtnFirst]}
                hitSlop={8}>
                <Text style={styles.socialLetter}>f</Text>
              </Pressable>

              <Pressable onPress={() => setError('Google sign-in is not connected yet.')} style={styles.socialBtn} hitSlop={8}>
                <Text style={styles.socialLetter}>G</Text>
              </Pressable>

              <Pressable
                onPress={() => setError('Apple sign-in is not connected yet.')}
                style={[styles.socialBtn, styles.socialBtnLast]}
                hitSlop={8}>
                <Text style={styles.socialLetter}></Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: BG },

  scroll: {
    padding: 22,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  phoneCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: CARD,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },

  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: TEXT,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
    textAlign: 'center',
  },

  errorBox: {
    backgroundColor: '#FFECEC',
    borderWidth: 1,
    borderColor: '#FFD1D1',
    padding: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  errorText: { color: '#B42318', fontSize: 12, fontWeight: '700' },

  inputPill: {
    height: 52,
    borderRadius: 999,
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#EEF1F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  leftIcon: { width: 26, alignItems: 'flex-start' },
  rightIcon: { paddingLeft: 10, paddingVertical: 8 },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
    paddingVertical: 10,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 14,
  },

  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C9D2DC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxOn: {
    borderColor: GREEN,
    backgroundColor: '#E8F7F0',
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: GREEN,
  },
  rememberText: { fontSize: 12, color: TEXT, fontWeight: '700' },
  forgotText: { fontSize: 12, color: TEXT, fontWeight: '800' },

  primaryBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
    marginTop: 2,
  },
  primaryBtnPressed: { opacity: 0.92 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  switchText: { fontSize: 12.5, color: MUTED, fontWeight: '700' },
  switchLink: { fontSize: 12.5, color: GREEN, fontWeight: '900' },

  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E6E9EE' },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11.5,
    color: MUTED,
    fontWeight: '800',
    textAlign: 'center',
  },

  socialRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnFirst: { marginRight: 14 },
  socialBtnLast: { marginLeft: 14 },
  socialLetter: { fontSize: 16, fontWeight: '900', color: TEXT },
});
