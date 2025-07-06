import type { Handler } from "@netlify/functions";

const handler: Handler = async () => {
  const { GITHUB_CLIENT_ID, APP_URL } = process.env;

  if (!GITHUB_CLIENT_ID || !APP_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server configuration error." }),
    };
  }

  const redirectUri = `${APP_URL}/.netlify/functions/auth-callback`;
  const scope = "read:user user:email"; // Request access to user's profile and email

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  return {
    statusCode: 302, // 302 Found for redirection
    headers: {
      Location: githubAuthUrl,
    },
    body: "", // Body is empty for a redirect
  };
};

export { handler };