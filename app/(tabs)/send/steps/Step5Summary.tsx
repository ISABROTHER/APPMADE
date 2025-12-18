import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';
import { formatPrice } from '../config/pricing';
import { CheckSquare, Square } from 'lucide-react-native';

type Step5SummaryProps = {
  onComplete: () => void;
};

export const Step5Summary = ({ onComplete }: Step5SummaryProps) => {
  const { selectedSize, selectedDeliveryMethod, sender, recipient, totalPrice } = useSendParcel();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!acceptedTerms) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onComplete();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Review and Confirm" subtitle="Check your details before paying" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parcel Details</Text>
          <View style={styles.card}>
            <InfoRow label="Size" value={selectedSize?.label || ''} />
            <InfoRow label="Dimensions" value={selectedSize?.dimensions || ''} />
            <InfoRow label="Max Weight" value={`${selectedSize?.maxWeight} kg`} />
            <InfoRow
              label="Delivery Method"
              value={selectedDeliveryMethod?.label || ''}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sender</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={sender?.name || ''} />
            <InfoRow label="Phone" value={sender?.phone || ''} />
            <InfoRow label="Email" value={sender?.email || ''} />
            <InfoRow
              label="Address"
              value={`${sender?.address}, ${sender?.postalCode} ${sender?.city}`}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={recipient?.name || ''} />
            <InfoRow label="Phone" value={recipient?.phone || ''} />
            <InfoRow
              label="Address"
              value={`${recipient?.address}, ${recipient?.postalCode} ${recipient?.city}`}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.card}>
            <InfoRow label="Parcel" value={formatPrice(selectedSize?.price || 0)} />
            {selectedDeliveryMethod && selectedDeliveryMethod.additionalCost > 0 && (
              <InfoRow
                label={selectedDeliveryMethod.label}
                value={formatPrice(selectedDeliveryMethod.additionalCost)}
              />
            )}
            <View style={styles.divider} />
            <InfoRow label="Total" value={formatPrice(totalPrice)} highlight isLast />
          </View>

          <View style={styles.paymentMethod}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <View style={styles.vippsButton}>
              <Text style={styles.vippsText}>Vipps</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.termsContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          {acceptedTerms ? (
            <CheckSquare size={20} color="#34B67A" />
          ) : (
            <Square size={20} color="#6B7280" />
          )}
          <Text style={styles.termsText}>
            I accept Posten's terms and conditions
          </Text>
        </Pressable>
      </ScrollView>

      <ContinueButton
        onPress={handlePay}
        disabled={!acceptedTerms}
        loading={loading}
        label="Pay"
      />
    </View>
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
  isLast = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B1220',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11,18,32,0.06)',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1220',
    textAlign: 'right',
    flex: 2,
  },
  infoValueHighlight: {
    fontSize: 16,
    color: '#34B67A',
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(11,18,32,0.08)',
    marginVertical: 8,
  },
  paymentMethod: {
    marginTop: 12,
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  vippsButton: {
    backgroundColor: '#FF5B24',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  vippsText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0B1220',
  },
});
