import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChevronDown, ChevronUp, User, UserCheck } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel } from '../context/SendParcelContext';

type Step4PartiesProps = {
  onNext: () => void;
};

export function Step4Parties({ onNext }: Step4PartiesProps) {
  const { sender, recipient, route, updateSender, updateRecipient } = useSendParcel();

  const [senderExpanded, setSenderExpanded] = useState(true);
  const [recipientExpanded, setRecipientExpanded] = useState(false);

  const [senderName, setSenderName] = useState(sender?.name || '');
  const [senderPhone, setSenderPhone] = useState(sender?.phone || '');

  const [recipientName, setRecipientName] = useState(recipient?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(recipient?.phone || '');
  const [recipientLandmark, setRecipientLandmark] = useState(recipient?.landmark || '');

  const canContinue = useMemo(
    () => Boolean(senderName && senderPhone && recipientName && recipientPhone),
    [senderName, senderPhone, recipientName, recipientPhone]
  );

  const handleContinue = () => {
    if (!canContinue) return;

    updateSender({ name: senderName, phone: senderPhone });
    updateRecipient({
      name: recipientName,
      phone: recipientPhone,
      landmark: recipientLandmark || undefined,
    });

    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Sender & recipient" subtitle="Who is sending and receiving this parcel?" />

        <View style={styles.card}>
          <Pressable
            onPress={() => setSenderExpanded((v) => !v)}
            style={({ pressed }) => [styles.cardHeader, pressed ? styles.pressed : null]}
          >
            <View style={styles.headerLeft}>
              <View style={styles.iconWrap}>
                <User size={18} color="#1F7A4E" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Sender</Text>
            </View>
            {senderExpanded ? <ChevronUp size={18} color="#8E8E93" /> : <ChevronDown size={18} color="#8E8E93" />}
          </Pressable>

          {senderExpanded ? (
            <View style={styles.cardBody}>
              <View style={styles.field}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={senderName}
                  onChangeText={setSenderName}
                  placeholder="Your full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={senderPhone}
                  onChangeText={setSenderPhone}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.readonly}>
                <Text style={styles.readonlyLabel}>Origin</Text>
                <Text style={styles.readonlyValue} numberOfLines={3}>
                  {route?.origin.cityTown}, {route?.origin.region}
                  {route?.origin.landmark ? ` (${route.origin.landmark})` : ''}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Pressable
            onPress={() => setRecipientExpanded((v) => !v)}
            style={({ pressed }) => [styles.cardHeader, pressed ? styles.pressed : null]}
          >
            <View style={styles.headerLeft}>
              <View style={styles.iconWrap}>
                <UserCheck size={18} color="#1F7A4E" strokeWidth={2} />
              </View>
              <Text style={styles.cardTitle}>Recipient</Text>
            </View>
            {recipientExpanded ? <ChevronUp size={18} color="#8E8E93" /> : <ChevronDown size={18} color="#8E8E93" />}
          </Pressable>

          {recipientExpanded ? (
            <View style={styles.cardBody}>
              <View style={styles.field}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="Recipient's full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={recipientPhone}
                  onChangeText={setRecipientPhone}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
                <Text style={styles.hint}>Recipient will receive SMS updates (no app required).</Text>
              </View>

              <View style={styles.readonly}>
                <Text style={styles.readonlyLabel}>Destination</Text>
                <Text style={styles.readonlyValue} numberOfLines={3}>
                  {route?.destination.cityTown}, {route?.destination.region}
                  {route?.destination.landmark ? ` (${route.destination.landmark})` : ''}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Additional landmark (optional)</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  value={recipientLandmark}
                  onChangeText={setRecipientLandmark}
                  placeholder="e.g., White gate, second floor"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          ) : null}
        </View>

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
    overflow: 'hidden',
  },

  cardHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(52,182,122,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },

  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60,60,67,0.18)',
  },

  field: { marginTop: 12 },
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

  hint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 18,
  },

  readonly: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.12)',
  },
  readonlyLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 4,
  },
  readonlyValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 20,
  },

  pressed: { backgroundColor: 'rgba(0,0,0,0.03)' },
});
