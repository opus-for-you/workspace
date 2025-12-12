import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { onboardingAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

const WORKSTYLE_OPTIONS = [
  { value: 'deep-focus', label: 'Deep focus blocks (2-4 hours)' },
  { value: 'collaborative', label: 'Collaborative sessions' },
  { value: 'mix', label: 'Mix of both' },
  { value: 'depends', label: 'Depends on the task' },
];

export default function MethodScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [workstyleBest, setWorkstyleBest] = useState<string>('');
  const [workstyleStuck, setWorkstyleStuck] = useState('');

  const saveMutation = useMutation({
    mutationFn: (data: { workstyleBest: string; workstyleStuck?: string }) =>
      onboardingAPI.saveMethod(data),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
      router.push('/(onboarding)/goals');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to save workstyle');
    },
  });

  const handleContinue = () => {
    if (!workstyleBest) {
      Alert.alert('Required', 'Please select how you work best');
      return;
    }

    saveMutation.mutate({
      workstyleBest,
      workstyleStuck: workstyleStuck.trim() || undefined,
    });
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
          <Text style={styles.progress}>Step 2 of 4</Text>
          <Text style={styles.title}>Your Work Style</Text>
          <Text style={styles.subtitle}>Help us personalize your coaching</Text>

          <View style={styles.section}>
            <Text style={styles.questionLabel}>How do you work best?</Text>
            {WORKSTYLE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radioOption,
                  workstyleBest === option.value && styles.radioOptionSelected,
                ]}
                onPress={() => setWorkstyleBest(option.value)}
              >
                <View style={styles.radio}>
                  {workstyleBest === option.value && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    workstyleBest === option.value && styles.radioLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.questionLabel}>
              What usually gets you stuck? <Text style={styles.optional}>(Optional)</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={workstyleStuck}
              onChangeText={setWorkstyleStuck}
              placeholder="I get stuck when..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {saveMutation.isError && (
            <Text style={styles.errorText}>
              {saveMutation.error?.message || 'Something went wrong. Please try again.'}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!workstyleBest || saveMutation.isPending) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!workstyleBest || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Saving...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.progressDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
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
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  questionLabel: {
    fontSize: 18,
    color: '#2C2C2C',
    marginBottom: 16,
    fontWeight: '500',
  },
  optional: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
  },
  radioOptionSelected: {
    borderColor: '#5A7F6A',
    backgroundColor: '#F5F9F7',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5A7F6A',
  },
  radioLabel: {
    fontSize: 16,
    color: '#2C2C2C',
    flex: 1,
  },
  radioLabelSelected: {
    fontWeight: '500',
    color: '#5A7F6A',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 120,
    fontWeight: '300',
  },
  button: {
    backgroundColor: '#5A7F6A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
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
