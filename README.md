# CaloFeed - Social Food & Calorie Tracker

A modern social nutrition tracking application built with React, TypeScript, and Tailwind CSS.

## Demo Mode

This application is currently running in demo mode. To enable full functionality:

1. Set up a Supabase project at [supabase.com](https://supabase.com)
2. Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the database migrations in your Supabase project using the SQL files in `/supabase/migrations/`

## Features

- Social food sharing and discovery
- Calorie and macro tracking
- AI-powered food analysis
- Community challenges and leaderboards
- Weight tracking and progress analytics
- Real-time notifications
- Mobile-responsive design
- Progressive Web App (PWA) support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Demo Mode section above)
4. Start development server: `npm run dev`

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── services/      # API and business logic
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── lib/           # Third-party library configurations
```

## Contributing

This is a demonstration project showcasing modern web development practices with React, TypeScript, and Supabase.