# Setup Guide for AI Insight Hub

## Prerequisites
- Node.js (v16 or higher)
- Firebase Project
- Google AI Studio Account
- GitHub OAuth App

## Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore Database
   - Go to Project Settings > Service Accounts
   - Generate a new private key (downloads JSON file)
   - Update `.env.local` with:
     - `FIREBASE_PROJECT_ID`: Your project ID
     - `FIREBASE_CLIENT_EMAIL`: The client_email from the JSON
     - `FIREBASE_PRIVATE_KEY`: The private_key from the JSON (keep formatting)

3. **Setup Firestore Collections:**
   Create these collections in Firestore:
   - `airesources` - For storing AI news articles
   - `users` - For storing user authentication data

4. **Get Gemini API Key:**
   - Visit https://aistudio.google.com/app/apikey
   - Create a new API key
   - Update `GEMINI_API_KEY` in `.env.local`

5. **Setup GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App with:
     - Homepage URL: `http://localhost:5173` (for local dev)
     - Authorization callback URL: `http://localhost:5173/.netlify/functions/auth-callback`
   - Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env.local`

## Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   This starts both the Vite dev server and Netlify functions locally.

3. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

1. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add all environment variables from `.env.local` to Netlify's environment settings

2. **Update OAuth settings:**
   - Update GitHub OAuth App URLs to use your production domain
   - Update `APP_URL` environment variable in Netlify