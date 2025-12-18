import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Wallet, 
  CreditCard, 
  Bell,
  Search
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Search size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceAmount}>$24,562.00</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>+2.5%</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.cardDetail}>
              <Text style={styles.detailLabel}>Card Holder</Text>
              <Text style={styles.detailValue}>{user?.email?.split('@')[0]?.toUpperCase() || 'USER'}</Text>
            </View>
            <View style={styles.cardDetail}>
              <Text style={styles.detailLabel}>Expiry</Text>
              <Text style={styles.detailValue}>12/26</Text>
            </View>
            <Wallet size={24} color="rgba(255,255,255,0.6)" />
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(52,182,122,0.1)' }]}>
              <Plus size={24} color={GREEN} />
            </View>
            <Text style={styles.actionLabel}>Add</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
              <ArrowUpRight size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionLabel}>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(175,82,222,0.1)' }]}>
              <CreditCard size={24} color="#AF52DE" />
            </View>
            <Text style={styles.actionLabel}>Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          <TransactionItem 
            name="Apple Store" 
            category="Electronics" 
            price="-$999.00" 
            isIncome={false}
          />
          <TransactionItem 
            name="Stripe Payout" 
            category="Business" 
            price="+$4,250.00" 
            isIncome={true}
          />
          <TransactionItem 
            name="Starbucks" 
            category="Food & Drink" 
            price="-$12.50" 
            isIncome={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionItem({ name, category, price, isIncome }: any) {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIconBg}>
          {isIncome ? (
            <ArrowDownLeft size={20} color={GREEN} />
          ) : (
            <ArrowUpRight size={20} color="#FF3B30" />
          )}
        </View>
        <View>
          <Text style={styles.transactionName}>{name}</Text>
          <Text style={styles.transactionCategory}>{category}</Text>
        </View>
      </View>
      <Text style={[styles.transactionPrice, { color: isIncome ? GREEN : '#000' }]}>
        {price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 24,
    height: 200,
    justifyContent: 'space-between',
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceInfo: {
    gap: 4,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 24,
  },
  cardDetail: {
    gap: 2,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  seeAllText: {
    color: GREEN,
    fontWeight: '600',
    fontSize: 14,
  },
  transactionsList: {
    gap: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  transactionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  transactionCategory: {
    fontSize: 13,
    color: '#8E8E93',
  },
  transactionPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
});