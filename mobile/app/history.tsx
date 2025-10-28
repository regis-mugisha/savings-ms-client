import { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { savingsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const loadTransactions = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const response = await savingsAPI.getTransactionHistory(pageNum, 20);
      setTransactions(response.transactions);
      setHasMore(pageNum < response.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDeposit = item.type === 'deposit';
    
    return (
      <View className="p-4 mb-2 border-b border-border">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="font-semibold text-lg">
              {isDeposit ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <Text className="text-sm text-muted-foreground mt-1">
              {item.description || item.type}
            </Text>
            <Text className="text-xs text-muted-foreground mt-1">
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <Text className={`text-sm ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
            {isDeposit ? 'Deposit' : 'Withdraw'}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading && transactions.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Transaction History', headerShown: true }} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: 'Transaction History' }} />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-destructive mb-4">{error}</Text>
          <Button onPress={() => loadTransactions()}>
            <Text>Retry</Text>
          </Button>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Transaction History' }} />
      <View className="flex-1">
        {transactions.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-muted-foreground text-center">
              No transactions yet
            </Text>
            <Text className="text-muted-foreground text-center mt-2">
              Start by making a deposit or withdrawal
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item._id}
              contentContainerClassName="p-4"
            />
            {hasMore && (
              <View className="p-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onPress={() => loadTransactions(page + 1)}
                  disabled={isLoading}
                >
                  <Text>Load More</Text>
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
}

