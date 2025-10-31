import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { savingsAPI } from '@/lib/api';
import { Stack } from 'expo-router';
import { AlertCircle, CheckCircle2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function WithdrawScreen() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    variant?: 'default' | 'destructive';
  } | null>(null);
  const { user, refreshBalance } = useAuth();

  const handleWithdraw = async () => {
    // Validation
    if (!amount) {
      setAlert({ title: 'Error', message: 'Please enter an amount', variant: 'destructive' });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAlert({ title: 'Error', message: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }

    if (numAmount > (user?.balance || 0)) {
      setAlert({ title: 'Error', message: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    // Clear any previous alerts
    setAlert(null);

    setIsLoading(true);
    try {
      await savingsAPI.withdraw(numAmount);
      await refreshBalance();
      setAlert({
        title: 'Success',
        message: `Successfully withdrew $${numAmount.toFixed(2)}`,
        variant: 'default',
      });
      setAmount('');
    } catch (error: any) {
      setAlert({
        title: 'Error',
        message: error.response?.data?.message || 'Withdrawal failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear alert when user starts typing
  const handleAmountChange = (text: string) => {
    setAmount(text);
    if (alert) setAlert(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Withdraw', headerShown: true }} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}>
        <View className="gap-6 p-6">
          {/* Current Balance */}
          <View className="gap-2 rounded-lg border border-border bg-muted/30 p-4">
            <Text className="text-sm text-muted-foreground">Available Balance</Text>
            <Text variant="h1" className="text-3xl font-bold">
              ${user?.balance.toFixed(2) || '0.00'}
            </Text>
          </View>

          {/* Alert */}
          {alert && (
            <View className="relative">
              <Alert
                variant={alert.variant}
                icon={alert.variant === 'destructive' ? AlertCircle : CheckCircle2}>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
              <Pressable onPress={() => setAlert(null)} className="absolute right-2 top-2 p-1">
                <Icon as={X} className="text-muted-foreground" size={18} />
              </Pressable>
            </View>
          )}

          {/* Form */}
          <View className="gap-4">
            <View className="gap-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Withdraw Button */}
          <Button onPress={handleWithdraw} disabled={isLoading} size="lg">
            <Text>Withdraw</Text>
          </Button>

          {/* Info */}
          <Text className="text-center text-sm text-muted-foreground">
            Funds will be deducted from your account immediately
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
