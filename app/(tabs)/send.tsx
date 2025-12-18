import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Send as SendIcon, Contact2, History } from 'lucide-react-native';

export default function SendScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Money</Text>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(157, 141, 241, 0.2)' }]}>
            <Contact2 color="#9d8df1" size={24} />
          </View>
          <Text style={styles.actionText}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
            <SendIcon color="#6366f1" size={24} />
          </Size>
          <Text style={styles.actionText}>Quick Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
            <History color="#a855f7" size={24} />
          </View>
          <Text style={styles.actionText}>Recents</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Select a recipient to start</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1021',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionCard: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderCard: {
    margin: 20,
    padding: 40,
    borderRadius: 20,
    backgroundColor: '#1a1b2e',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#2d2e4d',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 16,
  },
});