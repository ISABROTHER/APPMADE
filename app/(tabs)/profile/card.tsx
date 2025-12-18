import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  Circle,
  QrCode,
  Plus,
  Send,
  Ticket,
  Receipt,
  Bus,
  AlertTriangle,
  CreditCard,
  Lock,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const BG = '#F3F4F6';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

const GREEN = '#34B67A';

const PINK_BG = '#F7E7E6';
const PINK_ICON_BG = '#F2CFCF';

const ORANGE = '#F97316';
const RED = '#EF4444';
const BLUE = '#2563EB';
const GRAY = '#6B7280';

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
  onPress,
  showChevron = true,
}: {
  title: string;
  subtitle?: string;
  left: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
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
      {showChevron ? <ChevronRight size={18} color="rgba(11,18,32,0.35)" /> : null}
    </View>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

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

export default function CardDetailsScreen() {
  const { user } = useAuth();

  const name = useMemo(() => formatNameFromEmail(user?.email ?? null), [user?.email]);
  const cardNumber = useMemo(() => formatCardNumberFromId(user?.id ?? null), [user?.id]);

  const [blocked, setBlocked] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerBtn, pressed ? styles.pressed : null]}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Card Details</Text>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => {
              // placeholder refresh action
            }}
            style={({ pressed }) => [styles.headerBtn, pressed ? styles.pressed : null]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Refresh"
          >
            <Circle size={20} color={GREEN} />
          </Pressable>

          <Pressable
            onPress={() => {
              // placeholder QR action
            }}
            style={({ pressed }) => [styles.headerBtn, pressed ? styles.pressed : null]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Open QR"
          >
            <QrCode size={20} color={GREEN} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Horizontal card carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardCarousel}
        >
          {/* Card 1 */}
          <View style={styles.cardShell}>
            <View style={styles.card}>
              <View style={styles.cardLeftGold}>
                <Text style={styles.cardCurrency}>GHS</Text>
                <Text style={styles.cardAmount}>0.00</Text>
                <Text style={styles.cardLabel}>Card Balance</Text>
              </View>

              <View style={styles.cardRight}>
                <View style={styles.cardPattern} />
                <Text style={styles.cardName}>{name}</Text>
                <Text style={styles.cardNumber}>{cardNumber}</Text>
                <Text style={styles.cardNumberLabel}>Card Number</Text>
              </View>
            </View>
          </View>

          {/* Card 2 (Tap hint) */}
          <View style={styles.cardShell}>
            <View style={[styles.card, styles.cardAlt]}>
              <View style={styles.tapHintWrap}>
                <Text style={styles.tapHint}>Tap</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Secure card banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Lock size={20} color={RED} />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Seamless payments with your tapngo card!</Text>
            <Text style={styles.bannerSub}>Secure your card with a 4 digit passcode</Text>
          </View>
          <ChevronRight size={18} color="rgba(11,18,32,0.35)" />
        </View>

        {/* Quick actions */}
        <SectionCard>
          <Row
            title="Top up my card"
            subtitle="Add money to my card"
            left={
              <IconBox bg={ORANGE}>
                <Plus size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        <SectionCard>
          <Row
            title="Send to Bank / Wallet"
            subtitle="Send money from your card to other payment channels"
            left={
              <IconBox bg={RED}>
                <Send size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        {/* Grouped list */}
        <SectionCard>
          <View style={styles.dividerRow}>
            <Row
              title="Redeem QR Coupon"
              subtitle="Don't let your coupons go to waste, redeem them onto your card"
              left={
                <IconBox bg={BLUE}>
                  <Ticket size={18} color="#FFFFFF" />
                </IconBox>
              }
              onPress={() => {}}
            />
          </View>

          <View style={styles.dividerRow}>
            <Row
              title="Transactions"
              subtitle="View all transactions made with my card"
              left={
                <IconBox bg={BLUE}>
                  <Receipt size={18} color="#FFFFFF" />
                </IconBox>
              }
              onPress={() => {}}
            />
          </View>

          <Row
            title="Travel Subscriptions"
            subtitle="Buy promotional services from transport operators"
            left={
              <IconBox bg={BLUE}>
                <Bus size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        {/* Block card toggle */}
        <SectionCard>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.rowLeft}>
                <IconBox bg={RED}>
                  <AlertTriangle size={18} color="#FFFFFF" />
                </IconBox>
              </View>

              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>Block my card</Text>
              </View>

              <Switch
                value={blocked}
                onValueChange={setBlocked}
                trackColor={{ false: 'rgba(209,213,219,1)', true: 'rgba(52,182,122,0.45)' }}
                thumbColor={blocked ? GREEN : '#FFFFFF'}
                ios_backgroundColor="rgba(209,213,219,1)"
                accessibilityLabel="Block my card"
              />
            </View>
          </View>
        </SectionCard>

        {/* Add physical card */}
        <SectionCard>
          <Row
            title="Add physical card"
            subtitle="Assign a physical card to your virtual card"
            left={
              <IconBox bg={GRAY}>
                <CreditCard size={18} color="#FFFFFF" />
              </IconBox>
            }
            onPress={() => {}}
          />
        </SectionCard>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18,
  },

  cardCarousel: {
    paddingVertical: 8,
    paddingRight: 10,
  },

  cardShell: {
    width: 300,
    height: 150,
    marginRight: 14,
  },

  card: {
    flex: 1,
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

  cardAlt: {
    backgroundColor: '#D4A14A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardLeftGold: {
    width: 118,
    backgroundColor: '#D4A14A',
    padding: 14,
    justifyContent: 'flex-end',
  },
  cardCurrency: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    opacity: 0.95,
  },
  cardAmount: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 34,
    marginTop: 2,
    letterSpacing: -0.6,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '800',
    fontSize: 12.5,
    marginTop: 2,
  },

  cardRight: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
  },
  cardPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.12,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(107,114,128,0.20)',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '900',
    color: 'rgba(11,18,32,0.78)',
    textAlign: 'center',
  },
  cardNumber: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(11,18,32,0.72)',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  cardNumberLabel: {
    marginTop: 2,
    fontSize: 12.5,
    fontWeight: '800',
    color: 'rgba(107,114,128,0.95)',
    textAlign: 'center',
  },

  tapHintWrap: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },

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
  bannerTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: TEXT,
  },
  bannerSub: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: '800',
    color: 'rgba(107,114,128,0.95)',
  },

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

  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLeft: {
    width: 44,
    alignItems: 'flex-start',
  },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: TEXT,
  },
  rowSub: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: '800',
    color: 'rgba(107,114,128,0.95)',
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dividerRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,231,235,1)',
  },

  pressed: { opacity: 0.92 },
});
