import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Home, Truck } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { deliveryMethods, type DeliveryMethod } from '../config/deliveryMethods';
import { formatPrice } from '../config/pricing';

type Step2DeliveryMethodProps = {
  onNext: () => void;
  onBack?: () => void;
};

export function Step2DeliveryMethod({ onNext, onBack }: Step2DeliveryMethodProps) {
  const { selectedDeliveryMethod, updateDeliveryMethod } = useSendParcel();

  const [localSelection, setLocalSelection] = useState<DeliveryMethod | null>(
    selectedDeliveryMethod || deliveryMethods[0] || null
  );

  useEffect(() => {
    if (!selectedDeliveryMethod && deliveryMethods[0]) {
      updateDeliveryMethod(deliveryMethods[0]);
      setLocalSelection(deliveryMethods[0]);
    }
  }, [selectedDeliveryMethod, updateDeliveryMethod]);

  const canContinue = useMemo(() => Boolean(localSelection), [localSelection]);

  const handleSelect = (m: DeliveryMethod) => {
    setLocalSelection(m);
    updateDeliveryMethod(m);
  };

  const getIcon = (methodId: string) => {
    return methodId === 'self' ? Truck : Home;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {onBack ? (
          <Pressable onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed ? styles.pressed : null]}>
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}

        <StepHeader title="Delivery method" subtitle="Choose how you want to hand the parcel over." />

        <View style={styles.card}>
          {deliveryMethods.map((method, idx) => {
            const Icon = getIcon(method.id);
            const selected = localSelection?.id === method.id;

            return (
              <React.Fragment key={method.id}>
                <Pressable
                  onPress={() => handleSelect(method)}
                  style={({ pressed }) => [
                    styles.option,
                    selected ? styles.optionSelected : null,
                    pressed ? styles.optionPressed : null,
                  ]}
                >
                  <View style={[styles.iconWrap, selected ? styles.iconWrapSelected : null]}>
                    <Icon size={20} color={selected ? '#1F7A4E' : '#6B7280'} strokeWidth={2} />
                  </View>

                  <View style={styles.optionBody}>
                    <View style={styles.optionTopRow}>
                      <Text style={styles.optionTitle}>{method.label}</Text>
                      {method.additionalCost > 0 ? (
                        <Text style={styles.optionPrice}>+ {formatPrice(method.additionalCost)}</Text>
                      ) : (
                        <Text style={styles.optionPriceMuted}>Included</Text>
                      )}
                    </View>
                    <Text style={styles.optionDesc}>{method.description}</Text>
                  </View>

                  <View style={[styles.radioOuter, selected ? styles.radioOuterSelected : null]}>
                    {selected ? <View style={styles.radioInner} /> : null}
                  </View>
                </Pressable>

                {idx < deliveryMethods.length - 1 ? <View style={styles.sep} /> : null}
              </React.Fragment>
            );
          })}
        </View>

        <PriceSummary />
        <View style={{ height: 10 }} />
      </ScrollView>

      <ContinueButton onPress={onNext} disabled={!canContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 12 },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    overflow: 'hidden',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: 'rgba(52,182,122,0.06)',
  },
  optionPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(52,182,122,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(52,182,122,0.18)',
  },

  optionBody: { flex: 1 },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F7A4E',
  },
  optionPriceMuted: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(60,60,67,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: '#34B67A',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34B67A',
  },

  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.18)',
    marginLeft: 60,
  },

  pressed: { backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 10 },
});
