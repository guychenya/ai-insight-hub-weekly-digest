// Placed in `lib/firebase.ts`
import admin from 'firebase-admin';

// --- IMPORTANT SETUP INSTRUCTIONS ---
// To use this function, you need to set the following environment variables in your Netlify site settings
// (under Site settings > Build & deploy > Environment > Environment variables):
//
//    - `FIREBASE_PROJECT_ID`: Your Firebase project ID from the project settings.
//    - `FIREBASE_CLIENT_EMAIL`: The `client_email` from your downloaded service account JSON file.
//    - `FIREBASE_PRIVATE_KEY`: The `private_key` from your service account JSON file.
//      This is a long string that includes `\n` characters. Copy the entire string.
//      When pasting into the Netlify UI, it should handle the newlines correctly.

let isFirebaseInitialized = false;

export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    isFirebaseInitialized = true;
    return true;
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn("Firebase environment variables are not set. Firebase Admin cannot be initialized. Using mock data for local development.");
      return false;
  }

  console.log("Initializing Firebase with project:", process.env.FIREBASE_PROJECT_ID);

  const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseInitialized = true;
    return true;
  } catch (e) {
    console.error('Firebase admin initialization error', e);
    return false;
  }
}

// Initialize on module load
isFirebaseInitialized = initializeFirebaseAdmin();

export const db = isFirebaseInitialized ? admin.firestore() : null;
export const auth = isFirebaseInitialized ? admin.auth() : null;
export { isFirebaseInitialized };
