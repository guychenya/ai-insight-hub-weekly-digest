
import { AIResource, GroundingSource } from "../types";

export async function generateAIDigest(): Promise<{ articles: Omit<AIResource, 'createdAt' | 'updatedAt'>[], sources: GroundingSource[] }> {
  try {
    const response = await fetch('/.netlify/functions/generate-digest');

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) // Gracefully handle non-JSON responses
      throw new Error(errorData.message || `Request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response contains a cooldown error
    if (data.error) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    console.error("Error fetching new digest:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching the new digest.");
  }
}

export async function clearAllArticles(): Promise<{ message: string; deletedCount: number }> {
  try {
    const response = await fetch('/.netlify/functions/clear-articles', {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error clearing articles:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while clearing articles.");
  }
}
