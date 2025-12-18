import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#E9EDF2';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

const TRACK_HEIGHT = 56;
const THUMB_SIZE = 46;

// Prevent accidental swipes: user must hold this long before drag is accepted
const MIN_HOLD_MS = 260;

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  // Entrance + background motion
  const enter = useRef(new Animated.Value(0)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;

  // Slider state
  const dragX = useRef(new Animated.Value(0)).current;
  const trackW = useRef(0);
  const [maxX, setMaxX] = useState(0);
  const dragStartX = useRef(0);

  // Hold-to-arm state
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holding = useRef(false);
  const holdArmed = useRef(false);

  // Micro-animations
  const hint = useRef(new Animated.Value(0)).current;
  const holdGlow = useRef(new Animated.Value(0)).current;

  const canAttemptLogin = useMemo(() => {
    if (loading || locked) return false;
    if (!email.trim()) return false;
    if (!password) return false;
    return true;
  }, [email, loading, locked, password]);

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

    // Subtle hint shimmer
    const hintLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hint, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(hint, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    loopA.start();
    loopB.start();
    hintLoop.start();

    return () => {
      loopA.stop();
      loopB.stop();
      hintLoop.stop();
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [enter, floatA, floatB, hint]);

  const resetSlider = (animated = true) => {
    setLocked(false);
    holding.current = false;
    holdArmed.current = false;
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    Animated.timing(holdGlow, { toValue: 0, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();

    if (animated) {
      Animated.spring(dragX, { toValue: 0, useNativeDriver: true, friction: 8, tension: 60 }).start();
    } else {
      dragX.setValue(0);
    }
    dragStartX.current = 0;
  };

  const animateHoldGlow = (to: number) => {
    Animated.timing(holdGlow, {
      toValue: to,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const validate = () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return false;
    }
    return true;
  };

  const animateSuccessAndNavigate = () => {
    Vibration.vibrate(18);

    Animated.timing(enter, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      router.replace('/(tabs)');
    });
  };

  const submitLogin = async () => {
    if (loading) return;

    setError(null);

    if (!validate()) {
      setLoading(false);
      resetSlider(true);
      return;
    }

    setLoading(true);
    setLocked(true);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      resetSlider(true);
      return;
    }

    setLoading(false);
    animateSuccessAndNavigate();
  };

  const onTrackLayout = (w: number) => {
    trackW.current = w;
    const computedMax = Math.max(0, w - THUMB_SIZE - 6); // matches track padding
    setMaxX(computedMax);

    dragX.stopAnimation((v) => {
      const current = typeof v === 'number' ? v : 0;
      if (current > computedMax) dragX.setValue(computedMax);
    });
  };

  const armHold = () => {
    holding.current = true;
    holdArmed.current = false;

    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => {
      if (!holding.current) return;
      holdArmed.current = true;
      animateHoldGlow(1);
      // subtle confirmation that hold is accepted
      Vibration.vibrate(10);
    }, MIN_HOLD_MS);
  };

  const disarmHold = () => {
    holding.current = false;
    holdArmed.current = false;

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    animateHoldGlow(0);
  };

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !loading && !locked,
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        if (loading || locked) return false;
        // user can start moving, but movement will only apply after holdArmed is true
        return Math.abs(gesture.dx) > 4 && Math.abs(gesture.dy) < 12;
      },
      onPanResponderGrant: () => {
        if (loading || locked) return;

        setError(null);

        dragX.stopAnimation((v) => {
          dragStartX.current = typeof v === 'number' ? v : 0;
        });

        armHold();
      },
      onPanResponderMove: (_evt, gesture) => {
        if (loading || locked) return;

        // Require minimum hold before any drag is accepted
        if (!holdArmed.current) {
          dragX.setValue(0);
          return;
        }

        const raw = dragStartX.current + gesture.dx;
        const clamped = Math.max(0, Math.min(maxX, raw));
        dragX.setValue(clamped);
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (loading || locked) return;

        const releasedAt = dragStartX.current + gesture.dx;
        const reachedEdge = releasedAt >= maxX - 2; // tolerant end snap

        disarmHold();

        if (!holdArmed.current) {
          // Hold never armed; always snap back
          resetSlider(true);
          return;
        }

        if (reachedEdge) {
          // Must reach 100% while holding; only then submit
          Animated.timing(dragX, {
            toValue: maxX,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            void submitLogin();
          });
          return;
        }

        // Partial swipe: snap back
        resetSlider(true);
      },
      onPanResponderTerminate: () => {
        if (loading || locked) return;
        disarmHold();
        resetSlider(true);
      },
    });
  }, [dragX, loading, locked, maxX, holdGlow]);

  const pageAnimStyle = {
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
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
    opacity: floatB.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.46] }),
  } as const;

  const fillWidth = dragX.interpolate({
    inputRange: [0, Math.max(1, maxX)],
    outputRange: [THUMB_SIZE, Math.max(THUMB_SIZE, trackW.current)],
    extrapolate: 'clamp',
  });

  const hintOpacity = hint.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const hintTranslate = hint.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });

  const holdGlowOpacity = holdGlow.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const holdGlowScale = holdGlow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

  // Accessible fallback: long-press to confirm intent (non-swipe)
  const onLongPressLogin = () => {
    if (loading || locked) return;
    setError(null);

    if (!validate()) {
      resetSlider(true);
      return;
    }

    // mimic reaching edge then load
    Animated.timing(dragX, {
      toValue: maxX,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      void submitLogin();
    });
  };

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
              <Pressable
                onPress={() => router.back()}
                style={styles.backBtn}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ChevronLeft size={18} color={TEXT} />
              </Pressable>

              <Text style={styles.title}>Log in</Text>

              {error ? (
                <View style={styles.errorBox} accessibilityLiveRegion="polite">
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
                    if (!loading && !locked) resetSlider(false);
                  }}
                  editable={!loading && !locked}
                  returnKeyType="next"
                  accessibilityLabel="Email address"
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
                    if (!loading && !locked) resetSlider(false);
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading && !locked}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    // keyboard-friendly intent: long-press fallback is the primary accessible alternative
                    // here we keep submit from keyboard as a “confirm” equivalent
                    onLongPressLogin();
                  }}
                  accessibilityLabel="Password"
                />
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.rightIcon}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} color={MUTED} /> : <Eye size={18} color={MUTED} />}
                </Pressable>
              </View>

              {/* Hold-and-swipe to login */}
              <View style={styles.swipeWrap}>
                <View
                  onLayout={(e) => onTrackLayout(e.nativeEvent.layout.width)}
                  style={[styles.swipeTrack, (!canAttemptLogin || locked) ? styles.swipeTrackDisabled : null]}
                  accessible
                  accessibilityRole="adjustable"
                  accessibilityLabel="Hold and swipe to the edge to log in"
                  accessibilityHint="Press and hold the handle briefly, then drag it all the way to the right to log in"
                >
                  {/* Progress fill */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.swipeFill,
                      {
                        width: fillWidth,
                        opacity: loading ? 0.95 : 0.7,
                      },
                    ]}
                  />

                  {/* Label + hint */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.swipeLabelRow,
                      {
                        opacity: loading ? 0.55 : hintOpacity,
                        transform: [{ translateX: loading ? 0 : hintTranslate }],
                      },
                    ]}
                  >
                    <Text style={styles.swipeLabel}>Hold &amp; swipe to the edge to log in</Text>
                    <ChevronRight size={16} color={canAttemptLogin ? TEXT : 'rgba(11,18,32,0.35)'} />
                  </Animated.View>

                  {/* Hold glow (appears after min hold arms) */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.holdGlow,
                      {
                        opacity: holdGlowOpacity,
                        transform: [{ scale: holdGlowScale }],
                      },
                    ]}
                  />

                  {/* Thumb */}
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      styles.swipeThumb,
                      locked ? styles.thumbLocked : null,
                      {
                        transform: [{ translateX: dragX }],
                      },
                    ]}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    {loading ? <ActivityIndicator color={TEXT} /> : <ChevronRight size={18} color={TEXT} />}
                  </Animated.View>
                </View>

                {/* Accessible fallback (non-swipe): long-press intent */}
                <Pressable
                  onLongPress={onLongPressLogin}
                  delayLongPress={1000}
                  disabled={loading || locked}
                  accessibilityRole="button"
                  accessibilityLabel="Press and hold to log in"
                  accessibilityHint="Press and hold for one second to log in without swiping"
                  style={({ pressed }) => [
                    styles.fallbackBtn,
                    pressed && !(loading || locked) ? styles.fallbackPressed : null,
                    (loading || locked) ? styles.fallbackDisabled : null,
                  ]}
                >
                  <Text style={styles.fallbackText}>Press and hold Enter for 1s to log in</Text>
                </Pressable>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don’t have an account? </Text>
                <Link href="/(auth)/signup" asChild>
                  <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Go to sign up">
                    <Text style={styles.switchLink}>Sign Up</Text>
                  </Pressable>
                </Link>
              </View>

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
  stage: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: 640,
  },

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

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: TEXT,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.2,
  },

  errorBox: {
    backgroundColor: 'rgba(255,236,236,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,209,0.9)',
    padding: 10,
    borderRadius: 16,
    marginTop: 14,
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
    marginTop: 12,
  },
  leftIcon: { width: 26, alignItems: 'flex-start' },
  rightIcon: { paddingLeft: 10, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, color: TEXT, paddingVertical: 10 },

  swipeWrap: { marginTop: 16 },

  swipeTrack: {
    height: TRACK_HEIGHT,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  swipeTrackDisabled: { opacity: 0.6 },

  swipeFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(52,182,122,0.30)',
  },

  swipeLabelRow: {
    position: 'absolute',
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: TEXT,
    marginRight: 8,
    letterSpacing: 0.1,
  },

  holdGlow: {
    position: 'absolute',
    left: 8,
    top: 8,
    bottom: 8,
    width: 74,
    borderRadius: 999,
    backgroundColor: 'rgba(52,182,122,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.22)',
  },

  swipeThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B1220',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  thumbLocked: {
    opacity: 0.9,
  },

  fallbackBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.40)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  fallbackPressed: { opacity: 0.9 },
  fallbackDisabled: { opacity: 0.6 },
  fallbackText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(11,18,32,0.78)',
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: { fontSize: 12.5, color: 'rgba(107,114,128,0.95)', fontWeight: '800' },
  switchLink: { fontSize: 12.5, color: GREEN, fontWeight: '900' },
});
