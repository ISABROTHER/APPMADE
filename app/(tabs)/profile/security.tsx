import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const BG = '#E9EDF2';
const TEXT = '#0B1220';

export default function SecurityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <ChevronLeft size={18} color={TEXT} />
        </Pressable>
        <Text style={styles.title}>Security</Text>
        <Text style={styles.sub}>Password and sign-in security.</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.glass}>
          <Text style={styles.note}>Add security actions here (change password, 2FA, sessions, etc.).</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 10 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 28, fontWeight: '900', color: TEXT, letterSpacing: -0.2 },
  sub: { marginTop: 6, fontSize: 12.5, fontWeight: '700', color: 'rgba(107,114,128,0.95)' },
  body: { paddingHorizontal: 18, paddingTop: 10 },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  note: { fontSize: 13, fontWeight: '800', color: 'rgba(11,18,32,0.78)' },
});
