import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Mock mode for testing without backend
const MOCK_MODE = true; // Set to false when backend is ready

// TODO: Update this to your backend URL
// For development, use your local IP or ngrok URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:5000' // Change to your computer's IP for physical devices
  : 'https://your-production-api.com';

// Mock data for testing
const MOCK_GOALS = [
  {
    id: '1',
    title: 'Build thought leadership through writing',
    description: 'Establish yourself as an expert by consistently sharing valuable insights.',
    category: 'professional',
    progress: 35,
    aiGenerated: 1,
    weekNumber: 2,
  },
  {
    id: '2',
    title: 'Develop deep expertise in product strategy',
    description: 'Master the frameworks and techniques used by top product strategists.',
    category: 'learning',
    progress: 60,
    aiGenerated: 1,
    weekNumber: 2,
  },
  {
    id: '3',
    title: 'Connect with 3 industry leaders',
    description: 'Build meaningful relationships with people who inspire your professional growth.',
    category: 'professional',
    progress: 15,
    aiGenerated: 0,
    weekNumber: 1,
  },
];

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Write outline for first article',
    description: 'Choose a topic you\'re passionate about and create a detailed outline.',
    status: 'todo',
    recommendedSchedule: 'Morning',
    aiGenerated: 1,
    goalId: '1',
  },
  {
    id: '2',
    title: 'Draft 500 words',
    description: 'Get your thoughts on paper. Don\'t worry about perfection yet.',
    status: 'todo',
    recommendedSchedule: 'Tuesday morning',
    aiGenerated: 1,
    goalId: '1',
  },
  {
    id: '3',
    title: 'Research product strategy frameworks',
    description: 'Study Jobs-to-be-Done, North Star Metric, and OKRs.',
    status: 'in-progress',
    recommendedSchedule: 'Afternoon',
    aiGenerated: 1,
    goalId: '2',
  },
  {
    id: '4',
    title: 'Reach out to Sarah for coffee',
    description: 'Send a thoughtful message about her recent article.',
    status: 'done',
    recommendedSchedule: 'Evening',
    aiGenerated: 0,
    goalId: '3',
  },
];

const MOCK_REFLECTIONS = [
  {
    id: '1',
    weekStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    summary: 'Week 1: Getting started with the program',
    wins: 'Completed north star exercise and set up my first goals. Had a great conversation with a mentor.',
    lessons: 'Realized I need to be more specific with my goals. "Become better" is too vague.',
    nextSteps: 'Focus on building a daily writing habit. Start with just 15 minutes each morning.',
  },
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Add token to requests if available
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // Redirect to login handled by auth store
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  },

  register: async (username: string, password: string) => {
    const response = await api.post('/api/register', { username, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },

  logout: async () => {
    await api.post('/api/logout');
  },
};

export const onboardingAPI = {
  saveNorthStar: async (northStar: string) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        user: {
          id: 'mock-user-123',
          username: 'demo',
          northStar,
          programWeek: 0,
        },
      };
    }
    const response = await api.post('/api/onboarding/north-star', { northStar });
    return response.data;
  },

  startProgram: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        user: {
          id: 'mock-user-123',
          username: 'demo',
          programWeek: 1,
          programStartDate: new Date().toISOString(),
        },
        weekTheme: {
          week: 1,
          title: 'Purpose',
          emoji: '🎯',
          focus: 'Clarifying vision and identifying meaningful work',
        },
      };
    }
    const response = await api.post('/api/program/start');
    return response.data;
  },
};

export const programAPI = {
  getCurrentWeek: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        programWeek: 2,
        weekTheme: {
          week: 2,
          title: 'Rhythm',
          emoji: '⚡',
          focus: 'Building daily habits and consistent practices',
        },
        reflectionDue: false,
        programComplete: false,
        daysInProgram: 8,
      };
    }
    const response = await api.get('/api/program/current-week');
    return response.data;
  },
};

export const goalsAPI = {
  getGoals: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_GOALS;
    }
    const response = await api.get('/api/goals');
    return response.data;
  },

  generateGoals: async (northStar: string, programWeek: number) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { goals: MOCK_GOALS, count: MOCK_GOALS.length };
    }
    const response = await api.post('/api/ai/generate-goals', { northStar, programWeek });
    return response.data;
  },

  createGoal: async (goal: any) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...goal, id: Math.random().toString() };
    }
    const response = await api.post('/api/goals', goal);
    return response.data;
  },

  updateGoal: async (id: string, updates: any) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id, ...updates };
    }
    const response = await api.put(`/api/goals/${id}`, updates);
    return response.data;
  },

  deleteGoal: async (id: string) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    await api.delete(`/api/goals/${id}`);
  },
};

export const tasksAPI = {
  getTasks: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_TASKS;
    }
    const response = await api.get('/api/tasks');
    return response.data;
  },

  generateTasks: async (goalId: string, programWeek: number) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { tasks: MOCK_TASKS.slice(0, 3), count: 3 };
    }
    const response = await api.post('/api/ai/generate-tasks', { goalId, programWeek });
    return response.data;
  },

  createTask: async (task: any) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...task, id: Math.random().toString() };
    }
    const response = await api.post('/api/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, updates: any) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id, ...updates };
    }
    const response = await api.put(`/api/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    await api.delete(`/api/tasks/${id}`);
  },
};

export const reflectionsAPI = {
  getReflections: async () => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_REFLECTIONS;
    }
    const response = await api.get('/api/reviews');
    return response.data;
  },

  submitReflection: async (reflection: any) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        review: { ...reflection, id: Math.random().toString() },
        message: 'Reflection submitted successfully'
      };
    }
    const response = await api.post('/api/reflections/submit', reflection);
    return response.data;
  },
};
