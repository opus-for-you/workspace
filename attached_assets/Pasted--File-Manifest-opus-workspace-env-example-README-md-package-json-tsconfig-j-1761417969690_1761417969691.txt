## File Manifest

```
opus-workspace/
├── .env.example
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── dev_setup.sh
├── commit_plan.txt
│
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── push.ts
│   │   ├── pages/
│   │   │   ├── Splash.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── Connections.tsx
│   │   │   ├── WeeklyReview.tsx
│   │   │   └── Account.tsx
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── ProgressGate.tsx
│   │       └── GoalApproval.tsx
│
├── server/
│   ├── index.ts
│   ├── db.ts
│   ├── auth.ts
│   ├── push.ts
│   ├── scheduler.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── onboarding.ts
│   │   ├── goals.ts
│   │   ├── tasks.ts
│   │   ├── connections.ts
│   │   ├── reflections.ts
│   │   ├── notifications.ts
│   │   └── ai.ts
│   └── tests/
│       └── auth.test.ts
│
├── infra/
│   ├── 001_schema.sql
│   └── 002_pgvector.sql
│
├── ai_kernel/
│   ├── ingest_opus_doc.py
│   ├── sandbox_adapter.py
│   ├── prompts.json
│   └── embeddings.json
│
├── electron/
│   ├── main.js
│   ├── preload.js
│   ├── package.json
│   └── build.sh
│
├── assets/
│   ├── logo/
│   │   └── opus-logo.svg
│   ├── art/
│   └── Opus_Brand_Foundation_Document.pdf
│
├── docs/
│   ├── setup.md
│   ├── deployment.md
│   └── api.md
│
└── tests/
    ├── e2e/
    │   └── onboarding.spec.ts
    └── jest.config.js
```

## Implementation Files

### `.env.example`
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/opus_db
PGVECTOR_ENABLED=true

# Auth
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-here

# AI/LLM
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
LLM_PROVIDER=anthropic
LLM_MODEL=claude-3-sonnet-20240229
EMBEDDINGS_MODEL=text-embedding-3-small

# Push Notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=support@opus.app

# Server
PORT=3001
CLIENT_URL=http://localhost:5173

# Feature Flags
WEEK_GATE_ENABLED=true
AI_SUGGESTIONS_ENABLED=true
```

### `package.json`
```json
{
  "name": "opus-workspace",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "tsx watch server/index.ts",
    "dev:client": "vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsx server/index.ts",
    "test": "jest",
    "test:e2e": "playwright test",
    "db:migrate": "psql $DATABASE_URL -f infra/001_schema.sql",
    "db:seed": "tsx server/seed.ts",
    "electron": "cd electron && npm start",
    "electron:build": "cd electron && ./build.sh"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "framer-motion": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "express": "^4.21.0",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "web-push": "^3.6.6",
    "node-cron": "^3.0.3",
    "@anthropic-ai/sdk": "^0.24.0",
    "openai": "^4.20.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.9",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node-cron": "^3.0.11",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.6.0",
    "tsx": "^4.6.2",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "concurrently": "^8.2.2",
    "jest": "^29.7.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### `client/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Opus - Make Your Career Your Own</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### `client/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --sage-deep: 27 67 50;
    --sage: 82 121 111;
    --cream: 245 242 237;
    --gold: 212 165 116;
    --charcoal: 28 28 28;
    --stone: 138 138 138;
    --ivory: 250 250 250;
  }

  html {
    @apply antialiased bg-ivory text-charcoal;
  }

  body {
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3 {
    font-family: 'Fraunces', serif;
    @apply font-light tracking-tight;
  }
}

@layer utilities {
  .animate-rise {
    animation: rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

### `client/src/pages/Splash.tsx`
```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {stage >= 1 && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-5xl md:text-7xl text-sage-deep mb-4"
          >
            welcome
          </motion.h1>
        )}
        {stage >= 2 && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-6xl md:text-8xl text-sage-deep mb-8"
          >
            opus
          </motion.h1>
        )}
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-stone mb-8">
              make your career your own
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-sage-deep text-ivory rounded-md hover:bg-sage transition-colors"
            >
              Begin
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### `client/src/pages/Onboarding.tsx`
```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const questions = [
  {
    id: 'vision',
    text: 'What does meaningful work look like to you?',
    placeholder: 'Forget titles. Think impact.'
  },
  {
    id: 'energy',
    text: 'When do you lose track of time at work?',
    placeholder: 'These moments reveal your true strengths.'
  },
  {
    id: 'direction',
    text: 'Who do you want to become professionally?',
    placeholder: 'Not what. Who.'
  }
];

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (inputValue.trim()) {
      const updatedAnswers = { ...answers, [questions[currentQuestion].id]: inputValue };
      setAnswers(updatedAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setInputValue('');
        setIsTyping(false);
      } else {
        await api.post('/api/onboarding', { answers: updatedAnswers });
        navigate('/goals');
      }
    }
  };

  const handleInputFocus = () => {
    setIsTyping(true);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isTyping ? 0.3 : 1, y: isTyping ? -50 : 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl text-charcoal mb-12"
            >
              {questions[currentQuestion].text}
            </motion.h1>
            
            <motion.div
              animate={{ scale: isTyping ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleInputFocus}
                placeholder={questions[currentQuestion].placeholder}
                className="w-full p-4 bg-transparent border-b-2 border-stone focus:border-sage-deep 
                         outline-none resize-none text-lg transition-all duration-300"
                rows={3}
              />
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: inputValue.trim() ? 1 : 0.3 }}
              onClick={handleNext}
              disabled={!inputValue.trim()}
              className="mt-8 px-8 py-3 bg-sage-deep text-ivory rounded-md hover:bg-sage transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </motion.button>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center mt-12 gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentQuestion ? 'bg-sage-deep w-8' : 'bg-stone'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### `client/src/components/GoalApproval.tsx`
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: 'long' | 'medium' | 'short';
  aiGenerated: boolean;
}

interface GoalApprovalProps {
  goals: Goal[];
  onApprove: (goalId: string) => void;
  onEdit: (goalId: string, updatedGoal: Partial<Goal>) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalApproval({ goals, onApprove, onEdit, onDelete }: GoalApprovalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditValue(goal.title);
  };

  const saveEdit = (goalId: string) => {
    onEdit(goalId, { title: editValue });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-charcoal mb-6">Your Generated Goals</h2>
      
      {goals.map((goal) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white rounded-lg border border-pearl shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {editingId === goal.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveEdit(goal.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(goal.id)}
                  className="w-full p-2 border-b border-sage-deep focus:outline-none text-lg"
                  autoFocus
                />
              ) : (
                <h3 className="text-lg font-medium text-charcoal">{goal.title}</h3>
              )}
              <p className="text-stone mt-2">{goal.description}</p>
              <span className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
                goal.timeframe === 'long' ? 'bg-sage-deep text-ivory' :
                goal.timeframe === 'medium' ? 'bg-sage text-ivory' :
                'bg-gold text-charcoal'
              }`}>
                {goal.timeframe}-term
              </span>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onApprove(goal.id)}
                className="p-2 hover:bg-sage-deep hover:text-ivory rounded transition-colors"
                title="Approve"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => handleEdit(goal)}
                className="p-2 hover:bg-gold hover:text-charcoal rounded transition-colors"
                title="Edit"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="p-2 hover:bg-red-500 hover:text-white rounded transition-colors"
                title="Delete"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

### `client/src/components/ProgressGate.tsx`
```tsx
import { ReactNode, useEffect, useState } from 'react';
import { differenceInWeeks } from 'date-fns';

interface ProgressGateProps {
  children: ReactNode;
  requiredWeek: number;
  fallback?: ReactNode;
}

export default function ProgressGate({ children, requiredWeek, fallback }: ProgressGateProps) {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  useEffect(() => {
    const userStartDate = localStorage.getItem('opus_start_date');
    if (userStartDate) {
      const weeks = differenceInWeeks(new Date(), new Date(userStartDate));
      setCurrentWeek(weeks + 1);
    }
  }, []);
  
  if (currentWeek < requiredWeek) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl text-charcoal mb-4">Coming in Week {requiredWeek}</h2>
          <p className="text-stone">
            This feature unlocks after your Week {requiredWeek - 1} reflection.
          </p>
          {fallback}
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

### `server/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import authRoutes from './routes/auth';
import onboardingRoutes from './routes/onboarding';
import goalsRoutes from './routes/goals';
import tasksRoutes from './routes/tasks';
import connectionsRoutes from './routes/connections';
import reflectionsRoutes from './routes/reflections';
import notificationsRoutes from './routes/notifications';
import aiRoutes from './routes/ai';
import { startScheduler } from './scheduler';

const app = express();
const PORT = process.env.PORT || 3001;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/reflections', reflectionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/ai', aiRoutes);

startScheduler();

app.listen(PORT, () => {
  console.log(`Opus server running on port ${PORT}`);
});
```

### `server/routes/ai.ts`
```typescript
import { Router } from 'express';
import { authenticateToken } from '../auth';
import { generateGoals, refineGoals } from '../../ai_kernel/sandbox_adapter';

const router = Router();

router.post('/generate-goals', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;
    
    const goals = await generateGoals(userId, answers);
    
    res.json({ goals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate goals' });
  }
});

router.post('/refine-goals', authenticateToken, async (req, res) => {
  try {
    const { weekNumber, reflection } = req.body;
    const userId = req.user.id;
    
    const refinedGoals = await refineGoals(userId, weekNumber, reflection);
    
    res.json({ goals: refinedGoals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refine goals' });
  }
});

export default router;
```

### `infra/001_schema.sql`
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  onboarded_at TIMESTAMP,
  current_week INTEGER DEFAULT 1
);

CREATE TABLE onboarding_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  timeframe VARCHAR(20) CHECK (timeframe IN ('long', 'medium', 'short')),
  status VARCHAR(20) DEFAULT 'pending',
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  scheduled_for TIMESTAMP,
  notification_sent BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship_type VARCHAR(100),
  contact_frequency VARCHAR(50),
  last_contact DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  prompt VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE opus_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
CREATE INDEX idx_tasks_scheduled ON tasks(scheduled_for) WHERE NOT completed;
CREATE INDEX idx_reflections_user_week ON reflections(user_id, week_number);
CREATE INDEX idx_embeddings_vector ON opus_embeddings USING ivfflat (embedding vector_cosine_ops);
```

### `ai_kernel/sandbox_adapter.py`
```python
import os
import json
import numpy as np
from typing import List, Dict, Any
import anthropic
from openai import OpenAI
import psycopg2
from psycopg2.extras import RealDictCursor

class OpusSandboxAdapter:
    def __init__(self):
        self.provider = os.environ.get('LLM_PROVIDER', 'anthropic')
        self.db_url = os.environ.get('DATABASE_URL')
        self._init_llm_client()
        self._load_prompts()
    
    def _init_llm_client(self):
        if self.provider == 'anthropic':
            self.client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        elif self.provider == 'openai':
            self.client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    
    def _load_prompts(self):
        with open('prompts.json', 'r') as f:
            self.prompts = json.load(f)
    
    def retrieve_opus_context(self, query: str, k: int = 5) -> List[str]:
        """Retrieve relevant context from Opus Brand Foundation embeddings"""
        conn = psycopg2.connect(self.db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get query embedding
        query_embedding = self._get_embedding(query)
        
        # Find similar content
        cur.execute("""
            SELECT content, metadata
            FROM opus_embeddings
            ORDER BY embedding <-> %s::vector
            LIMIT %s
        """, (query_embedding, k))
        
        results = cur.fetchall()
        conn.close()
        
        return [r['content'] for r in results]
    
    def generate_goals(self, user_id: str, answers: Dict[str, str]) -> List[Dict[str, Any]]:
        """Generate personalized goals based on onboarding answers"""
        
        # Retrieve relevant Opus framework context
        context = self.retrieve_opus_context(f"career goals vision {answers.get('vision', '')}")
        
        prompt = self.prompts['goal_generation'].format(
            vision=answers.get('vision', ''),
            energy=answers.get('energy', ''),
            direction=answers.get('direction', ''),
            opus_context='\n'.join(context)
        )
        
        if self.provider == 'anthropic':
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.content[0].text
        else:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
        
        # Parse response into structured goals
        return self._parse_goals(content)
    
    def refine_goals(self, user_id: str, week_number: int, reflection: str) -> List[Dict[str, Any]]:
        """Refine goals based on weekly reflection"""
        
        # Get existing goals
        conn = psycopg2.connect(self.db_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT * FROM goals 
            WHERE user_id = %s AND status = 'approved'
        """, (user_id,))
        
        current_goals = cur.fetchall()
        
        # Retrieve relevant context
        context = self.retrieve_opus_context(f"weekly reflection refinement {reflection}")
        
        prompt = self.prompts['goal_refinement'].format(
            week_number=week_number,
            reflection=reflection,
            current_goals=json.dumps(current_goals, default=str),
            opus_context='\n'.join(context)
        )
        
        if self.provider == 'anthropic':
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.content[0].text
        else:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
        
        conn.close()
        return self._parse_goals(content)
    
    def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        if self.provider == 'openai':
            response = self.client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        else:
            # Fallback to local embeddings if needed
            return [0.0] * 1536
    
    def _parse_goals(self, llm_output: str) -> List[Dict[str, Any]]:
        """Parse LLM output into structured goals"""
        # Simple parsing - in production, use more robust JSON extraction
        goals = []
        lines = llm_output.strip().split('\n')
        
        current_goal = {}
        for line in lines:
            if line.startswith('GOAL:'):
                if current_goal:
                    goals.append(current_goal)
                current_goal = {
                    'title': line.replace('GOAL:', '').strip(),
                    'ai_generated': True
                }
            elif line.startswith('DESCRIPTION:'):
                current_goal['description'] = line.replace('DESCRIPTION:', '').strip()
            elif line.startswith('TIMEFRAME:'):
                current_goal['timeframe'] = line.replace('TIMEFRAME:', '').strip().lower()
        
        if current_goal:
            goals.append(current_goal)
        
        return goals

# Export functions for Node.js interop
def generate_goals(user_id: str, answers: Dict[str, str]) -> str:
    adapter = OpusSandboxAdapter()
    goals = adapter.generate_goals(user_id, answers)
    return json.dumps(goals)

def refine_goals(user_id: str, week_number: int, reflection: str) -> str:
    adapter = OpusSandboxAdapter()
    goals = adapter.refine_goals(user_id, week_number, reflection)
    return json.dumps(goals)
```

### `ai_kernel/prompts.json`
```json
{
  "goal_generation": "Based on the Opus Brand Foundation principles and the user's responses, generate 3 long-term, 3 medium-term, and 3 short-term career goals.\n\nUser's vision: {vision}\nUser's energy sources: {energy}\nUser's direction: {direction}\n\nOpus Context:\n{opus_context}\n\nGenerate goals that:\n1. Align with personal agency and ownership\n2. Focus on self-discovery and strategic action\n3. Avoid comparison culture\n4. Emphasize reflection before action\n5. Maintain professional warmth\n\nFormat each goal as:\nGOAL: [title]\nDESCRIPTION: [brief description]\nTIMEFRAME: [long/medium/short]",
  
  "goal_refinement": "Based on the user's Week {week_number} reflection and the Opus principle of gentle refinement, suggest minimal adjustments to their goals.\n\nReflection: {reflection}\n\nCurrent Goals:\n{current_goals}\n\nOpus Context:\n{opus_context}\n\nSuggest refinements that:\n1. Maintain continuity (avoid major pivots)\n2. Increase clarity and specificity\n3. Align with emerging patterns\n4. Respect the user's pace\n5. Build on strengths revealed in reflection\n\nFormat refinements as updated goals."
}
```

### `ai_kernel/ingest_opus_doc.py`
```python
#!/usr/bin/env python3
import os
import json
import PyPDF2
import psycopg2
from typing import List, Dict
import openai
import numpy as np

def extract_pdf_content(pdf_path: str) -> List[Dict[str, str]]:
    """Extract text content from Opus Brand Foundation PDF"""
    chunks = []
    
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            
            # Split into semantic chunks (paragraphs/sections)
            paragraphs = text.split('\n\n')
            
            for para in paragraphs:
                if len(para.strip()) > 50:  # Skip very short chunks
                    chunks.append({
                        'content': para.strip(),
                        'metadata': {
                            'page': page_num + 1,
                            'source': 'Opus Brand Foundation Document'
                        }
                    })
    
    return chunks

def generate_embeddings(chunks: List[Dict[str, str]]) -> List[Dict]:
    """Generate embeddings for content chunks"""
    client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    
    embedded_chunks = []
    for chunk in chunks:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk['content']
        )
        
        embedded_chunks.append({
            'content': chunk['content'],
            'embedding': response.data[0].embedding,
            'metadata': json.dumps(chunk['metadata'])
        })
    
    return embedded_chunks

def store_embeddings(embedded_chunks: List[Dict]):
    """Store embeddings in PostgreSQL with pgvector"""
    conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
    cur = conn.cursor()
    
    for chunk in embedded_chunks:
        cur.execute("""
            INSERT INTO opus_embeddings (content, embedding, metadata)
            VALUES (%s, %s::vector, %s::json)
        """, (chunk['content'], chunk['embedding'], chunk['metadata']))
    
    conn.commit()
    conn.close()

def main():
    pdf_path = '../assets/Opus_Brand_Foundation_Document.pdf'
    
    print("Extracting content from PDF...")
    chunks = extract_pdf_content(pdf_path)
    print(f"Extracted {len(chunks)} chunks")
    
    print("Generating embeddings...")
    embedded_chunks = generate_embeddings(chunks)
    print(f"Generated {len(embedded_chunks)} embeddings")
    
    print("Storing in database...")
    store_embeddings(embedded_chunks)
    print("Done!")
    
    # Save local backup
    with open('embeddings.json', 'w') as f:
        json.dump([{
            'content': c['content'],
            'metadata': c['metadata']
        } for c in embedded_chunks], f, indent=2)

if __name__ == "__main__":
    main()
```

### `electron/main.js`
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/logo/opus-logo.png')
  });

  // In production, load from built files
  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    // In development, load from local server
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### `electron/package.json`
```json
{
  "name": "opus-desktop",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:all": "electron-builder -mw"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.opus.app",
    "productName": "Opus",
    "directories": {
      "output": "dist"
    },
    "mac": {
      "category": "public.app-category.productivity"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

### `dev_setup.sh`
```bash
#!/bin/bash

echo "🎼 Setting up Opus development environment..."

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL first."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please configure your .env file and run this script again."
    exit 1
fi

# Create database if not exists
echo "🗄️  Setting up database..."
psql -U postgres -c "CREATE DATABASE opus_db;" 2>/dev/null || echo "Database already exists"

# Run migrations
echo "🔄 Running migrations..."
psql $DATABASE_URL -f infra/001_schema.sql
psql $DATABASE_URL -f infra/002_pgvector.sql

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Seed sample user
echo "🌱 Seeding sample data..."
npm run db:seed

# Ingest Opus document
echo "🤖 Ingesting Opus Brand Foundation Document..."
cd ai_kernel
python3 ingest_opus_doc.py
cd ..

# Generate VAPID keys if needed
if [ -z "$VAPID_PUBLIC_KEY" ]; then
    echo "🔑 Generating VAPID keys for push notifications..."
    npx web-push generate-vapid-keys
fi

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The app will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
```

### `commit_plan.txt`
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Opus v1 prototype with editorial design"

# Add remote origin
git remote add origin https://github.com/opus-for-you/workspace.git

# Push to main branch
git push -u origin main

# Create development branch
git checkout -b develop

# Tag initial version
git tag -a v1.0.0 -m "Version 1.0.0: MVP with onboarding, AI goals, weekly reviews"
git push origin v1.0.0
```

### `README.md`
```markdown
# Opus - Make Your Career Your Own

A career ownership platform with AI-powered goal generation and weekly reflection cycles.

## Quick Start

1. Clone and setup:
```bash
git clone https://github.com/opus-for-you/workspace.git
cd opus-workspace
./dev_setup.sh
```

2. Configure `.env` with your API keys

3. Run development server:
```bash
npm run dev
```

## Features

- ✨ Animated onboarding flow
- 🎯 AI-powered goal generation
- 📝 Weekly reflection system
- 🔔 Smart notification scheduling (max 3/week)
- 🤝 Connections management (unlocked week 2)
- 🔒 Progressive feature unlocking

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + PostgreSQL + pgvector
- AI: Anthropic Claude / OpenAI GPT-4
- Desktop: Electron wrapper

## Building Desktop Apps

```bash
# Build for current platform
cd electron
npm run build:mac  # or build:win

# Output in electron/dist/
```

## Architecture

- Mobile-first responsive design
- Sandboxed AI with RAG over Opus Brand Foundation
- Week-based progression system
- Privacy-first data handling
```