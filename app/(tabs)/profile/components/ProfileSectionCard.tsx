import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TEXT = '#0B1220';

interface ProfileSectionCardProps {
  title?: string;
  children: React.ReactNode;
  style?: any;
}

export function ProfileSectionCard({ title, children, style }: ProfileSectionCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },

  title: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    shadowColor: '#0B1220',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
