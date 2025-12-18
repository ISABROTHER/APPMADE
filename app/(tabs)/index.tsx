import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, ArrowRight } from 'lucide-react-native';

const BG = '#F6E7E2';
const HEADER = '#5A0E0E';
const CARD = '#FFFFFF';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const ACCENT = '#7A0B0B';

type ParcelFilter = 'all' | 'toMe' | 'fromMe';

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        pressed ? styles.pressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [filter, setFilter] = useState<ParcelFilter>('all');

  const filterLabel = useMemo(() => {
    if (filter === 'all') return 'All';
    if (filter === 'toMe') return 'To me';
    return 'From me';
  }, [filter]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top header (like screenshot) */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My parcels</Text>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [styles.addBtn, pressed ? styles.pressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Add parcel"
          >
            <Text style={styles.addText}>Add</Text>
            <View style={styles.addIconWrap}>
              <Plus size={16} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        {/* Filter row: Search + All + To me + From me */}
        <View style={styles.filtersRow}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [styles.searchChip, pressed ? styles.pressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Search parcels"
          >
            <Search size={18} color="#FFFFFF" />
            <Text style={styles.searchText}>Search</Text>
          </Pressable>

          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="To me" active={filter === 'toMe'} onPress={() => setFilter('toMe')} />
          <FilterChip label="From me" active={filter === 'fromMe'} onPress={() => setFilter('fromMe')} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Empty state card */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyMarks}>
            <View style={styles.mark} />
            <View style={[styles.mark, styles.mark2]} />
            <View style={[styles.mark, styles.mark3]} />
          </View>

          <Text style={styles.emptyTitle}>Can't find any parcels on the way</Text>
          <Text style={styles.emptySub}>
            You can easily add parcels yourself if you have a parcel underway that is not listed.
          </Text>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [styles.addParcelBtn, pressed ? styles.pressed : null]}
            accessibilityRole="button"
            accessibilityLabel="Add parcel"
          >
            <Text style={styles.addParcelText}>+ Add parcel</Text>
          </Pressable>

          <Text style={styles.smallHint}>Filter: {filterLabel}</Text>
        </View>

        {/* Archived parcels */}
        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [styles.archived, pressed ? styles.pressed : null]}
          accessibilityRole="button"
          accessibilityLabel="Archived parcels"
        >
          <Text style={styles.archivedText}>Archived parcels</Text>
          <ArrowRight size={18} color={ACCENT} />
        </Pressable>

        {/* Placeholder section title (you can build “Send” cards later) */}
        <Text style={styles.sectionTitle}>Send</Text>

        <View style={styles.gridRow}>
          <View style={styles.gridCard}>
            <View style={styles.illustrationCircle} />
            <Text style={styles.gridTitle}>Letter in Norway</Text>
            <Text style={styles.gridSub}>Up to 350 g</Text>
            <Text style={styles.gridPrice}>From 25 kr</Text>
          </View>

          <View style={styles.gridCard}>
            <View style={styles.illustrationCircle} />
            <Text style={styles.gridTitle}>Parcel in Norway</Text>
            <Text style={styles.gridSub}>Up to 35 kg</Text>
            <Text style={styles.gridPrice}>From 73 kr</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    backgroundColor: HEADER,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -0.8,
    paddingTop: 10,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  addText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  addIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filtersRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.00)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  searchText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },

  chip: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  chipIdle: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.85)',
  },
  chipActive: {
    backgroundColor: '#F7E7E2',
    borderColor: '#F7E7E2',
  },
  chipText: { fontSize: 18, fontWeight: '900' },
  chipTextIdle: { color: '#FFFFFF' },
  chipTextActive: { color: HEADER },

  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },

  emptyCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#0B1220',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
  },
  emptyMarks: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  mark: {
    width: 8,
    height: 18,
    borderRadius: 10,
    backgroundColor: ACCENT,
    transform: [{ rotateZ: '-18deg' }],
  },
  mark2: { height: 14, opacity: 0.85, transform: [{ rotateZ: '0deg' }] },
  mark3: { height: 18, opacity: 0.75, transform: [{ rotateZ: '18deg' }] },

  emptyTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: TEXT,
    marginTop: 6,
  },
  emptySub: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: MUTED,
    lineHeight: 20,
  },
  addParcelBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addParcelText: {
    color: '#D12B2B',
    fontWeight: '900',
    fontSize: 18,
  },
  smallHint: {
    textAlign: 'center',
    marginTop: 8,
    color: 'rgba(107,114,128,0.85)',
    fontWeight: '700',
    fontSize: 12.5,
  },

  archived: {
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(122,11,11,0.25)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archivedText: { fontSize: 18, fontWeight: '900', color: HEADER },

  sectionTitle: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '900',
    color: TEXT,
  },

  gridRow: { flexDirection: 'row', gap: 14, marginTop: 12 },
  gridCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 96,
    height: 96,
    borderRadius: 96,
    backgroundColor: 'rgba(209,43,43,0.10)',
    marginBottom: 10,
  },
  gridTitle: { fontSize: 18, fontWeight: '900', color: TEXT, textAlign: 'center' },
  gridSub: { marginTop: 6, fontSize: 14.5, fontWeight: '700', color: MUTED, textAlign: 'center' },
  gridPrice: { marginTop: 8, fontSize: 16, fontWeight: '900', color: '#D12B2B' },

  pressed: { opacity: 0.92 },
});
