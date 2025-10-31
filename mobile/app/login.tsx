import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { Link, Stack, useRouter } from 'expo-router';
import { AlertCircle, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    variant?: 'default' | 'destructive';
  } | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setAlert({ title: 'Error', message: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    // Clear any previous alerts
    setAlert(null);

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigate to dashboard after successful login
      router.replace('/');
    } catch (error: any) {
      setAlert({ title: 'Login Failed', message: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear alert when user starts typing
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (alert) setAlert(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (alert) setAlert(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: true }} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}>
        <View className="gap-6 p-6">
          {/* Header */}
          <View className="mb-4 items-center gap-2">
            <Text variant="h1" className="text-4xl font-bold">
              Welcome Back
            </Text>
            <Text className="text-center text-muted-foreground">
              Sign in to your account to continue
            </Text>
          </View>

          {/* Alert */}
          {alert && (
            <View className="relative">
              <Alert variant={alert.variant} icon={AlertCircle}>
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
            {/* Email Field */}
            <View className="gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            {/* Password Field */}
            <View className="gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Login Button */}
          <Button onPress={handleLogin} disabled={isLoading} className="mt-4" size="lg">
            <Text>Login</Text>
          </Button>

          {/* Register Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted-foreground">Don't have an account?</Text>
            <Link href="/register" asChild>
              <Button variant="link" className="h-auto p-0">
                <Text>Register</Text>
              </Button>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
