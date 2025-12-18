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
              <View pointerEvents="none" style={styles.photoRing} />
            </View>

            <View style={styles.cardInfo}>
              <Text numberOfLines={1} style={styles.cardName}>
                {name}
              </Text>
              <View style={styles.emailRow}>
                <Mail size={14} color="rgba(107,114,128,0.95)" />
                <Text numberOfLines={1} style={styles.cardEmail}>
                  {email || '—'}
                </Text>
              </View>

              <View style={styles.cardMetaRow}>
                <View style={styles.metaPill}>
                  <Text style={styles.metaLabel}>ID</Text>
                  <Text style={styles.metaValue}>{cardId}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardBottomRow}>
            <Text style={styles.tapHint}>Tap to flip</Text>
            <View style={styles.securityDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              transform: [{ perspective: 900 }, { rotateY: rotateYBack }],
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

          <View style={styles.backStripe} />

          <View style={styles.backContent}>
            <Text style={styles.backTitle}>Scan to verify</Text>
            <Text style={styles.backSub}>Present this code to confirm identity in-app.</Text>

            <View style={styles.backQrRow}>
              <FauxQr />
              <View style={styles.backRight}>
                <View style={styles.backPill}>
                  <Text style={styles.backPillLabel}>Status</Text>
                  <Text style={styles.backPillValue}>Verified</Text>
                </View>
                <View style={styles.backPill}>
                  <Text style={styles.backPillLabel}>Card ID</Text>
                  <Text style={styles.backPillValue}>{cardId}</Text>
                </View>
                <Text style={styles.tapHintBack}>Tap to flip back</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function RowLink({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.rowLink, pressed ? styles.pressed : null]}>
        <View style={styles.rowLinkText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSub}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color="rgba(11,18,32,0.45)" />
      </Pressable>
    </Link>
  );
}

export default function ProfileIndexScreen() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bg}>
        <View pointerEvents="none" style={styles.blobA} />
        <View pointerEvents="none" style={styles.blobB} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSub}>Your digital identity card and account settings.</Text>
      </View>

      <View style={styles.content}>
        <DigitalCard email={null} userId={null} avatarUrl={null} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>

          <RowLink
            title="My Card"
            subtitle="Open your digital card in full view"
            href="/(tabs)/profile/card"
          />
          <RowLink
            title="Settings"
            subtitle="Preferences and account controls"
            href="/(tabs)/profile/settings"
          />
          <RowLink
            title="Security"
            subtitle="Password and sign-in security"
            href="/(tabs)/profile/security"
          />

          <Pressable
            style={({ pressed }) => [styles.signOutButton, pressed ? styles.pressed : null]}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: BG },
  blobA: {
    position: 'absolute',
    top: -140,
    left: -140,
    width: 340,
    height: 340,
    borderRadius: 340,
    backgroundColor: 'rgba(52,182,122,0.18)',
  },
  blobB: {
    position: 'absolute',
    bottom: -150,
    right: -140,
    width: 360,
    height: 360,
    borderRadius: 360,
    backgroundColor: 'rgba(59,130,246,0.14)',
  },

  header: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: TEXT, letterSpacing: -0.2 },
  headerSub: { marginTop: 6, fontSize: 12.5, fontWeight: '700', color: 'rgba(107,114,128,0.95)' },

  content: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },

  cardPress: { width: '100%', marginTop: 10, marginBottom: 16 },
  cardStage: { height: 210 },

  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 210,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#0B1220',
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 3,
    padding: 16,
    backfaceVisibility: 'hidden',
  },
  cardBack: {},

  cardGlass: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.12)' },
  cardShine: { position: 'absolute', top: -30, bottom: -30, width: 90, backgroundColor: 'rgba(255,255,255,0.22)' },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  brandText: { fontSize: 11, fontWeight: '900', color: TEXT, letterSpacing: 0.8 },

  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(52,182,122,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
  },
  verifiedText: { fontSize: 11.5, fontWeight: '900', color: GREEN },

  cardMainRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },

  photoWrap: { width: 74, height: 74, borderRadius: 20, overflow: 'hidden', marginRight: 12 },
  photo: { width: '100%', height: '100%', borderRadius: 20 },
  photoFallback: { width: '100%', height: '100%', borderRadius: 20, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  photoRing: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', borderRadius: 20 },

  cardInfo: { flex: 1, minWidth: 0 },
  cardName: { fontSize: 18, fontWeight: '900', color: TEXT, letterSpacing: -0.2 },
  emailRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardEmail: { flex: 1, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  cardMetaRow: { marginTop: 10, flexDirection: 'row' },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  metaLabel: { fontSize: 11, fontWeight: '900', color: MUTED, letterSpacing: 0.8 },
  metaValue: { fontSize: 12, fontWeight: '900', color: TEXT, letterSpacing: 0.4 },

  cardBottomRow: { marginTop: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tapHint: { fontSize: 12, fontWeight: '900', color: 'rgba(107,114,128,0.9)' },
  securityDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: 'rgba(11,18,32,0.18)' },

  backStripe: { height: 30, borderRadius: 12, backgroundColor: 'rgba(11,18,32,0.12)', marginTop: 8 },
  backContent: { marginTop: 12 },
  backTitle: { fontSize: 16, fontWeight: '900', color: TEXT },
  backSub: { marginTop: 4, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  backQrRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  qrWrap: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.60)',
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: { width: 6, height: 6, margin: 1, borderRadius: 2 },
  qrOn: { backgroundColor: 'rgba(11,18,32,0.82)' },
  qrOff: { backgroundColor: 'rgba(11,18,32,0.06)' },

  backRight: { flex: 1, minWidth: 0 },
  backPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    marginBottom: 8,
  },
  backPillLabel: { fontSize: 11, fontWeight: '900', color: MUTED, letterSpacing: 0.6 },
  backPillValue: { marginTop: 2, fontSize: 12.5, fontWeight: '900', color: TEXT },
  tapHintBack: { marginTop: 2, fontSize: 12, fontWeight: '900', color: 'rgba(107,114,128,0.9)' },

  section: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: TEXT, marginBottom: 10 },

  rowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    marginBottom: 10,
  },
  rowLinkText: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 14.5, fontWeight: '900', color: TEXT },
  rowSub: { marginTop: 3, fontSize: 12.2, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.16)',
    marginTop: 2,
  },
  signOutText: { fontSize: 15, fontWeight: '900', color: '#FF3B30' },

  pressed: { opacity: 0.92 },
});
