import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, User } from 'lucide-react-native';
import { router } from 'expo-router';

const TEXT = '#111827';
const MUTED = '#6B7280';
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(60,60,67,0.18)';

// Light red pill (your requirement)
const RED_BG = 'rgba(255, 59, 48, 0.12)';
const RED_TEXT = '#B42318';

interface UserDetailsCardProps {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export function UserDetailsCard({ fullName, email, phone, address }: UserDetailsCardProps) {
  const displayName = useMemo(() => (fullName && fullName.trim() ? fullName : 'Your account'), [fullName]);
  const displayEmail = useMemo(() => (email && email.trim() ? email : ''), [email]);

  const isIncomplete = useMemo(() => !phone || !address, [phone, address]);

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scale, { toValue: 0.985, duration: 90, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={() => router.push('/(tabs)/profile/edit-profile')}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
      >
        <View style={styles.row}>
          <View style={styles.avatarWrap}>
            <User size={20} color={RED_TEXT} strokeWidth={2} />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>

            {displayEmail ? (
              <Text style={styles.sub} numberOfLines={1}>
                {displayEmail}
              </Text>
            ) : null}

            <View style={styles.pill}>
              <Text style={styles.pillText}>{isIncomplete ? 'Complete profile' : 'Your information'}</Text>
            </View>
          </View>

          <ChevronRight size={18} color={MUTED} strokeWidth={2} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,

    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
  },

  cardPressed: { opacity: 0.96 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: RED_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textCol: { flex: 1 },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },

  sub: {
    fontSize: 13,
    fontWeight: '400',
    color: MUTED,
    marginBottom: 10,
  },

  pill: {
    alignSelf: 'flex-start',
    backgroundColor: RED_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: RED_TEXT,
  },
});
