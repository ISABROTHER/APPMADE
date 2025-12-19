import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Home, Store } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { PriceSummary } from '../components/PriceSummary';
import { Handover, useSendParcel } from '../context/SendParcelContext';
import { PICKUP_FEE, formatPrice } from '../config/pricing';

type Step3HandoverMethodProps = {
  onNext: () => void;
};

export function Step3HandoverMethod({ onNext }: Step3HandoverMethodProps) {
  const { handover, updateHandover, route } = useSendParcel();

  const [method, setMethod] = useState<'DROPOFF' | 'PICKUP'>(handover?.method || 'DROPOFF');
  const [pickupLandmark, setPickupLandmark] = useState(handover?.pickupDetails?.landmark || '');
  const [pickupPhone, setPickupPhone] = useState(handover?.pickupDetails?.phone || '');
  const [pickupTiming, setPickupTiming] = useState<'ASAP' | 'TODAY' | 'SCHEDULE'>(
    handover?.pickupDetails?.timing || 'ASAP'
  );

  const canContinue = useMemo(() => {
    if (method === 'DROPOFF') return true;
    return Boolean(pickupLandmark && pickupPhone);
  }, [method, pickupLandmark, pickupPhone]);

  const handleContinue = () => {
    if (!canContinue) return;

    const handoverData: Handover = {
      method,
      pickupDetails:
        method === 'PICKUP'
          ? {
              landmark: pickupLandmark,
              phone: pickupPhone,
              timing: pickupTiming,
            }
          : undefined,
    };

    updateHandover(handoverData);
    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Handover method" subtitle="Drop-off at an agent or request agent pickup." />

        <View style={styles.card}>
          <Pressable
            onPress={() => setMethod('DROPOFF')}
            style={({ pressed }) => [
              styles.option,
              method === 'DROPOFF' ? styles.optionSelected : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.optionIcon}>
              <Store size={20} color={method === 'DROPOFF' ? '#1F7A4E' : '#6B7280'} strokeWidth={2} />
            </View>

            <View style={styles.optionBody}>
              <Text style={styles.optionTitle}>Drop-off at agent</Text>
              <Text style={styles.optionDesc}>Bring the parcel to a nearby agent point.</Text>
              <Text style={styles.optionMeta}>No extra fee</Text>
            </View>
          </Pressable>

          <View style={styles.sep} />

          <Pressable
            onPress={() => setMethod('PICKUP')}
            style={({ pressed }) => [
              styles.option,
              method === 'PICKUP' ? styles.optionSelected : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.optionIcon}>
              <Home size={20} color={method === 'PICKUP' ? '#1F7A4E' : '#6B7280'} strokeWidth={2} />
            </View>

            <View style={styles.optionBody}>
              <Text style={styles.optionTitle}>Agent picks up</Text>
              <Text style={styles.optionDesc}>Agent comes to your location to collect the parcel.</Text>
              <Text style={[styles.optionMeta, styles.feeMeta]}>+ {formatPrice(PICKUP_FEE)}</Text>
            </View>
          </Pressable>
        </View>

        {method === 'PICKUP' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pickup details</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Pickup location / landmark *</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={pickupLandmark}
                onChangeText={setPickupLandmark}
                placeholder={`e.g., Near ${route?.origin.cityTown || 'your area'}`}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Pickup phone *</Text>
              <TextInput
                style={styles.input}
                value={pickupPhone}
                onChangeText={setPickupPhone}
                placeholder="+233 XX XXX XXXX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.subLabel}>Pickup timing</Text>
            <View style={styles.timingRow}>
              {(['ASAP', 'TODAY', 'SCHEDULE'] as const).map((t) => {
                const selected = pickupTiming === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setPickupTiming(t)}
                    style={({ pressed }) => [
                      styles.timingChip,
                      selected ? styles.timingChipSelected : null,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <Text style={[styles.timingText, selected ? styles.timingTextSelected : null]}>
                      {t === 'ASAP' ? 'ASAP' : t === 'TODAY' ? 'Today' : 'Schedule'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <PriceSummary />
        <View style={{ height: 10 }} />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 12 },

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    padding: 14,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: 'rgba(52,182,122,0.06)',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  optionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(52,182,122,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  optionBody: { flex: 1 },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  optionMeta: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  feeMeta: {
    color: '#1F7A4E',
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.18)',
    marginVertical: 6,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },

  field: { marginBottom: 12 },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: '400',
    color: '#111827',
  },
  multiline: { minHeight: 52, textAlignVertical: 'top' },

  subLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },

  timingRow: { flexDirection: 'row', gap: 10 },
  timingChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    backgroundColor: '#FFFFFF',
  },
  timingChipSelected: {
    borderColor: 'rgba(52,182,122,0.55)',
    backgroundColor: 'rgba(52,182,122,0.06)',
  },
  timingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timingTextSelected: { color: '#1F7A4E' },

  pressed: { backgroundColor: 'rgba(0,0,0,0.03)' },
});
