import React from 'react';
import { Tabs } from 'expo-router';
import { CheckSquare, User } from 'lucide-react-native';

const GREEN = '#34B67A';
const MUTED = '#6B7280';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Match login accent + muted
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: MUTED,

        // Premium “glass” tab bar feel using translucency + thin border
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.78)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.55)',

          // Cleaner height + spacing (modern)
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,

          // Subtle shadow (iOS + Android)
          shadowColor: '#0B1220',
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -10 },
          elevation: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          marginTop: 2,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
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
