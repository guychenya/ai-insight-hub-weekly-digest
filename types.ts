// Represents a user, authenticated via GitHub
export interface User {
  id: string;
  githubUsername: string;
  name: string;
  avatarUrl?: string;
  email?: string;
  receivesDigestEmails?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Represents a curated AI news article or resource
export interface AIResource {
  id: string; // Unique ID for the article (e.g., a hash of the URL)
  title: string;
  description: string;
  url: string;
  sourceName: string; // e.g., "TechCrunch", "OpenAI Blog"
  trendingScore: number; // A score from 0.0 to 1.0
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Future fields for user interaction
  avgRating?: number;
  ratingCount?: number;
}

// Represents a user's comment on a resource
export interface Comment {
  id: string;
  content: string;
  user: Pick<User, 'githubUsername' | 'avatarUrl' | 'id'>; // Embedded user info
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Represents a user's rating on a resource
export interface Rating {
  id: string;
  score: number; // e.g., 1-5
  userId: string;
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Represents a citation from Google Search grounding
export interface GroundingSource {
  uri: string;
  title: string;
}
