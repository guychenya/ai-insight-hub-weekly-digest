
import type { Handler } from "@netlify/functions";
import cookie from "cookie";

const USER_COOKIE_KEY = 'auth_user';

const handler: Handler = async () => {
  const clearedCookie = cookie.serialize(USER_COOKIE_KEY, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return {
    statusCode: 200,
    headers: { 'Set-Cookie': clearedCookie },
    body: JSON.stringify({ message: "Logged out successfully." }),
  };
};

export { handler };
