import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  Bell,
  CreditCard,
  Globe,
  HelpCircle,
  KeyRound,
  LogOut,
  MapPin,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  Trash2,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserDetailsCard } from './components/UserDetailsCard';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileRow } from './components/ProfileRow';

const BG = '#F2F2F7'; // iOS grouped background
const HEADER_GREEN = '#0F8A5F'; // premium green header band

export default function ProfileHomeScreen() {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [user?.id])
  );

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setUserProfile(data);
    } catch (err) {
      console.error('Load profile error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Green header band like the reference UI */}
      <View style={styles.headerBand}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/(tabs)/profile/data-privacy')}
              style={({ pressed }) => [styles.headerIconBtn, pressed ? styles.headerIconBtnPressed : null]}
              hitSlop={10}
            >
              <Settings size={18} color="#0F8A5F" strokeWidth={2} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(tabs)/profile/notifications')}
              style={({ pressed }) => [styles.headerIconBtn, pressed ? styles.headerIconBtnPressed : null]}
              hitSlop={10}
            >
              <HelpCircle size={18} color="#0F8A5F" strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating card (overlaps header band like the screenshot) */}
        <View style={styles.floatingCardWrap}>
          <UserDetailsCard
            fullName={userProfile?.full_name ?? null}
            email={user?.email ?? null}
            phone={userProfile?.phone ?? null}
            address={userProfile?.address ?? null}
          />
        </View>

        <ProfileSectionCard title="Delivery preferences">
          <ProfileRow
            icon={MapPin}
            label="Favorite pickup point"
            onPress={() => router.push('/(tabs)/profile/favorite-pickup')}
          />
          <ProfileRow
            icon={Package}
            label="Parcel in the mailbox"
            onPress={() => router.push('/(tabs)/profile/mailbox-prefs')}
            isLast
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Payments & receipts">
          <ProfileRow
            icon={Receipt}
            label="Receipts"
            onPress={() => router.push('/(tabs)/profile/receipts')}
          />
          <ProfileRow
            icon={CreditCard}
            label="Payment"
            onPress={() => router.push('/(tabs)/profile/payment')}
            isLast
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="App settings">
          <ProfileRow
            icon={Bell}
            label="Notifications"
            onPress={() => router.push('/(tabs)/profile/notifications')}
          />
          <ProfileRow
            icon={Globe}
            label="Language and country"
            onPress={() => router.push('/(tabs)/profile/language-country')}
          />
          <ProfileRow
            icon={ShieldCheck}
            label="Data and privacy"
            onPress={() => router.push('/(tabs)/profile/data-privacy')}
            isLast
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Account">
          <ProfileRow
            icon={KeyRound}
            label="Change password"
            onPress={() => router.push('/(tabs)/profile/change-password')}
          />
          <ProfileRow
            icon={Trash2}
            label="Delete profile"
            onPress={() => router.push('/(tabs)/profile/delete-profile')}
            destructive
          />
          <ProfileRow
            icon={LogOut}
            label="Log out"
            onPress={handleSignOut}
            showChevron={false}
            destructive
            isLast
          />
        </ProfileSectionCard>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  headerBand: {
    height: 190,
    backgroundColor: HEADER_GREEN,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  headerTextWrap: { flex: 1, paddingRight: 12 },

  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 6,
  },

  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },

  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconBtnPressed: { opacity: 0.92 },

  scrollView: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },

  floatingCardWrap: {
    marginTop: -54, // overlap header like the reference UI
    marginBottom: 6,
  },

  bottomSpace: { height: 34 },
});
