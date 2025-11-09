# Getting Started with Opus

Welcome! This guide will help you get Opus running on your computer in just a few minutes.

## 🎯 What is Opus?

Opus is a 5-week professional transformation program with a mobile app that helps you:
- Set meaningful goals aligned with your "north star" vision
- Break down goals into actionable tasks
- Reflect on your weekly progress
- Build better professional habits

The app uses AI (Claude + OpenAI) to generate personalized recommendations.

---

## 📋 Prerequisites

You need:
1. **Node.js 20 or higher** - [Download here](https://nodejs.org)
2. **A code editor** (optional) - [VS Code](https://code.visualstudio.com/) is recommended
3. **10 minutes** of time

That's it! Everything else will be installed automatically.

---

## 🚀 Quick Start (2 Options)

### Option 1: Test the UI (No Setup Required) ⭐ EASIEST

Perfect for designers, product managers, or anyone who just wants to see the app.

```bash
# 1. Install dependencies
npm run setup

# 2. Start the mobile app
npm run start:mobile

# 3. Press 'i' for iOS or 'a' for Android
```

**Done!** The app runs in MOCK_MODE with realistic sample data. No database or API keys needed.

---

### Option 2: Full Development Setup

For developers who want to work with real data and AI features.

```bash
# 1. Run the interactive setup wizard
npm run quick-start

# 2. Follow the prompts - it will:
#    - Install dependencies
#    - Create .env template
#    - Run health checks
#    - Guide you through configuration
```

You'll need:
- A PostgreSQL database (we recommend [Neon](https://neon.tech) - free tier works great)
- Optional: AI API keys ([Anthropic](https://console.anthropic.com/), [OpenAI](https://platform.openai.com/))

---

## 🎨 What You'll See

The Opus mobile app includes:

### **Onboarding Flow**
1. **North Star** - Define your ultimate professional vision
2. **Program Introduction** - Learn about the 5-week framework

### **Main App (5 Tabs)**
1. **Dashboard** - Current week progress and quick actions
2. **Goals** - Your AI-generated and custom goals
3. **Tasks** - Actionable tasks broken down from goals
4. **Reflections** - Weekly review and insights
5. **Profile** - Settings and program progress

### **The 5-Week Framework**
- **Week 1: Purpose** 🎯 - Clarity and vision
- **Week 2: Rhythm** ⚡ - Habits and consistency
- **Week 3: Network** 🌐 - Relationships and connections
- **Week 4: Structure** 🏗️ - Systems and frameworks
- **Week 5: Methods** 🔧 - Techniques and optimization

---

## 🛠️ Common Tasks

### Starting the App

**Just the mobile app (MOCK_MODE):**
```bash
npm run start:mobile
```

**Full stack (mobile + backend):**
```bash
# Terminal 1:
npm run start:backend

# Terminal 2:
npm run start:mobile
```

### Checking if Everything Works

```bash
npm run health-check
```

This will verify:
- ✅ Node.js version
- ✅ Dependencies installed
- ✅ Environment configured
- ✅ Database connection (if configured)

### Resetting Everything

If something goes wrong:

```bash
# Delete node_modules
rm -rf node_modules mobile/node_modules

# Run setup again
npm run setup
```

---

## 🔧 Configuration

### .env File (Required for Real Backend)

After running `npm run setup`, edit `.env`:

```env
# Required for backend:
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=any-random-string-here

# Optional (for AI features):
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

### MOCK_MODE (Mobile App)

The mobile app can run with or without a backend:

**With MOCK_MODE (default):**
- No backend needed
- Sample data included
- Perfect for UI testing
- Files: `mobile/lib/api.ts` and `mobile/lib/auth-store.ts`

**Without MOCK_MODE:**
- Requires backend running
- Real database and AI
- Set `MOCK_MODE = false` in both files above

---

## 📱 Platform-Specific Notes

### iOS
```bash
npm run start:mobile
# Press 'i' when Expo starts
```

Requires:
- macOS
- Xcode installed
- iOS Simulator

### Android
```bash
npm run start:mobile
# Press 'a' when Expo starts
```

Requires:
- Android Studio
- Android emulator configured

### Web (Testing Only)
```bash
cd mobile
npm run web
```

Limited functionality, mobile app is primary.

---

## 🆘 Troubleshooting

### "Command not found: npm"
**Problem:** Node.js not installed
**Solution:** Download from [nodejs.org](https://nodejs.org)

### "Port 5000 already in use"
**Problem:** Another app is using port 5000
**Solution:**
```bash
# Option 1: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in .env
PORT=5001
```

### "Cannot connect to database"
**Problem:** DATABASE_URL incorrect or database not running
**Solution:**
1. Check `.env` has correct DATABASE_URL
2. Test database connection
3. Use [Neon](https://neon.tech) for easy PostgreSQL hosting

### "Expo won't start"
**Problem:** Mobile dependencies not installed
**Solution:**
```bash
cd mobile
npm install --legacy-peer-deps
```

### "AI features don't work"
**Problem:** No API keys configured
**Solution:**
1. Get key from [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/)
2. Add to `.env`
3. Restart backend

---

## 📚 Additional Resources

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive developer guide
- **[scripts/README.md](./scripts/README.md)** - All helper scripts explained
- **[docs/](./docs/)** - Full documentation
  - Architecture overview
  - API endpoints
  - Design system
  - Mobile implementation details

---

## 🎉 You're Ready!

Choose your path:

### Quick UI Test
```bash
npm run setup
npm run start:mobile
```

### Full Development
```bash
npm run quick-start
# Follow the interactive prompts
```

---

## 💡 Tips for Success

1. **Start with MOCK_MODE** - See the app working immediately
2. **Use health checks** - Run `npm run health-check` often
3. **Read error messages** - They're designed to be helpful
4. **Check the scripts** - We've automated most common tasks
5. **Join the community** - Check docs for support channels

---

## 🤝 Need Help?

1. Run `npm run health-check` to diagnose issues
2. Check [CLAUDE.md](./CLAUDE.md) for detailed troubleshooting
3. Review error messages carefully - they include solutions
4. Search existing issues on GitHub

---

**Happy building! 🚀**

*The Opus team*
