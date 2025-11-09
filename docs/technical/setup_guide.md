# Opus Setup Guide

## Prerequisites

- Node.js 20 or higher
- PostgreSQL database (Neon or local)
- npm or yarn package manager

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/opus-app.git
cd opus-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Session Secret (generate a random string)
SESSION_SECRET=your-secret-key-here

# Postgres Connection Details
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-postgres-user
PGPASSWORD=your-postgres-password
PGDATABASE=your-database-name
```

### 4. Database Setup

Push the database schema:

```bash
npm run db:push
```

This command will:
- Connect to your PostgreSQL database
- Create all necessary tables
- Set up relationships and constraints

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:5000/api`

## Replit Setup

### 1. Create a Replit Project

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Import from GitHub or create a new Node.js project

### 2. Configure Database

Replit provides built-in PostgreSQL:

1. Click "Database" in the left sidebar
2. Create a new PostgreSQL database
3. Environment variables will be auto-configured

### 3. Set Session Secret

Add `SESSION_SECRET` to Replit Secrets:

1. Click on "Secrets" (lock icon)
2. Add new secret:
   - Key: `SESSION_SECRET`
   - Value: Generate a random string (at least 32 characters)

### 4. Deploy Database Schema

In the Replit shell, run:

```bash
npm run db:push
```

### 5. Run the Application

Click the "Run" button or use:

```bash
npm run dev
```

## Project Structure

```
opus/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main application
│   └── index.html
│
├── server/                # Backend Express application
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry
│
├── shared/               # Shared TypeScript code
│   └── schema.ts        # Database schema and types
│
├── docs/                # Documentation
│   ├── architecture.md
│   ├── api_endpoints.md
│   ├── setup_guide.md
│   └── roadmap.md
│
└── package.json         # Dependencies and scripts
```

## Development Workflow

### Adding New Features

1. **Define Schema** (`shared/schema.ts`)
   ```typescript
   export const myTable = pgTable("my_table", {
     // ... columns
   });
   ```

2. **Update Storage** (`server/storage.ts`)
   ```typescript
   async getMyData(userId: string): Promise<MyData[]> {
     // ... implementation
   }
   ```

3. **Add API Routes** (`server/routes.ts`)
   ```typescript
   app.get("/api/my-data", requireAuth, async (req, res) => {
     // ... implementation
   });
   ```

4. **Build Frontend** (`client/src/pages/`)
   ```tsx
   const { data } = useQuery<MyData[]>({
     queryKey: ["/api/my-data"],
   });
   ```

5. **Push Schema Changes**
   ```bash
   npm run db:push
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify `DATABASE_URL` is correctly set
2. Ensure PostgreSQL is running
3. Check network connectivity to database host
4. Verify credentials are correct

### Session Issues

If sessions aren't persisting:

1. Verify `SESSION_SECRET` is set
2. Check that session store is properly configured
3. Ensure cookies are enabled in browser

### Build Errors

If the build fails:

1. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear build cache:
   ```bash
   rm -rf dist
   npm run build
   ```

### Schema Sync Issues

If database schema is out of sync:

1. Use force push:
   ```bash
   npm run db:push --force
   ```

2. Or manually verify schema in Drizzle Studio:
   ```bash
   npm run db:studio
   ```

## Security Notes

### Production Deployment

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong SESSION_SECRET** - Generate a cryptographically random string
3. **Enable HTTPS** - Always use secure connections in production
4. **Update dependencies** - Regularly update packages for security patches
5. **Implement rate limiting** - Protect against brute force attacks

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV=production` - Enable production optimizations

## Next Steps

1. **Create Your First User**: Use the registration form
2. **Add Connections**: Track your professional relationships
3. **Set Goals**: Define your objectives
4. **Create Tasks**: Break down your goals into actionable items
5. **Weekly Review**: Reflect on your progress every week

## Getting Help

- [GitHub Issues](https://github.com/your-username/opus-app/issues)
- [Documentation](./architecture.md)
- [API Reference](./api_endpoints.md)
- [Roadmap](./roadmap.md)
