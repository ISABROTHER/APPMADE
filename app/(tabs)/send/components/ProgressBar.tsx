import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.max(0, Math.min(1, currentStep / totalSteps));

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  bar: {
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(52,182,122,0.16)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#34B67A',
    borderRadius: 4,
  },
});
