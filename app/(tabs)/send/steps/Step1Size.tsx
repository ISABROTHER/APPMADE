import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, ParcelDetails } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';
import { Package, Box, FileText } from 'lucide-react-native';

type Step1SizeProps = {
  onNext: () => void;
};

const SIZES = [
  { id: 'small', label: 'Small', dimensions: '30×20×10 cm', icon: FileText },
  { id: 'medium', label: 'Medium', dimensions: '50×40×30 cm', icon: Box },
  { id: 'large', label: 'Large', dimensions: '80×60×50 cm', icon: Package },
] as const;

const WEIGHT_RANGES = [
  { id: '0-1kg', label: '0 - 1 kg' },
  { id: '1-5kg', label: '1 - 5 kg' },
  { id: '5-10kg', label: '5 - 10 kg' },
  { id: '10-25kg', label: '10 - 25 kg' },
] as const;

const CATEGORIES = [
  'Document',
  'Box',
  'Food',
  'Electronics',
  'Fragile',
  'Other',
] as const;

export const Step1Size = ({ onNext }: Step1SizeProps) => {
  const { parcel, updateParcel, basePrice } = useSendParcel();
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(
    parcel?.size || null
  );
  const [weightRange, setWeightRange] = useState<string | null>(
    parcel?.weightRange || null
  );
  const [category, setCategory] = useState<string | undefined>(parcel?.category);

  const handleContinue = () => {
    if (size && weightRange) {
      updateParcel({ size, weightRange, category });
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Parcel Details"
          subtitle="Tell us about the parcel you want to send"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Send in Ghana - Nationwide</Text>
          <Text style={styles.infoItem}>✓ Tracking included</Text>
          <Text style={styles.infoItem}>✓ Secure handover with PIN</Text>
          <Text style={styles.infoItem}>✓ Verified agents nationwide</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsRow}>
            {SIZES.map((s) => {
              const Icon = s.icon;
              const isSelected = size === s.id;
              return (
                <Pressable
                  key={s.id}
                  style={[styles.sizeOption, isSelected && styles.optionSelected]}
                  onPress={() => setSize(s.id)}
                >
                  <Icon size={28} color={isSelected ? '#34B67A' : '#6B7280'} />
                  <Text style={[styles.optionLabel, isSelected && styles.labelSelected]}>
                    {s.label}
                  </Text>
                  <Text style={styles.optionDimensions}>{s.dimensions}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Range</Text>
          <View style={styles.optionsColumn}>
            {WEIGHT_RANGES.map((w) => {
              const isSelected = weightRange === w.id;
              return (
                <Pressable
                  key={w.id}
                  style={[styles.weightOption, isSelected && styles.optionSelected]}
                  onPress={() => setWeightRange(w.id)}
                >
                  <Text style={[styles.weightLabel, isSelected && styles.labelSelected]}>
                    {w.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category (Optional)</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((c) => {
              const isSelected = category === c;
              return (
                <Pressable
                  key={c}
                  style={[styles.categoryOption, isSelected && styles.optionSelected]}
                  onPress={() => setCategory(isSelected ? undefined : c)}
                >
                  <Text style={[styles.categoryLabel, isSelected && styles.labelSelected]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {size && weightRange && (
          <View style={styles.pricePreview}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>{formatPrice(basePrice)}</Text>
          </View>
        )}
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!size || !weightRange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  infoBox: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  optionSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1220',
    marginTop: 8,
  },
  labelSelected: {
    color: '#34B67A',
  },
  optionDimensions: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },
  optionsColumn: {
    gap: 10,
  },
  weightOption: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  weightLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1220',
  },
  pricePreview: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#34B67A',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
