import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { Link, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Screen() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If authenticated, show dashboard; otherwise show welcome screen
  if (isAuthenticated && user) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Savings Dashboard',
            headerRight: () => (
              <Button variant="ghost" onPress={logout} size="sm">
                <Text>Logout</Text>
              </Button>
            ),
            headerShown: true,
          }}
        />
        <View className="flex-1 bg-background">
          <View className="flex-1 gap-6 p-4">
            {/* Header */}
            <View className="items-center gap-2">
              <Text variant="h1" className="text-center">
                Welcome, {user.fullName}!
              </Text>
              <Text className="text-center text-muted-foreground">
                Your device is {user.deviceVerified ? 'verified' : 'pending verification'}
              </Text>
            </View>

            {/* Balance Card */}
            <View className="items-center rounded-lg border border-border bg-muted/30 p-6">
              <Text className="mb-2 text-sm text-muted-foreground">Available Balance</Text>
              <Text variant="h1" className="text-4xl font-bold">
                ${user.balance.toFixed(2)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <Link href="/deposit" asChild className="flex-1">
                <Button size="lg">
                  <Text>Deposit</Text>
                </Button>
              </Link>
              <Link href="/withdraw" asChild className="flex-1">
                <Button variant="outline" size="lg">
                  <Text>Withdraw</Text>
                </Button>
              </Link>
            </View>

            {/* Transaction History Link */}
            <Link href="/history" asChild>
              <Button variant="ghost" className="w-full">
                <Text>View Transaction History</Text>
              </Button>
            </Link>
          </View>
        </View>
      </>
    );
  }

  // Welcome screen for unauthenticated users
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Savings App',
          headerShown: true,
        }}
      />
      <View className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-8 p-4">
          <View className="gap-2 p-4">
            <Text variant="h1" className="text-center">
              Savings Management
            </Text>
            <Text className="text-center text-muted-foreground">
              Manage your savings easily and securely
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Link href="/login" asChild>
              <Button>
                <Text>Login</Text>
              </Button>
            </Link>
            <Link href="/register" asChild>
              <Button variant="outline">
                <Text>Register</Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
