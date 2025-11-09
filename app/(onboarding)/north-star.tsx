import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { onboardingAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function NorthStarScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [northStar, setNorthStar] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data: string) => onboardingAPI.saveNorthStar(data),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
      router.push('/(onboarding)/program-intro');
    },
  });

  const handleContinue = () => {
    if (northStar.trim()) {
      saveMutation.mutate(northStar.trim());
    }
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
          <View style={[styles.header, isFocused && styles.headerFocused]}>
            <Text style={[styles.question, isFocused && styles.questionFocused]}>
              What's your North Star?
            </Text>
            <Text style={[styles.hint, isFocused && styles.hintFocused]}>
              Your ultimate professional vision. Where do you want to be in 5 years?
            </Text>
          </View>

          <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
            <TextInput
              style={styles.input}
              value={northStar}
              onChangeText={setNorthStar}
              placeholder="I want to..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
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
              (!northStar.trim() || saveMutation.isPending) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!northStar.trim() || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.progressDots}>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
    transition: 'all 0.3s',
  },
  headerFocused: {
    marginBottom: 24,
    transform: [{ translateY: -20 }],
  },
  question: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2C2C2C',
    marginBottom: 16,
    textAlign: 'center',
    transition: 'all 0.3s',
  },
  questionFocused: {
    fontSize: 24,
    opacity: 0.5,
  },
  hint: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    transition: 'all 0.3s',
  },
  hintFocused: {
    fontSize: 14,
    opacity: 0.3,
  },
  inputWrapper: {
    transition: 'all 0.3s',
  },
  inputWrapperFocused: {
    transform: [{ scale: 1.02 }],
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: '#2C2C2C',
    minHeight: 150,
    fontWeight: '300',
  },
  button: {
    backgroundColor: '#5A7F6A',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonDisabled: {
    opacity: 0.4,
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
