import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { PriceSummary } from '../components/PriceSummary';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, type RecipientInfo } from '../context/SendParcelContext';

type Step4RecipientProps = {
  onNext: () => void;
  onBack?: () => void;
};

export function Step4Recipient({ onNext, onBack }: Step4RecipientProps) {
  const { recipient, updateRecipient } = useSendParcel();

  const [name, setName] = useState(recipient?.name || '');
  const [phone, setPhone] = useState(recipient?.phone || '');
  const [landmark, setLandmark] = useState(recipient?.landmark || '');

  const isValid = useMemo(() => name.trim().length >= 2 && phone.trim().length >= 7, [name, phone]);

  const handleContinue = () => {
    if (!isValid) return;

    const payload: RecipientInfo = {
      name: name.trim(),
      phone: phone.trim(),
      landmark: landmark.trim() ? landmark.trim() : undefined,
    };

    updateRecipient(payload);
    onNext();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {onBack ? (
          <Pressable onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed ? styles.pressed : null]}>
            <ChevronLeft size={20} color="#111827" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}

        <StepHeader title="Recipient" subtitle="Enter the receiver’s name and phone number." />

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Ama Mensah"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+233 XX XXX XXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
            <Text style={styles.hint}>Recipient can receive updates by SMS (no app required).</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landmark (optional)</Text>
            <TextInput
              style={styles.input}
              value={landmark}
              onChangeText={setLandmark}
              placeholder="e.g., opposite Shell station"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <PriceSummary />
        <View style={{ height: 10 }} />
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!isValid} />
    </KeyboardAvoidingView>
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

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    padding: 14,
  },

  field: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '400', color: '#6B7280', marginBottom: 6 },

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

  hint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 18,
  },

  pressed: { backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 10 },
});
