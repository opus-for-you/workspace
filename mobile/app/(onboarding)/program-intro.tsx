import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { onboardingAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

const PROGRAM_WEEKS = [
  {
    week: 1,
    title: 'Purpose',
    description: 'Define your north star and identify meaningful work',
    icon: '🎯',
  },
  {
    week: 2,
    title: 'Rhythm',
    description: 'Build daily habits and consistent practices',
    icon: '⚡',
  },
  {
    week: 3,
    title: 'Network',
    description: 'Strengthen connections and build relationships',
    icon: '🤝',
  },
  {
    week: 4,
    title: 'Structure',
    description: 'Design systems that support your goals',
    icon: '🏗️',
  },
  {
    week: 5,
    title: 'Methods',
    description: 'Refine techniques and optimize your approach',
    icon: '🔧',
  },
];

export default function ProgramIntroScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const startMutation = useMutation({
    mutationFn: () => onboardingAPI.startProgram(),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
      router.replace('/(tabs)');
    },
  });

  const handleStart = () => {
    startMutation.mutate();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your 5-Week Journey</Text>
          <Text style={styles.subtitle}>
            A structured program to transform your professional life
          </Text>
        </View>

        <View style={styles.weeks}>
          {PROGRAM_WEEKS.map((item, index) => (
            <View key={item.week} style={styles.weekCard}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekIcon}>{item.icon}</Text>
                <View style={styles.weekInfo}>
                  <Text style={styles.weekLabel}>Week {item.week}</Text>
                  <Text style={styles.weekTitle}>{item.title}</Text>
                </View>
              </View>
              <Text style={styles.weekDescription}>{item.description}</Text>
              {index < PROGRAM_WEEKS.length - 1 && (
                <View style={styles.connector} />
              )}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Each week, AI will guide you with personalized goals and tasks based on your north star.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {startMutation.isError && (
          <Text style={styles.errorText}>
            {startMutation.error?.message || 'Failed to start program'}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.button, startMutation.isPending && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={startMutation.isPending}
        >
          {startMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Begin My Journey</Text>
          )}
        </TouchableOpacity>

        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 160,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C2C2C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  weeks: {
    gap: 0,
  },
  weekCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  weekInfo: {
    flex: 1,
  },
  weekLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 2,
  },
  weekDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  connector: {
    position: 'absolute',
    bottom: -16,
    left: 36,
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
  },
  footer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#5A7F6A',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FAFAF5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#5A7F6A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#5A7F6A',
    width: 24,
  },
});
