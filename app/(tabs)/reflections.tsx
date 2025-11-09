import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reflectionsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function ReflectionsScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [wins, setWins] = useState('');
  const [lessons, setLessons] = useState('');
  const [nextFocus, setNextFocus] = useState('');

  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ['reflections'],
    queryFn: reflectionsAPI.getReflections,
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => reflectionsAPI.submitReflection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      setShowModal(false);
      setWins('');
      setLessons('');
      setNextFocus('');
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate({
      weekStart: new Date().toISOString().split('T')[0],
      wins,
      lessons,
      nextSteps: nextFocus,
      summary: `Week ${user?.programWeek || 1} reflection`,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reflections</Text>
          <Text style={styles.subtitle}>Weekly check-ins and growth</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* End of Week Prompt */}
          <TouchableOpacity
            style={styles.promptCard}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.promptEmoji}>✨</Text>
            <View style={styles.promptContent}>
              <Text style={styles.promptTitle}>Week {user?.programWeek || 1} Reflection</Text>
              <Text style={styles.promptText}>
                Take a moment to reflect on your progress this week
              </Text>
            </View>
          </TouchableOpacity>

          {/* Past Reflections */}
          {reflections.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Past Reflections</Text>
              <View style={styles.reflectionsList}>
                {reflections.map((reflection: any) => (
                  <ReflectionCard key={reflection.id} reflection={reflection} />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>No reflections yet</Text>
              <Text style={styles.emptyText}>
                Complete your first weekly reflection to track your growth
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Reflection Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Week {user?.programWeek} Reflection</Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitMutation.isPending}
            >
              <Text
                style={[
                  styles.modalSave,
                  submitMutation.isPending && styles.modalSaveDisabled,
                ]}
              >
                {submitMutation.isPending ? 'Saving...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>🎉 What were your wins?</Text>
              <Text style={styles.questionHint}>
                What went well this week? What are you proud of?
              </Text>
              <TextInput
                style={styles.textArea}
                value={wins}
                onChangeText={setWins}
                placeholder="Write about your wins..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>💡 What did you learn?</Text>
              <Text style={styles.questionHint}>
                What insights or lessons emerged?
              </Text>
              <TextInput
                style={styles.textArea}
                value={lessons}
                onChangeText={setLessons}
                placeholder="Write about your learnings..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>🎯 What's next?</Text>
              <Text style={styles.questionHint}>
                What will you focus on next week?
              </Text>
              <TextInput
                style={styles.textArea}
                value={nextFocus}
                onChangeText={setNextFocus}
                placeholder="Write about your next steps..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.aiNotice}>
              <Text style={styles.aiNoticeText}>
                ✨ AI will analyze your reflection to refine your goals and tasks
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function ReflectionCard({ reflection }: { reflection: any }) {
  const date = new Date(reflection.weekStart);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.reflectionCard}>
      <View style={styles.reflectionHeader}>
        <Text style={styles.reflectionDate}>{formattedDate}</Text>
      </View>

      {reflection.wins && (
        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionLabel}>Wins</Text>
          <Text style={styles.reflectionText}>{reflection.wins}</Text>
        </View>
      )}

      {reflection.lessons && (
        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionLabel}>Lessons</Text>
          <Text style={styles.reflectionText}>{reflection.lessons}</Text>
        </View>
      )}

      {reflection.nextSteps && (
        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionLabel}>Next Steps</Text>
          <Text style={styles.reflectionText}>{reflection.nextSteps}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  promptCard: {
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4E5DA',
  },
  promptEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  promptContent: {
    flex: 1,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 14,
    color: '#5A7F6A',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  reflectionsList: {
    gap: 12,
  },
  reflectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reflectionHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reflectionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A7F6A',
  },
  reflectionSection: {
    marginBottom: 12,
  },
  reflectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  reflectionText: {
    fontSize: 14,
    color: '#2C2C2C',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  modalSave: {
    fontSize: 16,
    color: '#5A7F6A',
    fontWeight: '600',
  },
  modalSaveDisabled: {
    opacity: 0.4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  questionGroup: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 6,
  },
  questionHint: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  aiNotice: {
    backgroundColor: '#F0F4F1',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  aiNoticeText: {
    fontSize: 14,
    color: '#5A7F6A',
    textAlign: 'center',
    lineHeight: 20,
  },
});
