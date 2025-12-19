import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

const SIZE_LABELS: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export function PriceSummary() {
  const { parcel, selectedDeliveryMethod, pickupFee, totalPrice, basePrice } = useSendParcel();

  if (!parcel) return null;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Parcel</Text>
        <Text style={styles.value}>{SIZE_LABELS[parcel.size] ?? parcel.size}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>{parcel.weightRange}</Text>
      </View>

      {selectedDeliveryMethod && selectedDeliveryMethod.additionalCost > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>{selectedDeliveryMethod.label}</Text>
          <Text style={styles.value}>{formatPrice(selectedDeliveryMethod.additionalCost)}</Text>
        </View>
      ) : null}

      {pickupFee > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>Extra fees</Text>
          <Text style={styles.value}>{formatPrice(pickupFee)}</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
      </View>

      {basePrice > 0 ? (
        <Text style={styles.caption}>Includes base price {formatPrice(basePrice)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.18)',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#34B67A',
  },
  caption: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
});
