import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const TEXT = '#0B1220';
const MUTED = '#6B7280';

interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  destructive?: boolean;
}

export function ProfileRow({
  icon: Icon,
  label,
  onPress,
  showChevron = true,
  isLast = false,
  destructive = false,
}: ProfileRowProps) {
  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed,
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.leftContent}>
          <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
            <Icon size={20} color={destructive ? '#FF3B30' : TEXT} strokeWidth={2.5} />
          </View>
          <Text style={[styles.label, destructive && styles.labelDestructive]}>
            {label}
          </Text>
        </View>

        {showChevron && (
          <ChevronRight size={18} color={MUTED} strokeWidth={2.5} />
        )}
      </Pressable>

      {!isLast && <View style={styles.separator} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  rowPressed: {
    opacity: 0.6,
  },

  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },

  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(52,182,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDestructive: {
    backgroundColor: 'rgba(255,59,48,0.10)',
  },

  label: {
    fontSize: 15.5,
    fontWeight: '700',
    color: TEXT,
    flex: 1,
  },
  labelDestructive: {
    color: '#FF3B30',
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 62,
  },
});
