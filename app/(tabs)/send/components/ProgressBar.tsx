import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = Math.max(0, Math.min(1, currentStep / totalSteps));

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>

      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  barContainer: {
    height: 4,
    backgroundColor: 'rgba(52,182,122,0.16)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#34B67A',
    borderRadius: 4,
  },
});
