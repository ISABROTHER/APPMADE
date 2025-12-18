import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StepHeaderProps = {
  title: string;
  subtitle?: string;
};

export const StepHeader = ({ title, subtitle }: StepHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={3}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  // Apple-like hierarchy
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },
});
