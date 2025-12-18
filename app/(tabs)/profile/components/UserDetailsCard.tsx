import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, User } from 'lucide-react-native';
import { router } from 'expo-router';

const TEXT = '#0B1220';
const MUTED = '#6B7280';

// Card
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(0,0,0,0.06)';

// “Text box” (light green badge)
const INFO_BG = 'rgba(52, 182, 122, 0.14)';
const INFO_TEXT = '#1F7A4E';

interface UserDetailsCardProps {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export function UserDetailsCard({ fullName }: UserDetailsCardProps) {
  const displayName = fullName || 'Add your name';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(tabs)/profile/edit-profile')}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <User size={22} color={INFO_TEXT} strokeWidth={2.5} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.nameText} numberOfLines={1}>
            {displayName}
          </Text>

          <View style={styles.infoPill}>
            <Text style={styles.infoText}>Your information</Text>
          </View>
        </View>

        <ChevronRight size={20} color={MUTED} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
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
    marginBottom: 20,
    shadowColor: '#0B1220',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: INFO_BG,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  textCol: {
    flex: 1,
    justifyContent: 'center',
  },

  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.2,
    marginBottom: 6,
  },

  infoPill: {
    alignSelf: 'flex-start',
    backgroundColor: INFO_BG,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: INFO_TEXT,
  },
});
