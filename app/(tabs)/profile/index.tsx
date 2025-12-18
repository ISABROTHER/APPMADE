import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LogOut, Mail, User as UserIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#F9FAFB';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

function getDisplayName(email?: string | null) {
  if (!email) return 'User';
  const namePart = email.split('@')[0] ?? 'User';
  const cleaned = namePart.replace(/[._-]+/g, ' ').trim();
  const words = cleaned.split(' ').filter(Boolean);
  const title = words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return title || 'User';
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const displayName = getDisplayName(user?.email);
  const initial = (user?.email?.charAt(0) || 'U').toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSub}>Your account information</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <UserIcon size={20} color={MUTED} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{displayName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Mail size={20} color={MUTED} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || '—'}</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.pressed,
          ]}
          onPress={handleSignOut}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  pressed: {
    opacity: 0.7,
  },
});
