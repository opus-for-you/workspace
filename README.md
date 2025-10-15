# Opus

> A personal and client management app for young professionals

Opus helps young professionals stay organized, build meaningful connections, and achieve their goals with powerful tools for task management, goal tracking, and weekly reflection.

![Opus Dashboard](https://via.placeholder.com/800x400/210B58/FFFFFF?text=Opus+Dashboard)

## Features

### 🎯 Goal Tracking
- Set personal and professional objectives
- Track progress with visual indicators
- Associate tasks with specific goals
- Target date management

### ✅ Task Management
- Create and organize tasks
- Kanban board and list views
- Link tasks to goals
- Due date tracking and status management

### 👥 Connection Management
- Track professional relationships
- Log last contact dates
- Set relationship reminders
- Grid and list view options

### 📝 Weekly Reviews
- Structured reflection system
- Track wins and achievements
- Document lessons learned
- Plan next week's focus

### 🎨 Modern UI
- Clean, productivity-focused design
- Dark and light themes
- Responsive mobile-first layout
- Smooth interactions and transitions

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- TailwindCSS + shadcn/ui
- TanStack Query (React Query)
- Wouter (routing)
- React Hook Form + Zod validation

**Backend:**
- Node.js + Express
- PostgreSQL (Neon serverless)
- Drizzle ORM
- Passport.js authentication
- Session-based security

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/opus-app.git
cd opus-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
opus/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared TypeScript types
├── docs/            # Documentation
└── package.json
```

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Endpoints](./docs/api_endpoints.md)
- [Setup Guide](./docs/setup_guide.md)
- [Roadmap](./docs/roadmap.md)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### Adding Features

1. Define schema in `shared/schema.ts`
2. Update storage layer in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Build frontend components in `client/src/`
5. Run `npm run db:push` to sync database

## Roadmap

### Current (MVP)
- ✅ Authentication
- ✅ Dashboard with metrics
- ✅ Goal tracking
- ✅ Task management
- ✅ Connection management
- ✅ Weekly reviews
- ✅ Dark/light themes

### Coming Soon
- 🤖 AI-powered reflection prompts
- 📱 Push notifications for tasks
- 📊 Analytics dashboard
- 👥 Collaboration features
- 📱 Mobile apps (iOS/Android)
- 🔗 Calendar & CRM integrations

See the [full roadmap](./docs/roadmap.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## Support

- 📧 Email: support@opus-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/opus-app/issues)
- 📖 Docs: [Documentation](./docs/architecture.md)

---

Made with ❤️ for young professionals everywhere
