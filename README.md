# 🚀 The Starter Pack - AI-Powered SaaS Foundation

A production-ready starter template for building modern SaaS applications with AI integration, built on Next.js 15, React 19, and TypeScript.

## ✨ Features

### 🎯 Core Technologies
- **Next.js 15** - Latest App Router with server components
- **React 19** - Cutting-edge React features
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components

### 🤖 AI Integration
- **Multi-Provider Support** - OpenAI, Anthropic, and more
- **Streaming Responses** - Real-time AI interactions
- **Context Management** - Intelligent conversation handling
- **Rate Limiting** - Built-in API protection

### 🔐 Authentication & Security
- **NextAuth.js** - Complete auth solution
- **Multiple Providers** - Email, Google, GitHub
- **Role-Based Access** - User, Admin, Super Admin
- **Session Management** - Secure JWT tokens

### 💾 Database & Backend
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production-grade database
- **API Routes** - Full-stack capabilities
- **Real-time Updates** - WebSocket support

### 🎨 UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - System preference detection
- **Loading States** - Skeleton screens
- **Error Boundaries** - Graceful error handling
- **Accessibility** - WCAG compliant

### 🛠️ Developer Experience
- **Hot Reload** - Fast development
- **ESLint & Prettier** - Code quality
- **Husky** - Git hooks
- **CI/CD Ready** - GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- Git

### Installation

#### Option 1: Quick Start (Recommended) 🚀
```bash
git clone https://github.com/CleanExpo/The-Starter-Pack.git
cd The-Starter-Pack
npm run setup
```

This interactive setup will:
- Check your Node.js version
- Create `.env.local` with sensible defaults
- Install all dependencies
- Set up your database (optional)
- Get you ready to code!

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CleanExpo/The-Starter-Pack.git
   cd The-Starter-Pack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values (see [Environment Variables](#environment-variables) section)

4. **Set up the database**
   ```bash
   npm run setup:db
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
src/
├── app/                # Next.js app router pages
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   └── (dashboard)/   # Protected routes
├── components/        # React components
│   ├── ui/           # Base UI components
│   └── features/     # Feature-specific components
├── lib/              # Utilities and helpers
│   ├── auth/         # Auth configuration
│   ├── db/           # Database client
│   └── ai/           # AI integrations
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
└── styles/           # Global styles
```

## 🎯 Key Features Explained

### AI Chat Integration
```typescript
// Easy AI integration
import { useAIChat } from '@/hooks/useAIChat';

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useAIChat();
  
  return (
    <ChatInterface 
      messages={messages}
      onSend={sendMessage}
      loading={isLoading}
    />
  );
}
```

### Authentication
```typescript
// Protected API route
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Your protected logic here
}
```

### Database Operations
```typescript
// Type-safe database queries
import { prisma } from '@/lib/db';

const users = await prisma.user.findMany({
  where: { active: true },
  include: { profile: true }
});
```

## 🔧 Environment Variables

The Starter Pack uses environment variables for configuration. Here's what each one does:

### Required Variables
```env
# Database Connection
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# NextAuth Configuration  
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="min-32-character-secret"
```

### Optional Integrations
```env
# AI Providers
OPENAI_API_KEY="sk-..."          # OpenAI GPT models
ANTHROPIC_API_KEY="sk-ant-..."   # Claude models

# OAuth Providers
GOOGLE_CLIENT_ID=""               # Google Sign-in
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""               # GitHub Sign-in
GITHUB_CLIENT_SECRET=""

# Email Service
RESEND_API_KEY=""                 # Transactional emails
EMAIL_FROM="noreply@yourdomain.com"

# Analytics & Monitoring
SENTRY_DSN=""                     # Error tracking
NEXT_PUBLIC_GA_ID=""              # Google Analytics
```

### Feature Flags
```env
ENABLE_AI_FEATURES="true"         # AI chat and generation
ENABLE_ANALYTICS="false"          # Usage analytics
ENABLE_EMAIL_AUTH="true"          # Email/password auth
ENABLE_ADMIN_PANEL="false"        # Admin dashboard
```

See `.env.example` for a complete list with descriptions.

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

### Docker
```bash
docker build -t starter-pack .
docker run -p 3000:3000 starter-pack
```

### Manual
```bash
npm run build
npm start
```

## 📚 Documentation

- [Setup Guide](./docs/setup.md)
- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Contributing](./CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with amazing open-source projects:
- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://prisma.io)

---

Made with ❤️ by [CleanExpo](https://github.com/CleanExpo)