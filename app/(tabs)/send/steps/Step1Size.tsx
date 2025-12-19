import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Box, FileText, Package } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

type Step1SizeProps = {
  onNext: () => void;
};

const SIZES = [
  { id: 'small', label: 'Small', dimensions: '30×20×10 cm', icon: FileText },
  { id: 'medium', label: 'Medium', dimensions: '50×40×30 cm', icon: Box },
  { id: 'large', label: 'Large', dimensions: '80×60×50 cm', icon: Package },
] as const;

const WEIGHT_RANGES = [
  { id: '0-1kg', label: '0 – 1 kg' },
  { id: '1-5kg', label: '1 – 5 kg' },
  { id: '5-10kg', label: '5 – 10 kg' },
  { id: '10-25kg', label: '10 – 25 kg' },
] as const;

const CATEGORIES = ['Document', 'Box', 'Food', 'Electronics', 'Fragile', 'Other'] as const;

export function Step1Size({ onNext }: Step1SizeProps) {
  const { parcel, updateParcel, basePrice } = useSendParcel();

  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(parcel?.size || null);
  const [weightRange, setWeightRange] = useState<string | null>(parcel?.weightRange || null);
  const [category, setCategory] = useState<string | undefined>(parcel?.category);

  const canContinue = useMemo(() => Boolean(size && weightRange), [size, weightRange]);

  const handleContinue = () => {
    if (!size || !weightRange) return;
    updateParcel({ size, weightRange, category });
    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader title="Parcel details" subtitle="Select size, weight and category." />

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Nationwide delivery in Ghana</Text>
          <Text style={styles.noteLine}>• Tracking included</Text>
          <Text style={styles.noteLine}>• Secure handover with PIN</Text>
          <Text style={styles.noteLine}>• Verified agents nationwide</Text>
        </View>

        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.row}>
          {SIZES.map((s) => {
            const Icon = s.icon;
            const selected = size === s.id;

            return (
              <Pressable
                key={s.id}
                onPress={() => setSize(s.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  selected ? styles.optionSelected : null,
                  pressed ? styles.optionPressed : null,
                ]}
              >
                <Icon size={22} color={selected ? '#34B67A' : '#6B7280'} />
                <Text style={[styles.optionTitle, selected ? styles.optionTitleSelected : null]}>
                  {s.label}
                </Text>
                <Text style={styles.optionMeta}>{s.dimensions}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Weight range</Text>
        <View style={styles.stack}>
          {WEIGHT_RANGES.map((w) => {
            const selected = weightRange === w.id;

            return (
              <Pressable
                key={w.id}
                onPress={() => setWeightRange(w.id)}
                style={({ pressed }) => [
                  styles.listItem,
                  selected ? styles.listItemSelected : null,
                  pressed ? styles.listItemPressed : null,
                ]}
              >
                <Text style={[styles.listText, selected ? styles.listTextSelected : null]}>{w.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Category (optional)</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => {
            const selected = category === c;

            return (
              <Pressable
                key={c}
                onPress={() => setCategory(selected ? undefined : c)}
                style={({ pressed }) => [
                  styles.chip,
                  selected ? styles.chipSelected : null,
                  pressed ? styles.chipPressed : null,
                ]}
              >
                <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        {canContinue ? (
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Estimated price</Text>
            <Text style={styles.priceValue}>{formatPrice(basePrice)}</Text>
          </View>
        ) : null}

        <View style={styles.bottomPad} />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 12 },

  noteCard: {
    marginHorizontal: 16,
    marginBottom: 18,
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderColor: 'rgba(52,182,122,0.18)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  noteLine: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },

  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 6,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: 'rgba(52,182,122,0.55)',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  optionPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  optionTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  optionTitleSelected: { color: '#1F7A4E' },
  optionMeta: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },

  stack: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 18,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
  },
  listItemSelected: {
    borderColor: 'rgba(52,182,122,0.55)',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  listItemPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  listText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  listTextSelected: { color: '#1F7A4E' },

  chips: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
  },
  chipSelected: {
    borderColor: 'rgba(52,182,122,0.55)',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  chipPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  chipTextSelected: { color: '#1F7A4E' },

  priceCard: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#34B67A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  bottomPad: { height: 10 },
});
