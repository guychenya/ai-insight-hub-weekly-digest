
import type { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { User } from "../../types";

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!db) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Firebase has not been initialized." }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { user, email } = body as { user?: User | null; email?: string; subscribed?: boolean };

    // Handle case where user object is passed directly
    if (user && user.id) {
      const subscriberRef = db.collection('subscribers').doc(user.id);
      const now = new Date();

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
        headers: { 'Content-Type': 'application/json' },
      };
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
        headers: { 'Content-Type': 'application/json' },
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid user data provided." }),
    };

  } catch (error) {
    console.error("Subscription error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

export { handler };
