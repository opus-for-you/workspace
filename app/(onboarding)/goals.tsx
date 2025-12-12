import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { goalsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

type Goal = {
  id: string;
  title: string;
  description: string | null;
  progress: number;
  aiGenerated: number;
};

export default function GoalsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [hasGenerated, setHasGenerated] = useState(false);

  // Fetch existing goals
  const { data: goalsData, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const goals = goalsData || [];

  const generateMutation = useMutation({
    mutationFn: () => goalsAPI.generateGoals(),
    onSuccess: () => {
      setHasGenerated(true);
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to generate goals');
    },
  });

  const handleGenerate = () => {
    if (!user?.purposeSummary) {
      Alert.alert('Error', 'Purpose summary not found. Please complete Step 1 first.');
      return;
    }
    generateMutation.mutate();
  };

  const handleContinue = () => {
    if (goals.length === 0) {
      Alert.alert('Required', 'Please generate at least 1 goal before continuing');
      return;
    }
    router.push('/(onboarding)/key-people');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.progress}>Step 3 of 4</Text>
          <Text style={styles.title}>Your Goals</Text>
          <Text style={styles.subtitle}>What do you want to achieve?</Text>

          {/* Show purpose summary for context */}
          {user?.purposeSummary && (
            <View style={styles.contextCard}>
              <Text style={styles.contextLabel}>Your Purpose:</Text>
              <Text style={styles.contextText}>{user.purposeSummary}</Text>
            </View>
          )}

          {goals.length === 0 ? (
            <>
              <Text style={styles.helperText}>
                Let AI generate 2-3 goals aligned with your purpose, or create your own goals manually.
              </Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  generateMutation.isPending && styles.buttonDisabled,
                ]}
                onPress={handleGenerate}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                      Generating goals...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>✨ Generate Goals with AI</Text>
                )}
              </TouchableOpacity>

              {generateMutation.isError && (
                <Text style={styles.errorText}>
                  {generateMutation.error?.message || 'Failed to generate goals'}
                </Text>
              )}
            </>
          ) : (
            <>
              <View style={styles.goalsContainer}>
                {goals.map((goal: any, index: number) => (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalNumber}>Goal {index + 1}</Text>
                      {goal.aiGenerated === 1 && (
                        <Text style={styles.aiBadge}>AI Generated</Text>
                      )}
                    </View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    {goal.description && (
                      <Text style={styles.goalDescription}>{goal.description}</Text>
                    )}
                  </View>
                ))}
              </View>

              {hasGenerated && (
                <Text style={styles.successText}>
                  ✓ Goals generated! You can edit or add more goals later from the dashboard.
                </Text>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.progressDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
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
    marginBottom: 24,
    lineHeight: 24,
  },
  contextCard: {
    backgroundColor: '#F5F9F7',
    borderLeftWidth: 4,
    borderLeftColor: '#5A7F6A',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  contextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A7F6A',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextText: {
    fontSize: 14,
    color: '#2C2C2C',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  helperText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  goalsContainer: {
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A7F6A',
    backgroundColor: '#F5F9F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#5A7F6A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#5A7F6A',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
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
