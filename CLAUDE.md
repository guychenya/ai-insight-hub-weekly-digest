# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server using Vite
- `npm run build` - Build the application for production
- `npm run preview` - Preview the built application
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run typecheck` - Run TypeScript type checking without emitting files
- `npm start` - Start Netlify dev server for local development with functions

## Architecture Overview

This is a React-based AI news digest application that generates weekly AI insights using Google's Gemini API. The application follows a modern serverless architecture:

### Frontend (React + Vite)
- **App.tsx** - Main application component managing article state and digest generation
- **components/** - Reusable UI components including auth, project cards, and subscription forms
- **hooks/** - Custom React hooks for authentication and state management
- **services/** - API service layer for Gemini integration

### Backend (Netlify Functions)
- **netlify/functions/** - Serverless functions handling:
  - `generate-digest.ts` - Uses Gemini API with Google Search to generate AI news articles
  - `get-articles.ts` - Retrieves saved articles from database
  - `save-articles.ts` - Persists generated articles
  - Authentication functions for user management

### Key Technologies
- **React 19** with TypeScript for the frontend
- **Vite** for build tooling and development server
- **Netlify Functions** for serverless backend
- **Google Gemini API** for AI-powered content generation with search capabilities
- **Firebase Admin** for authentication and data persistence

### Data Flow
1. User clicks "Generate & Save New Digest"
2. Frontend calls `generate-digest` function
3. Function uses Gemini API with Google Search to find trending AI news
4. Generated articles are saved via `save-articles` function
5. Frontend refreshes to display updated article list

### Environment Setup
Critical environment variables required in `.env.local`:
- `GEMINI_API_KEY` - Google AI Studio API key for content generation
- Firebase Admin SDK credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)  
- GitHub OAuth credentials (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)
- `APP_URL` - Application base URL

See `.env.example` for complete configuration template and `SETUP.md` for detailed setup instructions.

### Authentication & Data Persistence
- **GitHub OAuth** authentication flow via Netlify functions (`auth-start.ts`, `auth-callback.ts`, `logout.ts`)
- **Firebase Firestore** for data persistence with collections: `airesources`, `users`
- Custom authentication hook (`useAuth`) manages user state across the application
- User subscription management via `subscribe.ts` function

### Netlify Configuration
- Build command: `npm run build`, publish directory: `dist`
- Functions bundled with esbuild, SPA redirect for client-side routing
- Development proxy: Vite dev server (port 5173) proxied through Netlify dev (port 8888)