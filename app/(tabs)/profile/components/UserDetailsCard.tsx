import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, User } from 'lucide-react-native';
import { router } from 'expo-router';

const TEXT = '#111827';
const MUTED = '#6B7280';

// Card
const CARD_BG = '#FFFFFF';
const CARD_BORDER = 'rgba(0,0,0,0.08)';

// Light green info box (Apple-soft)
const INFO_BG = 'rgba(52, 182, 122, 0.15)';
const INFO_TEXT = '#1F7A4E';

interface UserDetailsCardProps {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export function UserDetailsCard({ fullName }: UserDetailsCardProps) {
  const displayName = fullName || 'Your name';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(tabs)/profile/edit-profile')}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <User size={22} color={INFO_TEXT} strokeWidth={2} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.nameText} numberOfLines={1}>
            {displayName}
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Your information</Text>
          </View>
        </View>

        <ChevronRight size={18} color={MUTED} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: INFO_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textCol: {
    flex: 1,
  },

  // Apple-style primary text (Title 3 feel)
  nameText: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 6,
  },

  // Apple-style secondary container
  infoBox: {
    alignSelf: 'flex-start',
    backgroundColor: INFO_BG,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  // Apple-style footnote text
  infoText: {
    fontSize: 13,
    fontWeight: '400',
    color: INFO_TEXT,
  },
});
