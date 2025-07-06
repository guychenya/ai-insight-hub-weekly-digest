
import type { Handler } from "@netlify/functions";
import cookie from "cookie";
import { User } from "../../types";

const USER_COOKIE_KEY = 'auth_user';

const handler: Handler = async (event) => {
  const cookies = cookie.parse(event.headers.cookie || "");
  const userCookie = cookies[USER_COOKIE_KEY];

  if (!userCookie) {
    return {
      statusCode: 200,
      body: JSON.stringify({ user: null }),
    };
  }

  try {
    const user: User = JSON.parse(userCookie);
    return {
      statusCode: 200,
      body: JSON.stringify({ user }),
    };
  } catch (error) {
    // If the cookie is malformed, clear it
    const clearedCookie = cookie.serialize(USER_COOKIE_KEY, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0), // Expire immediately
    });
    return {
      statusCode: 200,
      headers: { 'Set-Cookie': clearedCookie },
      body: JSON.stringify({ user: null }),
    };
  }
};

export { handler };
