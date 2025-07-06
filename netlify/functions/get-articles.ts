// In `netlify/functions/get-articles.ts`
import type { Handler } from "@netlify/functions";
import { db, isFirebaseInitialized } from "../../lib/firebase";
import { AIResource } from "../../types";

// Mock data for local development when Firebase isn't available
const mockArticles: AIResource[] = [
  {
    id: "1",
    title: "Revolutionary AI Model Achieves Human-Level Reasoning",
    description: "A breakthrough in artificial general intelligence has been achieved with a new model that demonstrates human-level reasoning capabilities across multiple domains.",
    url: "https://example.com/ai-breakthrough",
    sourceName: "AI Research Journal",
    trendingScore: 0.95,
    tags: ["AGI", "Machine Learning", "Research"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: "2", 
    title: "Major Tech Company Releases Open-Source Language Model",
    description: "A leading technology company has open-sourced their latest large language model, making advanced AI capabilities accessible to researchers worldwide.",
    url: "https://example.com/open-source-llm",
    sourceName: "TechCrunch",
    trendingScore: 0.87,
    tags: ["Open Source", "LLM", "Technology"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const handler: Handler = async () => {
  try {
    // If Firebase isn't initialized, return mock data for local development
    if (!isFirebaseInitialized || !db) {
      console.log("Using mock data for local development");
      return {
        statusCode: 200,
        body: JSON.stringify({ articles: mockArticles }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    
    const articlesRef = db.collection('airesources');
    const snapshot = await articlesRef.orderBy('createdAt', 'desc').limit(20).get();

    if (snapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({ articles: [] }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const articles: AIResource[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamps to JSON-compatible ISO strings, with a fallback.
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      } as AIResource;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ articles }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error("Error fetching articles:", error instanceof Error ? error.message : "Unknown error");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred while fetching articles." }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

export { handler };