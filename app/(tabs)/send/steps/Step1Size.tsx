import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { parcelSizes, ParcelSize } from '../config/parcelSizes';
import { formatPrice } from '../config/pricing';
import { Package } from 'lucide-react-native';

type Step1SizeProps = {
  onNext: () => void;
};

export const Step1Size = ({ onNext }: Step1SizeProps) => {
  const { selectedSize, updateSize } = useSendParcel();
  const [localSelection, setLocalSelection] = useState<ParcelSize | null>(selectedSize);

  const handleSelectSize = (size: ParcelSize) => {
    setLocalSelection(size);
    updateSize(size);
  };

  const handleContinue = () => {
    if (localSelection) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Pick Size"
          subtitle="Select the parcel size that best fits your package"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Parcel in Norway</Text>
          <Text style={styles.infoItem}>✓ Delivery time: 2-3 working days</Text>
          <Text style={styles.infoItem}>✓ Tracking included</Text>
          <Text style={styles.infoItem}>✓ Compensation included</Text>
          <Text style={styles.infoItem}>✓ Delivery to post office / post-in-shop</Text>
        </View>

        <View style={styles.optionsContainer}>
          {parcelSizes.map((size) => (
            <Pressable
              key={size.id}
              style={({ pressed }) => [
                styles.option,
                localSelection?.id === size.id && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
              onPress={() => handleSelectSize(size)}
            >
              <View style={styles.optionIcon}>
                <Package
                  size={24}
                  color={localSelection?.id === size.id ? '#34B67A' : '#6B7280'}
                />
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{size.label}</Text>
                <Text style={styles.optionDimensions}>{size.dimensions}</Text>
                <Text style={styles.optionWeight}>Up to {size.maxWeight} kg</Text>
              </View>

              <View style={styles.optionPrice}>
                <Text style={styles.priceLabel}>From</Text>
                <Text style={styles.priceValue}>{formatPrice(size.price)}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!localSelection} />
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
  optionsContainer: {
    paddingHorizontal: 18,
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: '#34B67A',
    backgroundColor: 'rgba(52,182,122,0.05)',
  },
  optionPressed: {
    opacity: 0.9,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 4,
  },
  optionDimensions: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  optionWeight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  optionPrice: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34B67A',
  },
});
