import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/lib/auth-store';

export default function Index() {
  const { user, isLoading } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure router is mounted
      setTimeout(() => setReady(true), 100);
    }
  }, [isLoading]);

  if (!ready || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF5' }}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  // User is logged in
  if (user) {
    // Check if user has completed onboarding
    if (user.northStar) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/(onboarding)/north-star" />;
    }
  }

  // User is not logged in
  return <Redirect href="/(auth)/login" />;
}
