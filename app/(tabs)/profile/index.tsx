import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wallet, 
  CreditCard, 
  Bell 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#34B67A';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
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

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(52,182,122,0.1)' }]}>
              <Plus size={24} color={GREEN} />
            </View>
            <Text style={styles.actionLabel}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
              <CreditCard size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionLabel}>Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          <ActivityItem 
            title="Grocery Store" 
            subtitle="Today, 2:45 PM" 
            amount="-$64.20" 
            type="expense" 
          />
          <ActivityItem 
            title="Salary Deposit" 
            subtitle="Yesterday" 
            amount="+$3,200.00" 
            type="income" 
          />
          <ActivityItem 
            title="Netflix Subscription" 
            subtitle="Dec 15, 2023" 
            amount="-$15.99" 
            type="expense" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityItem({ title, subtitle, amount, type }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityLeft}>
        <View style={styles.activityDot} />
        <View>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activitySubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={[
        styles.activityAmount, 
        { color: type === 'income' ? GREEN : '#FF3B30' }
      ]}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: GREEN,
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
  },
  balanceFooter: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  seeAll: {
    color: GREEN,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  actionItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});