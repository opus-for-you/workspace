import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

export default function GoalsScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: goalsAPI.getGoals,
  });

  const generateGoalsMutation = useMutation({
    mutationFn: () => goalsAPI.generateGoals(user?.northStar || '', user?.programWeek || 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowAISuggestions(false);
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (goal: any) => goalsAPI.createGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowAddModal(false);
      setNewGoalTitle('');
      setNewGoalDescription('');
    },
  });

  const handleCreateGoal = () => {
    if (newGoalTitle.trim()) {
      createGoalMutation.mutate({
        title: newGoalTitle,
        description: newGoalDescription,
        category: 'professional',
        progress: 0,
        weekNumber: user?.programWeek || 1,
      });
    }
  };

  const weekGoals = goals.filter((g: any) => g.weekNumber === user?.programWeek);
  const otherGoals = goals.filter((g: any) => g.weekNumber !== user?.programWeek);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A7F6A" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Goals</Text>
          <Text style={styles.subtitle}>Your transformation roadmap</Text>
        </View>

        {/* AI Suggestions Banner */}
        <TouchableOpacity
          style={styles.aiPrompt}
          onPress={() => generateGoalsMutation.mutate()}
          disabled={generateGoalsMutation.isPending}
        >
          <Text style={styles.aiPromptEmoji}>✨</Text>
          <View style={styles.aiPromptContent}>
            <Text style={styles.aiPromptTitle}>Get AI Suggestions</Text>
            <Text style={styles.aiPromptText}>
              Based on your north star and Week {user?.programWeek || 1}
            </Text>
          </View>
          {generateGoalsMutation.isPending && (
            <ActivityIndicator color="#5A7F6A" />
          )}
        </TouchableOpacity>

        {/* This Week's Goals */}
        {weekGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week (Week {user?.programWeek})</Text>
            <View style={styles.goalsList}>
              {weekGoals.map((goal: any) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </View>
          </View>
        )}

        {/* Other Goals */}
        {otherGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Goals</Text>
            <View style={styles.goalsList}>
              {otherGoals.map((goal: any) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals yet</Text>
            <Text style={styles.emptyText}>
              Start by getting AI suggestions or create your own
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Goal</Text>
            <TouchableOpacity
              onPress={handleCreateGoal}
              disabled={!newGoalTitle.trim() || createGoalMutation.isPending}
            >
              <Text
                style={[
                  styles.modalSave,
                  (!newGoalTitle.trim() || createGoalMutation.isPending) && styles.modalSaveDisabled,
                ]}
              >
                {createGoalMutation.isPending ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
                placeholder="What do you want to achieve?"
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGoalDescription}
                onChangeText={setNewGoalDescription}
                placeholder="Add more details..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function GoalCard({ goal }: { goal: any }) {
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          {goal.aiGenerated === 1 && (
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI</Text>
            </View>
          )}
        </View>
        <Text style={styles.goalProgress}>{goal.progress}%</Text>
      </View>

      {goal.description && (
        <Text style={styles.goalDescription}>{goal.description}</Text>
      )}

      <View style={styles.goalFooter}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${goal.progress}%` }]}
          />
        </View>
        {goal.weekNumber && (
          <Text style={styles.weekBadge}>Week {goal.weekNumber}</Text>
        )}
      </View>
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
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
  aiPrompt: {
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4E5DA',
  },
  aiPromptEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  aiPromptContent: {
    flex: 1,
  },
  aiPromptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  aiPromptText: {
    fontSize: 14,
    color: '#5A7F6A',
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
  goalsList: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  goalHeader: {
    marginBottom: 8,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A7F6A',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5A7F6A',
  },
  weekBadge: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  aiTag: {
    backgroundColor: '#F0F4F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiTagText: {
    fontSize: 10,
    color: '#5A7F6A',
    fontWeight: '600',
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
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5A7F6A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
