import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reflectionsAPI, aiAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface CheckInAnalysis {
  insights: string[];
  patterns: string[];
  recommendations: string[];
  networkNudges: string[];
}

export default function CheckInScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [wins, setWins] = useState('');
  const [lessons, setLessons] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [analysis, setAnalysis] = useState<CheckInAnalysis | null>(null);

  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ['reflections'],
    queryFn: reflectionsAPI.getReflections,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      // Submit reflection first
      await reflectionsAPI.submitReflection(data);
      // Then get AI analysis
      const analysisResult = await aiAPI.analyzeCheckIn({
        wins: data.wins,
        lessons: data.lessons,
        nextSteps: data.nextSteps,
      });
      return analysisResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      if (data?.analysis) {
        setAnalysis(data.analysis);
      }
      setShowModal(false);
      setWins('');
      setLessons('');
      setNextSteps('');
      Alert.alert('Success', 'Check-in submitted and analyzed!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to submit check-in');
    },
  });

  const handleSubmit = () => {
    if (!wins.trim() && !lessons.trim() && !nextSteps.trim()) {
      Alert.alert('Required', 'Please fill in at least one field');
      return;
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    submitMutation.mutate({
      weekStart: weekStart.toISOString().split('T')[0],
      wins,
      lessons,
      nextSteps,
      summary: 'Weekly check-in',
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
          <Text style={styles.title}>Check-In</Text>
          <Text style={styles.subtitle}>Reflect on your growth</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Purpose Reminder */}
          <View style={styles.purposeCard}>
            <Text style={styles.purposeLabel}>Remember Why You're Here</Text>
            <Text style={styles.purposeText}>
              {user?.purposeSummary || 'Your purpose will appear here'}
            </Text>
          </View>

          {/* Check-In Prompt */}
          <TouchableOpacity
            style={styles.promptCard}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.promptEmoji}>✨</Text>
            <View style={styles.promptContent}>
              <Text style={styles.promptTitle}>Weekly Check-In</Text>
              <Text style={styles.promptText}>
                Take a moment to reflect on your progress
              </Text>
            </View>
          </TouchableOpacity>

          {/* AI Insights (if available) */}
          {analysis && (
            <View style={styles.insightsCard}>
              <Text style={styles.insightsTitle}>AI Insights</Text>

              {/* Patterns */}
              {analysis.patterns && analysis.patterns.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={styles.insightLabel}>Patterns</Text>
                  {analysis.patterns.map((pattern, i) => (
                    <Text key={i} style={styles.insightText}>
                      • {pattern}
                    </Text>
                  ))}
                </View>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={styles.insightLabel}>Recommendations</Text>
                  {analysis.recommendations.map((rec, i) => (
                    <Text key={i} style={styles.insightText}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}

              {/* Network Nudges */}
              {analysis.networkNudges && analysis.networkNudges.length > 0 && (
                <View style={styles.insightSection}>
                  <Text style={styles.insightLabel}>🤝 Network Nudges</Text>
                  {analysis.networkNudges.map((nudge, i) => (
                    <Text key={i} style={styles.insightText}>
                      • {nudge}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Past Check-Ins */}
          {reflections.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Past Check-Ins</Text>
              <View style={styles.reflectionsList}>
                {reflections.map((reflection: any) => (
                  <CheckInCard key={reflection.id} reflection={reflection} />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💭</Text>
              <Text style={styles.emptyTitle}>No check-ins yet</Text>
              <Text style={styles.emptyText}>
                Complete your first weekly check-in to track your growth
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Check-In Modal */}
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
            <Text style={styles.modalTitle}>Weekly Check-In</Text>
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
                {submitMutation.isPending ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.aiNotice}>
              <Text style={styles.aiNoticeText}>
                ✨ AI will analyze your reflection to provide insights and network nudges
              </Text>
            </View>

            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>🎉 What went well this week?</Text>
              <Text style={styles.questionHint}>
                Your wins and accomplishments
              </Text>
              <TextInput
                style={styles.textArea}
                value={wins}
                onChangeText={setWins}
                placeholder="Write about your wins..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>💡 What insights emerged?</Text>
              <Text style={styles.questionHint}>
                Lessons learned, patterns noticed
              </Text>
              <TextInput
                style={styles.textArea}
                value={lessons}
                onChangeText={setLessons}
                placeholder="Write about your learnings..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionGroup}>
              <Text style={styles.questionTitle}>🎯 What will you focus on next week?</Text>
              <Text style={styles.questionHint}>
                Your intentions and next steps
              </Text>
              <TextInput
                style={styles.textArea}
                value={nextSteps}
                onChangeText={setNextSteps}
                placeholder="Write about your next steps..."
                placeholderTextColor="#999"
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

function CheckInCard({ reflection }: { reflection: any }) {
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
  purposeCard: {
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D4E5DA',
  },
  purposeLabel: {
    fontSize: 11,
    color: '#5A7F6A',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  purposeText: {
    fontSize: 15,
    color: '#2C2C2C',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    color: '#666',
    lineHeight: 20,
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  insightSection: {
    marginBottom: 16,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#2C2C2C',
    lineHeight: 20,
    marginBottom: 4,
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
  aiNotice: {
    backgroundColor: '#F0F4F1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  aiNoticeText: {
    fontSize: 14,
    color: '#5A7F6A',
    textAlign: 'center',
    lineHeight: 20,
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
});
