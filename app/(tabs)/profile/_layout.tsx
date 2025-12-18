import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      <Stack.Screen name="security" options={{ presentation: 'card' }} />
      <Stack.Screen name="card" options={{ presentation: 'card' }} />
    </Stack>
  );
}