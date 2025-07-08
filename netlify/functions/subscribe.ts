
import type { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { User } from "../../types";

const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers
    };
  }

  if (!db) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Firebase has not been initialized." }),
      headers,
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { user, email, subscribed } = body as { user?: User | null; email?: string; subscribed?: boolean };

    // Handle case where user object is passed directly (toggle subscription)
    if (user && user.id) {
      const subscriberRef = db.collection('subscribers').doc(user.id);
      const now = new Date();

      if (subscribed === false) {
        // Unsubscribe: remove from subscribers
        await subscriberRef.delete();
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Successfully unsubscribed!" }),
          headers,
        };
      } else {
        // Subscribe: add/update subscriber
        await subscriberRef.set({
          userId: user.id,
          email: user.email || null,
          githubUsername: user.githubUsername,
          name: user.name,
          subscribedAt: now,
        }, { merge: true });

        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Successfully subscribed!" }),
          headers,
        };
      }
    }

    // Handle case where email is passed for non-authenticated users
    if (email && !user) {
      // For non-authenticated users, just store email in a separate collection
      const emailRef = db.collection('email_subscribers').doc();
      const now = new Date();

      await emailRef.set({
        email: email,
        subscribedAt: now,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully subscribed!" }),
        headers,
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid user data provided." }),
      headers,
    };

  } catch (error) {
    console.error("Subscription error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
      headers,
    };
  }
};

export { handler };
