import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { Route, useSendParcel } from '../context/SendParcelContext';

type Step2RouteProps = {
  onNext: () => void;
};

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Bono',
  'Bono East',
  'Ahafo',
  'Savannah',
  'North East',
  'Oti',
  'Western North',
];

export function Step2Route({ onNext }: Step2RouteProps) {
  const { route, updateRoute } = useSendParcel();

  const [originRegion, setOriginRegion] = useState(route?.origin.region || '');
  const [originCity, setOriginCity] = useState(route?.origin.cityTown || '');
  const [originLandmark, setOriginLandmark] = useState(route?.origin.landmark || '');
  const [showOriginRegions, setShowOriginRegions] = useState(false);

  const [destRegion, setDestRegion] = useState(route?.destination.region || '');
  const [destCity, setDestCity] = useState(route?.destination.cityTown || '');
  const [destLandmark, setDestLandmark] = useState(route?.destination.landmark || '');
  const [showDestRegions, setShowDestRegions] = useState(false);

  const canContinue = useMemo(
    () => Boolean(originRegion && originCity && destRegion && destCity),
    [originRegion, originCity, destRegion, destCity]
  );

  const handleContinue = () => {
    if (!canContinue) return;

    const routeData: Route = {
      origin: {
        region: originRegion,
        cityTown: originCity,
        landmark: originLandmark || undefined,
      },
      destination: {
        region: destRegion,
        cityTown: destCity,
        landmark: destLandmark || undefined,
      },
    };

    updateRoute(routeData);
    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader title="Route" subtitle="Where is the parcel coming from and going to?" />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <MapPin size={18} color="#1F7A4E" strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Origin (From)</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Region *</Text>
            <Pressable
              onPress={() => setShowOriginRegions((v) => !v)}
              style={({ pressed }) => [styles.dropdownBtn, pressed ? styles.pressed : null]}
            >
              <Text style={[styles.dropdownText, !originRegion ? styles.placeholder : null]}>
                {originRegion || 'Select region'}
              </Text>
            </Pressable>

            {showOriginRegions ? (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {GHANA_REGIONS.map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => {
                        setOriginRegion(r);
                        setShowOriginRegions(false);
                      }}
                      style={({ pressed }) => [styles.dropdownItem, pressed ? styles.pressed : null]}
                    >
                      <Text style={styles.dropdownItemText}>{r}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>City/Town *</Text>
            <TextInput
              style={styles.input}
              value={originCity}
              onChangeText={setOriginCity}
              placeholder="e.g., Accra, Kumasi"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landmark (optional)</Text>
            <TextInput
              style={styles.input}
              value={originLandmark}
              onChangeText={setOriginLandmark}
              placeholder="e.g., Shell station, opposite mosque"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <MapPin size={18} color="#1F7A4E" strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Destination (To)</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Region *</Text>
            <Pressable
              onPress={() => setShowDestRegions((v) => !v)}
              style={({ pressed }) => [styles.dropdownBtn, pressed ? styles.pressed : null]}
            >
              <Text style={[styles.dropdownText, !destRegion ? styles.placeholder : null]}>
                {destRegion || 'Select region'}
              </Text>
            </Pressable>

            {showDestRegions ? (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {GHANA_REGIONS.map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => {
                        setDestRegion(r);
                        setShowDestRegions(false);
                      }}
                      style={({ pressed }) => [styles.dropdownItem, pressed ? styles.pressed : null]}
                    >
                      <Text style={styles.dropdownItemText}>{r}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>City/Town *</Text>
            <TextInput
              style={styles.input}
              value={destCity}
              onChangeText={setDestCity}
              placeholder="e.g., Cape Coast, Tamale"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Landmark (optional)</Text>
            <TextInput
              style={styles.input}
              value={destLandmark}
              onChangeText={setDestLandmark}
              placeholder="e.g., White gate, behind market"
              placeholderTextColor="#9CA3AF"
            />
          </View>
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
    padding: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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

  field: {
    marginBottom: 12,
  },

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

  dropdownBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.18)',
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 220,
    backgroundColor: '#FFFFFF',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
  },

  pressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});
