import type { Handler } from "@netlify/functions";
import { db } from "../../lib/firebase";
import { User } from "../../types";
import cookie from "cookie";

const USER_COOKIE_KEY = 'auth_user';

const handler: Handler = async (event) => {
  const { code } = event.queryStringParameters || {};

  if (!code) {
    return { statusCode: 400, body: "Authorization code is missing." };
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, APP_URL } = process.env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !APP_URL) {
    return { statusCode: 500, body: "Server configuration error." };
  }

  try {
    console.log("Auth callback started with code:", code?.substring(0, 10) + "...");
    
    // 1. Exchange the code for an access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("Token response received successfully");
    
    if (tokenData.error) {
      console.error("GitHub token error:", tokenData.error);
      throw new Error(tokenData.error_description);
    }
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("No access token received from GitHub");
      throw new Error("No access token received from GitHub");
    }

    // 2. Fetch the user's profile from GitHub
    const userProfileResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const githubUser = await userProfileResponse.json();
    console.log("GitHub user profile retrieved successfully");

    // 3. Create or update the user in Firestore (only if db is available)
    let userData: User;
    
    if (!db) {
      // If Firebase is not available, create a temporary user object
      userData = {
        id: String(githubUser.id),
        githubUsername: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        name: githubUser.name || githubUser.login,
        email: githubUser.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      const usersRef = db.collection('users');
      const userDocRef = usersRef.doc(String(githubUser.id));
      const userDoc = await userDocRef.get();

      const now = new Date();

      if (!userDoc.exists) {
        userData = {
          id: String(githubUser.id),
          githubUsername: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          name: githubUser.name || githubUser.login,
          email: githubUser.email, // This might be null if not public
          createdAt: now,
          updatedAt: now,
        };
        await userDocRef.set(userData);
      } else {
        const existingData = userDoc.data() as User;
        userData = {
          ...existingData,
          githubUsername: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          name: githubUser.name || githubUser.login,
          updatedAt: now,
        };
        await userDocRef.update({ ...userData });
      }
    }

    // 4. Set a secure, HTTP-only cookie with the user data
    const userCookie = cookie.serialize(USER_COOKIE_KEY, JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // 5. Redirect back to the main application
    console.log("Auth completed successfully, redirecting to:", APP_URL);
    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': userCookie,
        'Location': APP_URL,
      },
      body: "",
    };

  } catch (error) {
    console.error("Auth callback error:", error);
    return { statusCode: 500, body: "An internal error occurred during authentication." };
  }
};

export { handler };