import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, User } from 'lucide-react-native';
import { router } from 'expo-router';

const TEXT = '#111827';
const MUTED = '#6B7280';
const BG = '#FFFFFF';
const BORDER = 'rgba(60,60,67,0.18)';

const GREEN_BG = 'rgba(52, 182, 122, 0.15)';
const GREEN_TEXT = '#1F7A4E';

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
        {/* Accent / hero band */}
        <View style={styles.heroBand} />

        {/* Content */}
        <View style={styles.contentRow}>
          <View style={styles.avatarWrap}>
            <User size={22} color={GREEN_TEXT} strokeWidth={2} />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>

            {displayEmail ? (
              <Text style={styles.email} numberOfLines={1}>
                {displayEmail}
              </Text>
            ) : null}

            {/* Light green textbox (your requirement) */}
            <View style={styles.greenBox}>
              <Text style={styles.greenBoxText}>
                {isIncomplete ? 'Complete your profile' : 'Your information'}
              </Text>
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
    backgroundColor: BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 18,
  },
  cardPressed: {
    opacity: 0.96,
  },

  heroBand: {
    height: 54,
    backgroundColor: GREEN_BG,
  },

  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginTop: -18,
  },

  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textCol: {
    flex: 1,
  },

  // Apple-like hierarchy
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },

  email: {
    fontSize: 13,
    fontWeight: '400',
    color: MUTED,
    marginBottom: 10,
  },

  // Light green text box
  greenBox: {
    alignSelf: 'flex-start',
    backgroundColor: GREEN_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  greenBoxText: {
    fontSize: 13,
    fontWeight: '500',
    color: GREEN_TEXT,
  },
});
