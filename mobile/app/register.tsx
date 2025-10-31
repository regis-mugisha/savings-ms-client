import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { registerForPushNotificationsAsync } from '@/lib/registerForPushNotificationsAsync';
import { Link, Stack, useRouter } from 'expo-router';
import { AlertCircle, CheckCircle2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, deviceId, setPushToken } = useAuth();
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    variant?: 'default' | 'destructive';
  } | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setAlert({ title: 'Error', message: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      setAlert({
        title: 'Error',
        message: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ title: 'Error', message: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (!deviceId) {
      setAlert({
        title: 'Error',
        message: 'Device ID not available. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Clear any previous alerts
    setAlert(null);

    setIsLoading(true);
    try {
      // Obtain push token before registering
      let token: string | undefined;
      try {
        token = await registerForPushNotificationsAsync();
        if (token) setPushToken(token);
      } catch (e) {
        // Proceed without push notifications if permissions denied or error occurs
        token = undefined;
      }

      await register(fullName, email, password, token ?? '');
      setAlert({
        title: 'Registration Successful',
        message:
          'Your account has been created! Please contact admin to verify your device before logging in.',
        variant: 'default',
      });
      // Optionally navigate to login after a short delay
      setTimeout(() => router.replace('/login'), 800);
    } catch (error: any) {
      setAlert({ title: 'Registration Failed', message: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear alert when user starts typing
  const onChangeFullName = (text: string) => {
    setFullName(text);
    if (alert) setAlert(null);
  };
  const onChangeEmail = (text: string) => {
    setEmail(text);
    if (alert) setAlert(null);
  };
  const onChangePassword = (text: string) => {
    setPassword(text);
    if (alert) setAlert(null);
  };
  const onChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (alert) setAlert(null);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Register', headerShown: true }} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={60}
        enableOnAndroid={true}>
        <View className="gap-6 p-6">
          {/* Header */}
          <View className="mb-4 items-center gap-2">
            <Text variant="h1" className="text-4xl font-bold">
              Create Account
            </Text>
            <Text className="text-center text-muted-foreground">
              Sign up to start managing your savings
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
            {/* Full Name Field */}
            <View className="gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={onChangeFullName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            {/* Email Field */}
            <View className="gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={email}
                onChangeText={onChangeEmail}
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
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!isLoading}
              />
            </View>

            {/* Confirm Password Field */}
            <View className="gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={onChangeConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Register Button */}
          <Button onPress={handleRegister} disabled={isLoading} className="mt-4" size="lg">
            <Text>Register</Text>
          </Button>

          {/* Login Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-muted-foreground">Already have an account?</Text>
            <Link href="/login" asChild>
              <Button variant="link" className="h-auto p-0">
                <Text>Login</Text>
              </Button>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
