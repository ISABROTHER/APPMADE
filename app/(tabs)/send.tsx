import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

type PriceSummaryProps = {
  basePrice?: number;
  additionalFee?: number;
  total?: number;
};

export const PriceSummary = ({ basePrice, additionalFee, total }: PriceSummaryProps) => {
  const ctx = useSendParcel();

  const selectedSize = ctx.selectedSize;
  const selectedDeliveryMethod = ctx.selectedDeliveryMethod;

  const computedBase = typeof basePrice === 'number' ? basePrice : ctx.basePrice;
  const computedFee = typeof additionalFee === 'number' ? additionalFee : ctx.pickupFee;
  const computedTotal = typeof total === 'number' ? total : ctx.totalPrice;

  if (!selectedSize) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Parcel</Text>
        <Text style={styles.value}>{selectedSize.label}</Text>
      </View>

      {selectedDeliveryMethod && selectedDeliveryMethod.additionalCost > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>{selectedDeliveryMethod.label}</Text>
          <Text style={styles.value}>{formatPrice(selectedDeliveryMethod.additionalCost)}</Text>
        </View>
      ) : null}

      {computedFee > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>Pickup fee</Text>
          <Text style={styles.value}>{formatPrice(computedFee)}</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(computedTotal)}</Text>
      </View>

      {/* optional: keep base visible if needed */}
      {computedBase > 0 ? (
        <Text style={styles.caption}>Includes base price {formatPrice(computedBase)}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
