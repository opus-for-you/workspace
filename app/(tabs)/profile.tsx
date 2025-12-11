import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';

const WEEK_THEMES = [
  { week: 1, title: 'Purpose', emoji: '🎯' },
  { week: 2, title: 'Rhythm', emoji: '⚡' },
  { week: 3, title: 'Network', emoji: '🤝' },
  { week: 4, title: 'Structure', emoji: '🏗️' },
  { week: 5, title: 'Methods', emoji: '🔧' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const currentWeek = user?.programWeek || 0;
  const progress = (currentWeek / 5) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>Opus Member</Text>
      </View>

      {/* Program Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5-Week Program Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Week {currentWeek} of 5</Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          {user?.programStartDate && (
            <Text style={styles.startDate}>
              Started {new Date(user.programStartDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          )}
        </View>

        <View style={styles.weeksGrid}>
          {WEEK_THEMES.map((week) => (
            <View
              key={week.week}
              style={[
                styles.weekBadge,
                currentWeek >= week.week && styles.weekBadgeComplete,
                currentWeek === week.week && styles.weekBadgeCurrent,
              ]}
            >
              <Text style={styles.weekEmoji}>{week.emoji}</Text>
              <Text
                style={[
                  styles.weekTitle,
                  currentWeek >= week.week && styles.weekTitleComplete,
                ]}
              >
                {week.title}
              </Text>
              <Text
                style={[
                  styles.weekNumber,
                  currentWeek >= week.week && styles.weekNumberComplete,
                ]}
              >
                Week {week.week}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* North Star */}
      {user?.northStar && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your North Star</Text>
          <View style={styles.northStarCard}>
            <Text style={styles.northStarEmoji}>⭐</Text>
            <Text style={styles.northStarText}>{user.northStar}</Text>
          </View>
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Account</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Terms of Service</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5A7F6A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A7F6A',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5A7F6A',
  },
  startDate: {
    fontSize: 12,
    color: '#999',
  },
  weeksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekBadge: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  weekBadgeComplete: {
    backgroundColor: '#F0F4F1',
    borderColor: '#5A7F6A',
  },
  weekBadgeCurrent: {
    backgroundColor: '#5A7F6A',
  },
  weekEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  weekTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  weekTitleComplete: {
    color: '#2C2C2C',
  },
  weekNumber: {
    fontSize: 11,
    color: '#999',
  },
  weekNumberComplete: {
    color: '#5A7F6A',
  },
  northStarCard: {
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4E5DA',
    alignItems: 'center',
  },
  northStarEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  northStarText: {
    fontSize: 16,
    color: '#2C2C2C',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
});
