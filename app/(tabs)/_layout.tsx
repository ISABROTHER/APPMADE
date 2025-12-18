import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CheckSquare, User } from 'lucide-react-native';

const GREEN = '#34B67A';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

// Glass palette to match your login screen
const GLASS_BG = 'rgba(255,255,255,0.78)';
const GLASS_BORDER = 'rgba(255,255,255,0.55)';
const GLASS_HIGHLIGHT = 'rgba(255,255,255,0.22)';
const SHADOW = '#0B1220';

function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [width, setWidth] = useState(0);
  const tabCount = state.routes.length;
  const itemW = width > 0 ? width / Math.max(1, tabCount) : 0;

  // Sliding pill behind the active tab
  const pillX = useRef(new Animated.Value(0)).current;

  // Press animation (micro-feedback)
  const pressScale = useRef(state.routes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const nextX = itemW * state.index;
    Animated.timing(pillX, {
      toValue: nextX,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [itemW, pillX, state.index]);

  const onLayout = (w: number) => {
    setWidth(w);
    // snap pill into correct position after layout
    pillX.setValue(w > 0 ? (w / Math.max(1, tabCount)) * state.index : 0);
  };

  return (
    <View
      style={styles.tabBarWrap}
      onLayout={(e) => onLayout(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {/* Glass base */}
      <View pointerEvents="none" style={styles.glassBase} />

      {/* Top highlight line for “real glass” */}
      <View pointerEvents="none" style={styles.glassHighlight} />

      {/* Active pill */}
      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activePill,
            {
              width: itemW - 18,
              transform: [{ translateX: pillX.interpolate({
                inputRange: [0, Math.max(1, itemW * (tabCount - 1))],
                outputRange: [9, 9 + Math.max(0, itemW * (tabCount - 1))],
                extrapolate: 'clamp',
              }) }],
            },
          ]}
        />
      )}

      <View style={styles.itemsRow}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const icon =
            options.tabBarIcon?.({
              focused,
              color: focused ? GREEN : MUTED,
              size: 22,
            }) ?? null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              // light tactile cue without extra dependencies
              Vibration.vibrate(8);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const scale = pressScale[index];

          const pressIn = () => {
            Animated.timing(scale, {
              toValue: 0.96,
              duration: 110,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start();
          };

          const pressOut = () => {
            Animated.timing(scale, {
              toValue: 1,
              duration: 130,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start();
          };

          return (
            <Animated.View key={route.key} style={[styles.itemWrap, { width: itemW || undefined, transform: [{ scale }] }]}>
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={pressIn}
                onPressOut={pressOut}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={typeof label === 'string' ? label : route.name}
                style={styles.itemBtn}
                android_ripple={Platform.OS === 'android' ? { color: 'rgba(11,18,32,0.06)', borderless: false } : undefined}
              >
                <View style={[styles.iconWrap, focused ? styles.iconWrapFocused : null]}>
                  {icon}
                </View>

                <Text style={[styles.label, focused ? styles.labelFocused : styles.labelMuted]}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: GREEN,
      tabBarInactiveTintColor: MUTED,
    }),
    []
  );

  return (
    <Tabs
      screenOptions={screenOptions}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ size, color }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'relative',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    height: 70,
  },

  glassBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: GLASS_BG,
    borderTopWidth: 1,
    borderTopColor: GLASS_BORDER,
    shadowColor: SHADOW,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
  },

  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: GLASS_HIGHLIGHT,
  },

  itemsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activePill: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(52,182,122,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
  },

  itemWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemBtn: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    transform: [{ translateY: 0 }],
  },
  iconWrapFocused: {
    transform: [{ translateY: -1.5 }],
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  labelFocused: {
    color: GREEN,
  },
  labelMuted: {
    color: MUTED,
  },
});
