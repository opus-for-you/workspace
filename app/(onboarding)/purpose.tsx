import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { onboardingAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function PurposeScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [prompt1, setPrompt1] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [prompt3, setPrompt3] = useState('');
  const [purposeSummary, setPurposeSummary] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: (data: { prompt1: string; prompt2: string; prompt3: string }) =>
      onboardingAPI.savePurpose(data),
    onSuccess: (data) => {
      setPurposeSummary(data.purposeSummary);
      if (data.user) {
        setUser(data.user);
      }
    },
    onError: () => {
      Alert.alert('Error', 'Failed to generate purpose summary');
    },
  });

  const handleGenerate = () => {
    if (!prompt1.trim() || !prompt2.trim() || !prompt3.trim()) {
      Alert.alert('Incomplete', 'Please answer all 3 prompts');
      return;
    }

    if (prompt1.trim().length < 10 || prompt2.trim().length < 10 || prompt3.trim().length < 10) {
      Alert.alert('Too Short', 'Each response should be at least 10 characters');
      return;
    }

    generateMutation.mutate({
      prompt1: prompt1.trim(),
      prompt2: prompt2.trim(),
      prompt3: prompt3.trim(),
    });
  };

  const handleContinue = () => {
    router.push('/(onboarding)/method');
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
          <Text style={styles.progress}>Step 1 of 4</Text>
          <Text style={styles.title}>Your Purpose</Text>
          <Text style={styles.subtitle}>Let's explore what drives your professional journey</Text>

          {!purposeSummary ? (
            <>
              <View style={styles.promptSection}>
                <Text style={styles.promptLabel}>
                  Describe a moment when work felt perfectly aligned with who you are.
                </Text>
                <TextInput
                  style={styles.input}
                  value={prompt1}
                  onChangeText={setPrompt1}
                  placeholder="When I'm..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.promptSection}>
                <Text style={styles.promptLabel}>
                  Imagine your career 10 years from now. What does success look like?
                </Text>
                <TextInput
                  style={styles.input}
                  value={prompt2}
                  onChangeText={setPrompt2}
                  placeholder="In ten years, I..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.promptSection}>
                <Text style={styles.promptLabel}>
                  What's a version of your career you haven't imagined yet but might excite you?
                </Text>
                <TextInput
                  style={styles.input}
                  value={prompt3}
                  onChangeText={setPrompt3}
                  placeholder="I've never fully explored..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {generateMutation.isError && (
                <Text style={styles.errorText}>
                  {generateMutation.error?.message || 'Something went wrong. Please try again.'}
                </Text>
              )}

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
                      AI is synthesizing your purpose...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Generate Purpose Summary</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Your Purpose</Text>
                <Text style={styles.summaryText}>{purposeSummary}</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
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
  promptSection: {
    marginBottom: 24,
  },
  promptLabel: {
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 100,
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
  summaryCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#5A7F6A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A7F6A',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 24,
    fontStyle: 'italic',
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
