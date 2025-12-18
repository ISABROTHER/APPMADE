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
import { router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#E9EDF2';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const enter = useRef(new Animated.Value(0)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatA, { toValue: 0, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, { toValue: 1, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatB, { toValue: 0, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    loopA.start();
    loopB.start();

    return () => {
      loopA.stop();
      loopB.stop();
    };
  }, [enter, floatA, floatB]);

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

    router.replace('/(tabs)');
  };

  const pageAnimStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
      },
    ],
  } as const;

  const blobAStyle = {
    transform: [
      { translateX: floatA.interpolate({ inputRange: [0, 1], outputRange: [-18, 26] }) },
      { translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [-10, 18] }) },
      { scale: floatA.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
    ],
    opacity: floatA.interpolate({ inputRange: [0, 1], outputRange: [0.38, 0.56] }),
  } as const;

  const blobBStyle = {
    transform: [
      { translateX: floatB.interpolate({ inputRange: [0, 1], outputRange: [22, -22] }) },
      { translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [18, -14] }) },
      { scale: floatB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) },
    ],
    opacity: floatB.interpolate({ inputRange: [0, 1], outputRange: [0.30, 0.46] }),
  } as const;

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.bg}>
        <Animated.View style={[styles.blob, styles.blobA, blobAStyle]} />
        <Animated.View style={[styles.blob, styles.blobB, blobBStyle]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          <View style={styles.stage}>
            <Animated.View style={[styles.glassCard, pageAnimStyle]}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
                <ChevronLeft size={18} color={TEXT} />
              </Pressable>

              <Text style={styles.title}>Log in</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <Mail size={18} color={MUTED} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="rgba(107,114,128,0.85)"
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

              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <Lock size={18} color={MUTED} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(107,114,128,0.85)"
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

              <View style={styles.rowBetween}>
                <Pressable onPress={() => setRememberMe((v) => !v)} style={styles.rememberRow} hitSlop={8}>
                  <View style={[styles.checkbox, rememberMe ? styles.checkboxOn : null]}>
                    {rememberMe ? <View style={styles.checkboxDot} /> : null}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </Pressable>

                {/* Keep navigation simple: use back button for now */}
              </View>

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

              <View pointerEvents="none" style={styles.edgeHighlight} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: BG },

  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: BG },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 320 },
  blobA: { top: -120, left: -120, backgroundColor: 'rgba(52,182,122,0.22)' },
  blobB: { bottom: -140, right: -120, backgroundColor: 'rgba(59,130,246,0.18)' },

  scroll: { paddingHorizontal: 18, paddingTop: 26, paddingBottom: 26 },
  stage: { width: '100%', maxWidth: 420, alignSelf: 'center', justifyContent: 'center', minHeight: 620 },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#0B1220',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 3,
    overflow: 'hidden',
  },
  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: { fontSize: 30, fontWeight: '900', color: TEXT, textAlign: 'center', marginTop: 2, letterSpacing: -0.2 },
  subtitle: { marginTop: 6, marginBottom: 16, fontSize: 13, lineHeight: 18, color: 'rgba(107,114,128,0.95)', textAlign: 'center', fontWeight: '700' },

  errorBox: {
    backgroundColor: 'rgba(255,236,236,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,209,0.9)',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  errorText: { color: '#B42318', fontSize: 12, fontWeight: '800' },

  inputPill: {
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(246,247,249,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  leftIcon: { width: 26, alignItems: 'flex-start' },
  rightIcon: { paddingLeft: 10, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, color: TEXT, paddingVertical: 10 },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 14 },

  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(201,210,220,0.9)',
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxOn: { borderColor: 'rgba(52,182,122,0.9)', backgroundColor: 'rgba(232,247,240,0.8)' },
  checkboxDot: { width: 8, height: 8, borderRadius: 3, backgroundColor: GREEN },
  rememberText: { fontSize: 12, color: TEXT, fontWeight: '800' },

  primaryBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B1220',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginTop: 2,
  },
  primaryBtnPressed: { opacity: 0.92 },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },
});
