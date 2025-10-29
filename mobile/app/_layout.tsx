import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import * as SystemUI from 'expo-system-ui';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/lib/registerForPushNotificationsAsync';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

function AppContent() {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const { colorScheme } = useColorScheme();
  const { setPushToken } = useAuth();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    const backgroundColor = colorScheme === 'dark' ? '#000000' : '#ffffff';
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setPushToken(token);
        }
      })
      .catch((error: any) => {
        console.error('Failed to register push token:', error);
      });

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [setPushToken]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
