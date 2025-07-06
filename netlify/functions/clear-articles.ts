import type { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  if (!db) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Firebase has not been initialized." }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
    console.log("Clearing all articles from the database...");
    
    // Get all articles
    const articlesRef = db.collection('airesources');
    const snapshot = await articlesRef.get();
    
    if (snapshot.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No articles to clear.", deletedCount: 0 }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Delete all articles in batches (Firestore batch limit is 500)
    const batch = db.batch();
    let deletedCount = 0;

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    await batch.commit();
    console.log(`Successfully deleted ${deletedCount} articles`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Successfully cleared ${deletedCount} articles.`,
        deletedCount 
      }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error("Error clearing articles:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

export { handler };