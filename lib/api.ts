import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Mock mode for testing without backend
const MOCK_MODE = true; // Set to false when backend is ready

// TODO: Update this to your backend URL
// For development, use your local IP or ngrok URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:5000' // Change to your computer's IP for physical devices
  : 'https://your-production-api.com';

// Helper for delays in mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Type Definitions
export interface KeyPerson {
  id: string;
  userId: string;
  name: string;
  type: 'mentor' | 'peer' | 'collaborator';
  why?: string | null;
  lastInteraction?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CheckInAnalysis {
  insights: string[];
  patterns: string[];
  recommendations: string[];
  networkNudges: string[];
}

// Updated Mock Data (MVP)
const MOCK_USER = {
  id: 'user-1',
  username: 'demo',
  purposePrompt1: 'When I\'m solving complex problems collaboratively',
  purposePrompt2: 'Leading a product team at a mission-driven company',
  purposePrompt3: 'Building my own consulting practice helping teams transform',
  purposeSummary: 'I thrive when solving complex problems collaboratively. In ten years, I see myself leading a product team at a mission-driven company, helping others grow while building meaningful solutions. I\'m curious about building my own consulting practice, helping teams transform their ways of working.',
  workstyleBest: 'deep-focus',
  workstyleStuck: 'When there are too many meetings and context switches',
};

const MOCK_GOALS = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Build thought leadership through writing',
    description: 'Establish expertise by sharing insights regularly',
    category: 'professional',
    progress: 35,
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Develop deep expertise in product strategy',
    description: 'Master frameworks and techniques used by top product strategists',
    category: 'learning',
    progress: 60,
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: 'Build strategic network in product community',
    description: 'Connect with people who inspire professional growth',
    category: 'professional',
    progress: 15,
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_TASKS = [
  {
    id: 'task-1',
    userId: 'user-1',
    goalId: 'goal-1',
    title: 'Write outline for first article',
    description: 'Draft structure for article on product strategy',
    status: 'todo',
    recommendedSchedule: 'Morning (Tuesday or Thursday)',
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    userId: 'user-1',
    goalId: 'goal-1',
    title: 'Draft 500 words',
    description: 'Get thoughts on paper. Don\'t worry about perfection yet.',
    status: 'todo',
    recommendedSchedule: 'Tuesday morning',
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    userId: 'user-1',
    goalId: 'goal-2',
    title: 'Research product strategy frameworks',
    description: 'Study Jobs-to-be-Done, North Star Metric, and OKRs',
    status: 'in-progress',
    recommendedSchedule: 'Afternoon',
    aiGenerated: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    userId: 'user-1',
    goalId: 'goal-3',
    title: 'Reach out to Sarah for coffee',
    description: 'Send a thoughtful message about her recent article',
    status: 'done',
    recommendedSchedule: 'Evening',
    aiGenerated: 0,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_KEY_PEOPLE: KeyPerson[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Sarah Johnson',
    type: 'mentor',
    why: 'She helped me transition into product management and continues to provide guidance',
    lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user-1',
    name: 'Mike Chen',
    type: 'peer',
    why: 'We support each other through career challenges',
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user-1',
    name: 'Emma Rodriguez',
    type: 'collaborator',
    why: 'We\'re building a side project together',
    lastInteraction: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

const MOCK_REFLECTIONS = [
  {
    id: '1',
    weekStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    summary: 'Weekly reflection',
    wins: 'Completed purpose exercise and generated goals. Had a great conversation with a mentor.',
    lessons: 'Realized I need to be more specific with my milestones. Break down into smaller steps.',
    nextSteps: 'Focus on building a daily writing habit. Start with just 15 minutes each morning.',
  },
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  // NEW: Purpose submission
  savePurpose: async (data: { prompt1: string; prompt2: string; prompt3: string }) => {
    if (MOCK_MODE) {
      await delay(1500); // Simulate AI processing
      return {
        success: true,
        purposeSummary: MOCK_USER.purposeSummary,
        user: MOCK_USER,
        message: 'Purpose saved and summary generated',
      };
    }

    const response = await api.post('/api/onboarding/purpose', data);
    return response.data;
  },

  // NEW: Method/workstyle submission
  saveMethod: async (data: { workstyleBest: string; workstyleStuck?: string }) => {
    if (MOCK_MODE) {
      await delay(500);
      return {
        success: true,
        user: { ...MOCK_USER, workstyleBest: data.workstyleBest, workstyleStuck: data.workstyleStuck },
        message: 'Workstyle profile saved',
      };
    }

    const response = await api.post('/api/onboarding/method', data);
    return response.data;
  },
};

export const keyPeopleAPI = {
  getKeyPeople: async (): Promise<KeyPerson[]> => {
    if (MOCK_MODE) {
      await delay(300);
      return MOCK_KEY_PEOPLE;
    }

    const response = await api.get('/api/key-people');
    return response.data.keyPeople;
  },

  createKeyPerson: async (person: {
    name: string;
    type: string;
    why?: string;
    lastInteraction?: string;
  }): Promise<KeyPerson> => {
    if (MOCK_MODE) {
      await delay(300);
      return {
        id: Date.now().toString(),
        userId: 'user-1',
        ...person,
        createdAt: new Date().toISOString(),
      } as KeyPerson;
    }

    const response = await api.post('/api/key-people', person);
    return response.data.keyPerson;
  },

  createBulk: async (
    people: Array<{ name: string; type: string; why?: string | null; lastInteraction?: string }>
  ): Promise<KeyPerson[]> => {
    if (MOCK_MODE) {
      await delay(500);
      return people.map((person, index) => ({
        id: `key-person-${index}`,
        userId: 'user-1',
        ...person,
        createdAt: new Date().toISOString(),
      } as KeyPerson));
    }

    const response = await api.post('/api/key-people/bulk', { people });
    return response.data.keyPeople;
  },

  updateKeyPerson: async (
    id: string,
    updates: Partial<{ name: string; type: string; why: string; lastInteraction: string; notes: string }>
  ): Promise<KeyPerson> => {
    if (MOCK_MODE) {
      await delay(300);
      return {
        id,
        userId: 'user-1',
        name: 'Updated',
        type: 'mentor',
        createdAt: new Date().toISOString(),
        ...updates,
      } as KeyPerson;
    }

    const response = await api.put(`/api/key-people/${id}`, updates);
    return response.data.keyPerson;
  },

  deleteKeyPerson: async (id: string): Promise<void> => {
    if (MOCK_MODE) {
      await delay(300);
      return;
    }

    await api.delete(`/api/key-people/${id}`);
  },
};

export const goalsAPI = {
  getGoals: async () => {
    if (MOCK_MODE) {
      await delay(300);
      return MOCK_GOALS;
    }
    const response = await api.get('/api/goals');
    return response.data;
  },

  // UPDATED: Remove programWeek parameter
  generateGoals: async (purposeSummary?: string) => {
    if (MOCK_MODE) {
      await delay(1500);
      return {
        success: true,
        goals: MOCK_GOALS.slice(0, 3),
        count: 3,
        message: 'Generated 3 goals aligned with your purpose',
      };
    }
    const response = await api.post('/api/ai/generate-goals', { purposeSummary });
    return response.data;
  },

  createGoal: async (goal: any) => {
    if (MOCK_MODE) {
      await delay(300);
      return { ...goal, id: Math.random().toString() };
    }
    const response = await api.post('/api/goals', goal);
    return response.data;
  },

  updateGoal: async (id: string, updates: any) => {
    if (MOCK_MODE) {
      await delay(300);
      return { id, ...updates };
    }
    const response = await api.put(`/api/goals/${id}`, updates);
    return response.data;
  },

  deleteGoal: async (id: string) => {
    if (MOCK_MODE) {
      await delay(300);
      return;
    }
    await api.delete(`/api/goals/${id}`);
  },
};

export const tasksAPI = {
  getTasks: async () => {
    if (MOCK_MODE) {
      await delay(300);
      return MOCK_TASKS;
    }
    const response = await api.get('/api/tasks');
    return response.data;
  },

  createTask: async (task: any) => {
    if (MOCK_MODE) {
      await delay(300);
      return { ...task, id: Math.random().toString() };
    }
    const response = await api.post('/api/tasks', task);
    return response.data;
  },

  updateTask: async (id: string, updates: any) => {
    if (MOCK_MODE) {
      await delay(300);
      return { id, ...updates };
    }
    const response = await api.put(`/api/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string) => {
    if (MOCK_MODE) {
      await delay(300);
      return;
    }
    await api.delete(`/api/tasks/${id}`);
  },
};

export const aiAPI = {
  // NEW: Generate milestones (renamed from generate-tasks)
  generateMilestones: async (goalId: string) => {
    if (MOCK_MODE) {
      await delay(1500);
      return {
        success: true,
        milestones: MOCK_TASKS.slice(0, 4),
        count: 4,
        message: 'Generated 4 milestones for your goal',
      };
    }
    const response = await api.post('/api/ai/generate-milestones', { goalId });
    return response.data;
  },

  // NEW: Analyze check-in with network nudges
  analyzeCheckIn: async (checkIn: { wins?: string; lessons?: string; nextSteps?: string }) => {
    if (MOCK_MODE) {
      await delay(1500);
      return {
        success: true,
        analysis: {
          insights: [
            'You\'re making strong progress on collaboration skills',
            'Your energy is highest when working on strategic problems',
          ],
          patterns: ['Consistent momentum on mornings', 'Blockers emerge in afternoon meetings'],
          recommendations: [
            'Schedule deep work in mornings',
            'Batch meetings in afternoons',
            'Consider delegating routine tasks',
          ],
          networkNudges: [
            'It\'s been 1 week since you connected with Sarah - consider scheduling a check-in',
            'Mike might have insights on the challenges you mentioned',
          ],
        },
        message: 'Check-in analyzed successfully',
      };
    }
    const response = await api.post('/api/ai/analyze-check-in', checkIn);
    return response.data;
  },
};

export const reflectionsAPI = {
  getReflections: async () => {
    if (MOCK_MODE) {
      await delay(300);
      return MOCK_REFLECTIONS;
    }
    const response = await api.get('/api/reviews');
    return response.data;
  },

  submitReflection: async (reflection: any) => {
    if (MOCK_MODE) {
      await delay(1000);
      return {
        review: { ...reflection, id: Math.random().toString() },
        message: 'Reflection submitted successfully. AI is analyzing your progress...',
      };
    }
    const response = await api.post('/api/reflections/submit', reflection);
    return response.data;
  },
};
