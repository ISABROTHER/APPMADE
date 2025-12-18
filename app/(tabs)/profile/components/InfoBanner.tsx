import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Info } from 'lucide-react-native';

const TEXT = '#0B1220';
const BLUE = '#3B82F6';

interface InfoBannerProps {
  message: string;
  style?: any;
}

export function InfoBanner({ message, style }: InfoBannerProps) {
  return (
    <View style={[styles.banner, style]}>
      <View style={styles.iconWrap}>
        <Info size={18} color={BLUE} strokeWidth={2.5} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.16)',
  },

  iconWrap: {
    marginTop: 2,
  },

  message: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: TEXT,
    lineHeight: 19,
  },
});
