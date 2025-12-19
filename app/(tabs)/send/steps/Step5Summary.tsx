import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckSquare, ChevronLeft, Square } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';

type Step5SummaryProps = {
  onBack?: () => void;
  onComplete: () => void;
};

const SIZE_LABELS: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export function Step5Summary({ onBack, onComplete }: Step5SummaryProps) {
  const { parcel, selectedDeliveryMethod, sender, recipient, totalPrice, basePrice, pickupFee } = useSendParcel();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const canPay = useMemo(() => {
    return Boolean(parcel && sender && recipient && acceptedTerms);
  }, [parcel, sender, recipient, acceptedTerms]);

  const handlePay = async () => {
    if (!canPay) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);

    onComplete();
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

        <StepHeader title="Review & Pay" subtitle="Confirm the details before you pay." />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parcel</Text>
          <View style={styles.card}>
            <InfoRow label="Size" value={parcel ? SIZE_LABELS[parcel.size] ?? parcel.size : '—'} />
            <InfoRow label="Weight" value={parcel?.weightRange ?? '—'} />
            <InfoRow label="Category" value={parcel?.category ?? '—'} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          <View style={styles.card}>
            <InfoRow label="Method" value={selectedDeliveryMethod?.label ?? '—'} />
            <InfoRow label="Extra cost" value={formatPrice(selectedDeliveryMethod?.additionalCost ?? 0)} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sender</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={sender?.name ?? '—'} />
            <InfoRow label="Phone" value={sender?.phone ?? '—'} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={recipient?.name ?? '—'} />
            <InfoRow label="Phone" value={recipient?.phone ?? '—'} />
            <InfoRow label="Landmark" value={recipient?.landmark ?? '—'} isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.card}>
            <InfoRow label="Base price" value={formatPrice(basePrice)} />
            <InfoRow label="Extra fees" value={formatPrice(pickupFee)} />
            <View style={styles.divider} />
            <InfoRow label="Total" value={formatPrice(totalPrice)} highlight isLast />
          </View>

          <View style={styles.payMethodPill}>
            <Text style={styles.payMethodText}>Payment method: Mobile Money</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.termsRow, pressed ? styles.termsPressed : null]}
          onPress={() => setAcceptedTerms((v) => !v)}
        >
          {acceptedTerms ? <CheckSquare size={20} color="#34B67A" /> : <Square size={20} color="#6B7280" />}
          <Text style={styles.termsText}>I accept the terms and conditions</Text>
        </Pressable>

        <View style={{ height: 10 }} />
      </ScrollView>

      <ContinueButton onPress={handlePay} disabled={!canPay} loading={loading} label="Pay" />
    </View>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
  isLast = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !isLast ? styles.infoRowBorder : null]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight ? styles.infoValueHighlight : null]} numberOfLines={2}>
        {value}
      </Text>
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
  backText: { fontSize: 15, fontWeight: '500', color: '#111827' },

  section: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60,60,67,0.18)',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
    flex: 2,
  },
  infoValueHighlight: {
    fontSize: 17,
    fontWeight: '600',
    color: '#34B67A',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.18)',
  },

  payMethodPill: {
    marginTop: 10,
    backgroundColor: 'rgba(52,182,122,0.10)',
    borderColor: 'rgba(52,182,122,0.20)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  payMethodText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F7A4E',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  termsPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    lineHeight: 18,
  },

  pressed: { backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 10 },
});
