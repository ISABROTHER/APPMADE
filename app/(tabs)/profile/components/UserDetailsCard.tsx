import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, User } from 'lucide-react-native';
import { router } from 'expo-router';

const TEXT = '#0B1220';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';
const BG_CARD = '#FFFFFF';

interface UserDetailsCardProps {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export function UserDetailsCard({
  fullName,
  email,
  phone,
  address,
}: UserDetailsCardProps) {
  const displayName = fullName || 'Add your name';
  const displayEmail = email || 'Email not set';
  const displayPhone = phone || 'Phone not added';
  const displayAddress = address || 'Address not added';

  const isIncomplete = !fullName || !phone || !address;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(tabs)/profile/edit-profile')}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.userIconContainer}>
          <User size={24} color="#FFFFFF" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.emailText}>{displayEmail}</Text>
        </View>
        <ChevronRight size={20} color={MUTED} />
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text
            style={[
              styles.detailValue,
              !phone && styles.detailValueMissing,
            ]}
          >
            {displayPhone}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text
            style={[
              styles.detailValue,
              !address && styles.detailValueMissing,
            ]}
            numberOfLines={1}
          >
            {displayAddress}
          </Text>
        </View>
      </View>

      {isIncomplete && (
        <View style={styles.incompleteIndicator}>
          <Text style={styles.incompleteText}>Complete your profile</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  headerContent: {
    flex: 1,
  },

  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },

  emailText: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
  },

  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  detailRow: {
    marginVertical: 6,
  },

  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT,
  },

  detailValueMissing: {
    color: '#EF4444',
    fontStyle: 'italic',
  },

  incompleteIndicator: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  incompleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
});
