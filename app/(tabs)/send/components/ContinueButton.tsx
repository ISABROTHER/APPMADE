import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';

type ContinueButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
};

export function ContinueButton({
  onPress,
  disabled = false,
  loading = false,
  label = 'Continue',
}: ContinueButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (disabled || loading) return;
    Animated.timing(scale, { toValue: 0.985, duration: 90, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [
          styles.button,
          (disabled || loading) && styles.disabled,
          pressed && !disabled && !loading ? styles.pressed : null,
        ]}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.text}>{label}</Text>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#34B67A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#0B1220',
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  disabled: {
    backgroundColor: 'rgba(142,142,147,0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    opacity: 0.96,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
