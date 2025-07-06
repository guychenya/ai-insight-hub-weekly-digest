import type { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { AIResource } from "../../types";
import { v4 as uuidv4 } from 'uuid';

// Helper to validate the incoming article data
function isValidArticle(article: any): article is Omit<AIResource, 'id' | 'createdAt' | 'updatedAt'> {
    return (
        typeof article.title === 'string' &&
        typeof article.description === 'string' &&
        typeof article.sourceName === 'string' &&
        typeof article.url === 'string' &&
        typeof article.trendingScore === 'number' &&
        Array.isArray(article.tags)
    );
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!db) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Service temporarily unavailable." }),
    };
  }

  try {
    // Check request body size (limit to 1MB)
    const body = event.body || "{}";
    if (body.length > 1024 * 1024) {
      return {
        statusCode: 413,
        body: JSON.stringify({ message: "Request body too large." }),
      };
    }

    const { articles } = JSON.parse(body);

    if (!Array.isArray(articles) || articles.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request: No articles provided." }),
      };
    }

    // Limit number of articles to prevent abuse
    if (articles.length > 20) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Too many articles. Maximum 20 allowed." }),
      };
    }

    const batch = db.batch();
    const now = new Date();

    for (const articleData of articles) {
      if (!isValidArticle(articleData)) {
          console.warn("Skipping invalid article data:", articleData);
          continue; // Skip this invalid entry
      }

      const newId = uuidv4(); // Generate a new unique ID
      const docRef = db.collection('airesources').doc(newId);
      
      const newArticle: AIResource = {
        id: newId,
        ...articleData,
        createdAt: now,
        updatedAt: now,
      };

      batch.set(docRef, newArticle);
    }

    await batch.commit();

    return {
      statusCode: 201, // 201 Created is more appropriate here
      body: JSON.stringify({ message: "Articles saved successfully." }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error("Error saving articles:", error instanceof Error ? error.message : "Unknown error");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred while saving articles." }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

export { handler };