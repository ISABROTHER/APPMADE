import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  MapPin,
  Package,
  Receipt,
  CreditCard,
  Bell,
  Globe,
  ShieldCheck,
  KeyRound,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileRow } from './components/ProfileRow';
import { UserDetailsCard } from './components/UserDetailsCard';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserDetailsCard
          fullName={userProfile?.full_name}
          email={user?.email}
          phone={userProfile?.phone}
          address={userProfile?.address}
        />

        <ProfileSectionCard title="Pickup preferences">
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

        <ProfileSectionCard title="Settings">
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

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Contact and support</Text>
          <Text style={styles.supportText}>
            Need help? Visit our support center or contact us at support@parcelgh.com
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  supportSection: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  supportText: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
