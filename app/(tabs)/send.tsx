import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, Globe, ChevronRight } from 'lucide-react-native';

const GREEN = '#34B67A';
const BG = '#F9FAFB';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

export default function SendScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Parcel</Text>
        <Text style={styles.headerSub}>Choose your delivery destination</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Pressable style={styles.optionCard} onPress={() => router.push('/(tabs)/send-parcel')}>
          <View style={styles.iconContainer}>
            <MapPin size={32} color={GREEN} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Parcel in Norway</Text>
            <Text style={styles.optionDescription}>
              Domestic delivery within Norway
            </Text>
          </View>
          <ChevronRight size={24} color={MUTED} />
        </Pressable>

        <Pressable style={styles.optionCard}>
          <View style={styles.iconContainer}>
            <Globe size={32} color={GREEN} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Send Parcel Outside Norway</Text>
            <Text style={styles.optionDescription}>
              International delivery worldwide
            </Text>
          </View>
          <ChevronRight size={24} color={MUTED} />
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Quick Tips</Text>
          <Text style={styles.infoText}>
            • Ensure your parcel is properly packaged{'\n'}
            • Have recipient details ready{'\n'}
            • Check size and weight restrictions{'\n'}
            • Compare delivery options and prices
          </Text>
        </View>
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(52, 182, 122, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: MUTED,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: 'rgba(52, 182, 122, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 182, 122, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
    fontWeight: '500',
  },
});
