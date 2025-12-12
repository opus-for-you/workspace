import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="purpose" options={{ title: "Your Purpose" }} />
      <Stack.Screen name="method" options={{ title: "Your Work Style" }} />
      <Stack.Screen name="goals" options={{ title: "Your Goals" }} />
      <Stack.Screen name="key-people" options={{ title: "Your Network" }} />
    </Stack>
  );
}
