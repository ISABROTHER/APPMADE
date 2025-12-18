import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  Bell,
  CreditCard,
  Globe,
  KeyRound,
  LogOut,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProfileSectionCard } from './components/ProfileSectionCard';
import { ProfileRow } from './components/ProfileRow';

const BG = '#F2F2F7'; // iOS grouped background
const TEXT = '#111827';
const MUTED = '#6B7280';

const WHITE = '#FFFFFF';
const BORDER = 'rgba(60,60,67,0.18)';

const GREEN_BG = 'rgba(52, 182, 122, 0.14)';
const GREEN_TEXT = '#1F7A4E';

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

  const fullName = userProfile?.full_name || 'Your account';
  const email = user?.email || '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Minimal top spacer (no big "Profile" title) */}
      <View style={styles.topSpacer} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO HEADER */}
        <Pressable
          onPress={() => router.push('/(tabs)/profile/edit-profile')}
          style={({ pressed }) => [styles.heroCard, pressed ? styles.heroPressed : null]}
        >
          <View style={styles.heroAccent} />

          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <User size={22} color={GREEN_TEXT} strokeWidth={2} />
            </View>

            <View style={styles.heroTextCol}>
              <Text style={styles.heroName} numberOfLines={1}>
                {fullName}
              </Text>

              {email ? (
                <Text style={styles.heroEmail} numberOfLines={1}>
                  {email}
                </Text>
              ) : null}

              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>Edit profile</Text>
              </View>
            </View>
          </View>
        </Pressable>

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

  topSpacer: {
    height: 6,
    backgroundColor: BG,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // HERO
  heroCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 18,
  },
  heroPressed: {
    opacity: 0.92,
  },
  heroAccent: {
    height: 54,
    backgroundColor: GREEN_BG,
  },
  heroRow: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginTop: -18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextCol: {
    flex: 1,
  },
  // Apple-like typography
  heroName: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 2,
  },
  heroEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: MUTED,
    marginBottom: 10,
  },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: GREEN_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: GREEN_TEXT,
  },

  supportSection: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: MUTED,
    marginBottom: 8,
    marginLeft: 12,
  },
  supportText: {
    fontSize: 15,
    fontWeight: '400',
    color: MUTED,
    lineHeight: 20,
    marginLeft: 12,
    marginRight: 12,
  },

  bottomSpace: {
    height: 40,
  },
});
