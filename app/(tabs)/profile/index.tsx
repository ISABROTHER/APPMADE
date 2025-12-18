import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { ChevronRight, LogOut, Mail, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#E9EDF2';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

function maskId(id: string) {
  if (!id) return '•••• ••••';
  const tail = id.replace(/-/g, '').slice(-6).toUpperCase();
  return `•••• ${tail.slice(0, 3)} ${tail.slice(3)}`;
}

function getDisplayName(email?: string | null) {
  if (!email) return 'User';
  const namePart = email.split('@')[0] ?? 'User';
  const cleaned = namePart.replace(/[._-]+/g, ' ').trim();
  const words = cleaned.split(' ').filter(Boolean);
  const title = words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return title || 'User';
}

function FauxQr() {
  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let i = 0; i < 11 * 11; i += 1) {
      const v = (i * 7 + Math.floor(i / 3) * 11) % 17;
      out.push(v % 3 === 0 || v % 5 === 0);
    }
    return out;
  }, []);

  return (
    <View style={styles.qrWrap} accessibilityLabel="Verification code">
      {cells.map((on, idx) => (
        <View key={idx} style={[styles.qrCell, on ? styles.qrOn : styles.qrOff]} />
      ))}
    </View>
  );
}

function DigitalCard({
  email,
  userId,
  avatarUrl,
}: {
  email?: string | null;
  userId?: string | null;
  avatarUrl?: string | null;
}) {
  const [flipped, setFlipped] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shineAnim]);

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 1 : 0,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [flipped, flipAnim]);

  const rotateYFront = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const rotateYBack = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const shineX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 220],
  });

  const name = getDisplayName(email);
  const initial = (email?.charAt(0) || 'U').toUpperCase();
  const cardId = maskId(userId || '');

  return (
    <Pressable
      onPress={() => setFlipped((v) => !v)}
      style={styles.cardPress}
      accessibilityRole="button"
      accessibilityLabel="Digital card"
      accessibilityHint="Tap to flip the card"
    >
      <View style={styles.cardStage}>
        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ perspective: 900 }, { rotateY: rotateYFront }],
            },
          ]}
        >
          <View pointerEvents="none" style={styles.cardGlass} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.cardShine,
              { transform: [{ translateX: shineX }, { rotateZ: '12deg' }] },
            ]}
          />

          <View style={styles.cardTopRow}>
            <View style={styles.brandPill}>
              <Text style={styles.brandText}>DIGITAL ID</Text>
            </View>

            <View style={styles.verifiedPill}>
              <ShieldCheck size={14} color={GREEN} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.cardMainRow}>
            <View style={styles.photoWrap}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.photo} />
              ) : (
                <View style={styles.photoFallback}>
                  <Text style={styles.photoInitial}>{initial}</Text>
                </View>
              )}
