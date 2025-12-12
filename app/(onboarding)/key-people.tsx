import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { keyPeopleAPI } from '@/lib/api';

type PersonInput = {
  name: string;
  why: string;
};

export default function KeyPeopleScreen() {
  const router = useRouter();
  const [mentor, setMentor] = useState<PersonInput>({ name: '', why: '' });
  const [peer, setPeer] = useState<PersonInput>({ name: '', why: '' });
  const [collaborator, setCollaborator] = useState<PersonInput>({ name: '', why: '' });

  const saveMutation = useMutation({
    mutationFn: (people: any[]) => keyPeopleAPI.createBulk(people),
    onSuccess: () => {
      router.replace('/(tabs)');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to save key people');
    },
  });

  const handleComplete = () => {
    if (!mentor.name.trim() || !peer.name.trim() || !collaborator.name.trim()) {
      Alert.alert('Required', 'Please add all 3 key people (names are required)');
      return;
    }

    const people = [
      { name: mentor.name.trim(), type: 'mentor', why: mentor.why.trim() || null },
      { name: peer.name.trim(), type: 'peer', why: peer.why.trim() || null },
      { name: collaborator.name.trim(), type: 'collaborator', why: collaborator.why.trim() || null },
    ];

    saveMutation.mutate(people);
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
          <Text style={styles.progress}>Step 4 of 4</Text>
          <Text style={styles.title}>Your Network</Text>
          <Text style={styles.subtitle}>Who supports your growth?</Text>

          {/* Mentor */}
          <View style={styles.personSection}>
            <View style={styles.personHeader}>
              <Text style={styles.personIcon}>🧭</Text>
              <View style={styles.personHeaderText}>
                <Text style={styles.personType}>Mentor / Guide</Text>
                <Text style={styles.personHint}>Someone who provides wisdom and direction</Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              value={mentor.name}
              onChangeText={(name) => setMentor({ ...mentor, name })}
              placeholder="Name *"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={mentor.why}
              onChangeText={(why) => setMentor({ ...mentor, why })}
              placeholder="Why they matter (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Peer */}
          <View style={styles.personSection}>
            <View style={styles.personHeader}>
              <Text style={styles.personIcon}>🤝</Text>
              <View style={styles.personHeaderText}>
                <Text style={styles.personType}>Peer / Fellow Traveler</Text>
                <Text style={styles.personHint}>Someone on a similar journey</Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              value={peer.name}
              onChangeText={(name) => setPeer({ ...peer, name })}
              placeholder="Name *"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={peer.why}
              onChangeText={(why) => setPeer({ ...peer, why })}
              placeholder="Why they matter (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Collaborator */}
          <View style={styles.personSection}>
            <View style={styles.personHeader}>
              <Text style={styles.personIcon}>⚡</Text>
              <View style={styles.personHeaderText}>
                <Text style={styles.personType}>Collaborator / Supporter</Text>
                <Text style={styles.personHint}>Someone you work with or who helps</Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              value={collaborator.name}
              onChangeText={(name) => setCollaborator({ ...collaborator, name })}
              placeholder="Name *"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={collaborator.why}
              onChangeText={(why) => setCollaborator({ ...collaborator, why })}
              placeholder="Why they matter (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
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
              saveMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleComplete}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Completing...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Complete Onboarding</Text>
            )}
          </TouchableOpacity>

          <View style={styles.progressDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
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
  personSection: {
    marginBottom: 32,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  personIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  personHeaderText: {
    flex: 1,
  },
  personType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  personHint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
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
    marginBottom: 8,
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
