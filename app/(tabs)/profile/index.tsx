import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Settings,
  KeyRound,
  Bell,
  HelpCircle,
  LogOut,
  User as UserIcon,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const BG = '#F3F4F6';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

const GREEN = '#34B67A';

// Banner colors (soft pink like screenshot)
const PINK_BG = '#F7E7E6';
const PINK_ICON_BG = '#F2CFCF';

// Icon tile colors
const ORANGE = '#F97316';
const BLUE = '#2563EB';
const RED = '#EF4444';
const GRAY = '#6B7280';
const INDIGO = '#4F46E5';

function formatNameFromEmail(email?: string | null) {
  if (!email) return 'User';
  const raw = email.split('@')[0] || 'User';
  const cleaned = raw.replace(/[._-]+/g, ' ').trim();
  const parts = cleaned.split(' ').filter(Boolean);
  const titled = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  return titled.slice(0, 2).join(' ') || 'User';
}

function formatCardNumberFromId(id?: string | null) {
  if (!id) return '0000 0000';
  const s = id.replace(/-/g, '').toUpperCase();
  const tail = s.slice(-8).padStart(8, '0');
  return `${tail.slice(0, 4)} ${tail.slice(4)}`;
}

function IconBox({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return <View style={[styles.iconBox, { backgroundColor: bg }]}>{children}</View>;
}

function Row({
  title,
  subtitle,
  left,
  href,
  onPress,
}: {
  title: string;
  subtitle?: string;
  left: React.ReactNode;
  href?: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.rowInner}>
      <View style={styles.rowLeft}>{left}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSub} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ChevronRight size={18} color="rgba(11,18,32,0.35)" />
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]} accessibilityRole="button">
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {content}
    </Pressable>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.sectionCard}>{children}</View>;
}

function CardPreview({
  name,
  cardNumber,
  avatarUrl,
}: {
  name: string;
  cardNumber: string;
  avatarUrl?: string | null;
}) {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shineAnim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shineAnim]);

  const shineX = shineAnim.interpolate({ inputRange: [0, 1], outputRange: [-120, 220] });

  const initial = (name?.charAt(0) || 'U').toUpperCase();

  return (
    <Link href="/(tabs)/profile/card" asChild>
      <Pressable style={({ pressed }) => [styles.cardShell, pressed ? styles.pressed : null]} accessibilityRole="button">
        <View style={styles.card}>
          <View style={styles.cardLeftGold}>
            <Text style={styles.cardCurrency}>GHS</Text>
            <Text style={styles.cardAmount}>0.00</Text>
            <Text style={styles.cardLabel}>Card Balance</Text>
          </View>

          <View style={styles.cardRight}>
            <View pointerEvents="none" style={styles.cardPattern} />
            <Animated.View
              pointerEvents="none"
              style={[styles.cardShine, { transform: [{ translateX: shineX }, { rotateZ: '12deg' }] }]}
            />

            <View style={styles.cardAvatarRow}>
              <View style={styles.avatar}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarInitial}>{initial}</Text>
                )}
              </View>
              <View style={styles.cardVerifiedPill}>
                <ShieldCheck size={14} color={GREEN} />
                <Text style={styles.cardVerifiedText}>Verified</Text>
              </View>
            </View>

            <Text style={styles.cardName}>{name}</Text>
            <Text style={styles.cardNumber}>{cardNumber}</Text>
            <Text style={styles.cardNumberLabel}>Card Number</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function ProfileIndexScreen() {
  const { user, signOut } = useAuth();

  const name = useMemo(() => formatNameFromEmail(user?.email ?? null), [user?.email]);
  const cardNumber = useMemo(() => formatCardNumberFromId(user?.id ?? null), [user?.id]);

  const avatarUrl =
    (user?.user_metadata as Record<string, unknown> | undefined)?.avatar_url as string | undefined;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSub}>Manage your card, security and account.</Text>
        </View>

        {/* Card preview (tap to open Card Details) */}
        <CardPreview name={name} cardNumber={cardNumber} avatarUrl={avatarUrl ?? null} />

        {/* Banner (like screenshot) */}
        <Link href="/(tabs)/profile/security" asChild>
          <Pressable style={({ pressed }) => [styles.banner, pressed ? styles.pressed : null]} accessibilityRole="button">
            <View style={styles.bannerIcon}>
              <Lock size={20} color={RED} />
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Secure your account</Text>
              <Text style={styles.bannerSub}>Enable extra protection for your profile</Text>
            </View>
            <ChevronRight size={18} color="rgba(11,18,32,0.35)" />
          </Pressable>
        </Link>

        {/* Large single rows */}
        <SectionCard>
          <Row
            title="My Card"
            subtitle="View card details and actions"
            left={
              <IconBox bg={ORANGE}>
                <CreditCard size={18} color="#FFFFFF" />
              </IconBox>
            }
            href="/(tabs)/profile/card"
          />
        </SectionCard>

        <SectionCard>
          <Row
            title="Settings"
            subtitle="Preferences and account controls"
            left={
              <IconBox bg={GRAY}>
                <Settings size={18} color="#FFFFFF" />
              </IconBox>
            }
            href="/(tabs)/profile/settings"
          />
        </SectionCard>

        {/* Grouped list (like screenshot) */}
        <SectionCard>
          <View style={styles.dividerRow}>
            <Row
              title="Security"
              subtitle="Password and sign-in security"
              left={
                <IconBox bg={INDIGO}>
                  <KeyRound size={18} color="#FFFFFF" />
                </IconBox>
              }
              href="/(tabs)/profile/security"
            />
          </View>

          <View style={styles.dividerRow}>
            <Row
              title="Notifications"
              subtitle="Control alerts and updates"
              left={
                <IconBox bg={BLUE}>
                  <Bell size={18} color="#FFFFFF" />
                </IconBox>
              }
              onPress={() => {}}
            />
          </View>

          <Row
            title="Help & Support"
            subtitle="Get assistance and FAQs"
            left={
              <IconBox bg={BLUE}>
                <HelpCircle size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        {/* Account section */}
        <SectionCard>
          <Row
            title="Account"
            subtitle="Profile information"
            left={
              <IconBox bg={GREEN}>
                <UserIcon size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        {/* Sign out */}
        <SectionCard>
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <View style={styles.rowInner}>
              <View style={styles.rowLeft}>
                <IconBox bg={RED}>
                  <LogOut size={18} color="#FFFFFF" />
                </IconBox>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Sign out</Text>
                <Text style={styles.rowSub}>Log out from this device</Text>
              </View>
              <ChevronRight size={18} color="rgba(11,18,32,0.35)" />
            </View>
          </Pressable>
        </SectionCard>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },

  header: { paddingHorizontal: 2, paddingBottom: 8 },
  headerTitle: { fontSize: 30, fontWeight: '900', color: TEXT, letterSpacing: -0.2 },
  headerSub: { marginTop: 6, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  // Card preview
  cardShell: { marginTop: 10 },
  card: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: '#0B1220',
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  cardLeftGold: { width: 118, backgroundColor: '#D4A14A', padding: 14, justifyContent: 'flex-end' },
  cardCurrency: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, opacity: 0.95 },
  cardAmount: { color: '#FFFFFF', fontWeight: '900', fontSize: 34, marginTop: 2, letterSpacing: -0.6 },
  cardLabel: { color: 'rgba(255,255,255,0.92)', fontWeight: '800', fontSize: 12.5, marginTop: 2 },

  cardRight: { flex: 1, padding: 14, justifyContent: 'center', backgroundColor: '#F4F5F7' },
  cardPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(107,114,128,0.20)',
  },
  cardShine: { position: 'absolute', top: -30, bottom: -30, width: 86, backgroundColor: 'rgba(255,255,255,0.22)' },

  cardAvatarRow: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitial: { color: '#FFFFFF', fontWeight: '900' },

  cardVerifiedPill: {
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
  cardVerifiedText: { fontSize: 11.5, fontWeight: '900', color: GREEN },

  cardName: { fontSize: 18, fontWeight: '900', color: 'rgba(11,18,32,0.78)', textAlign: 'center' },
  cardNumber: { marginTop: 6, fontSize: 28, fontWeight: '900', color: 'rgba(11,18,32,0.72)', textAlign: 'center', letterSpacing: -0.3 },
  cardNumberLabel: { marginTop: 2, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)', textAlign: 'center' },

  // Banner
  banner: {
    marginTop: 14,
    backgroundColor: PINK_BG,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PINK_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { flex: 1, minWidth: 0 },
  bannerTitle: { fontSize: 14.5, fontWeight: '900', color: TEXT },
  bannerSub: { marginTop: 4, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  // Sections
  sectionCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },

  row: { paddingHorizontal: 14, paddingVertical: 14 },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLeft: { width: 44, alignItems: 'flex-start' },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 16, fontWeight: '900', color: TEXT },
  rowSub: { marginTop: 4, fontSize: 12.5, fontWeight: '800', color: 'rgba(107,114,128,0.95)' },

  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  dividerRow: { borderBottomWidth: 1, borderBottomColor: 'rgba(229,231,235,1)' },

  pressed: { opacity: 0.92 },
});
