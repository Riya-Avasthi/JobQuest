import dotenv from 'dotenv';
dotenv.config();

// Simplified Auth0 config for local development
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  },
  // Simple session without secure cookies
  session: {
    absoluteDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
    // No cookie config here to avoid secure cookie issues
  }
};

export default authConfig; 