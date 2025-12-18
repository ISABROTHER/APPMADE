import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Send as SendIcon, Users, History, QrCode } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#34B67A';

export default function SendScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52,182,122,0.1)' }]}>
              <Users color={GREEN} size={24} />
            </View>
            <Text style={styles.cardText}>Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52,182,122,0.1)' }]}>
              <QrCode color={GREEN} size={24} />
            </View>
            <Text style={styles.cardText}>Scan QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52,182,122,0.1)' }]}>
              <History color={GREEN} size={24} />
            </View>
            <Text style={styles.cardText}>Recents</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholderContainer}>
          <SendIcon size={48} color="#E5E5EA" />
          <Text style={styles.placeholderText}>Choose a recipient to get started</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  placeholderContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  placeholderText: {
    marginTop: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontSize: 16,
  },
});