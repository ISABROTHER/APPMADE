import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Wallet, 
  Plus, 
  Bell,
  User
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const GREEN = '#34B67A';

export default function HomeScreen() {
  const [filter, setFilter] = useState<'all' | 'to' | 'from'>('all');

  const transactions = [
    { id: '1', title: 'Salary Deposit', subtitle: 'Work Inc.', amount: '+$3,200.00', type: 'to', date: 'Today' },
    { id: '2', title: 'Grocery Store', subtitle: 'Market Street', amount: '-$64.20', type: 'from', date: 'Today' },
    { id: '3', title: 'Rent Payment', subtitle: 'Apartment Co.', amount: '-$1,200.00', type: 'from', date: 'Yesterday' },
    { id: '4', title: 'Refund', subtitle: 'Amazon', amount: '+$15.99', type: 'to', date: 'Dec 15' },
  ];

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' ? true : (filter === 'to' ? t.type === 'to' : t.type === 'from')
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <User size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>User</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Wallet size={20} color="rgba(255,255,255,0.8)" />
          </View>
          <Text style={styles.balanceAmount}>$12,450.00</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.stat}>
              <ArrowDownLeft size={16} color="#fff" />
              <Text style={styles.statText}>Income: $3,200</Text>
            </View>
            <View style={styles.stat}>
              <ArrowUpRight size={16} color="#fff" />
              <Text style={styles.statText}>Spent: $1,150</Text>
            </View>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.mainSendBtn}
            onPress={() => router.push('/send')}
          >
            <View style={styles.sendIconBg}>
              <Send size={20} color="#FFF" />
            </View>
            <Text style={styles.sendBtnText}>Send Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={24} color={GREEN} />
          </TouchableOpacity>
        </View>

        {/* Transaction Header & Filters */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.filterPills}>
            <TouchableOpacity 
              onPress={() => setFilter('all')}
              style={[styles.pill, filter === 'all' && styles.pillActive]}
            >
              <Text style={[styles.pillText, filter === 'all' && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFilter('to')}
              style={[styles.pill, filter === 'to' && styles.pillActive]}
            >
              <Text style={[styles.pillText, filter === 'to' && styles.pillTextActive]}>To Me</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setFilter('from')}
              style={[styles.pill, filter === 'from' && styles.pillActive]}
            >
              <Text style={[styles.pillText, filter === 'from' && styles.pillTextActive]}>From Me</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity List */}
        <View style={styles.activityList}>
          {filteredTransactions.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <View style={[
                  styles.iconBox, 
                  { backgroundColor: item.type === 'to' ? 'rgba(52,182,122,0.1)' : 'rgba(255,59,48,0.1)' }
                ]}>
                  {item.type === 'to' ? (
                    <ArrowDownLeft size={20} color={GREEN} />
                  ) : (
                    <ArrowUpRight size={20} color="#FF3B30" />
                  )}
                </View>
                <View>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle} • {item.date}</Text>
                </View>
              </View>
              <Text style={[
                styles.activityAmount, 
                { color: item.type === 'to' ? GREEN : '#000' }
              ]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  headerCenter: { flex: 1, marginLeft: 15 },
  greeting: { fontSize: 13, color: '#8E8E93' },
  userName: { fontSize: 18, fontWeight: '700', color: '#000' },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: { padding: 20 },
  balanceCard: {
    backgroundColor: GREEN,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginBottom: 20 },
  balanceFooter: { flexDirection: 'row', gap: 20 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  mainSendBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sendIconBg: {
    backgroundColor: GREEN,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { fontWeight: '700', fontSize: 16 },
  addBtn: {
    width: 64,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  filterPills: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  pillActive: { backgroundColor: GREEN, borderColor: GREEN },
  pillText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  pillTextActive: { color: '#FFF' },
  activityList: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8 },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  activityLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityTitle: { fontSize: 15, fontWeight: '600' },
  activitySubtitle: { fontSize: 12, color: '#8E8E93' },
  activityAmount: { fontSize: 16, fontWeight: '700' },
});