import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

// pass the authOptions as an argument into NextAuth function
const handler = NextAuth({
  ...authConfig,
});

// NEW ROUTE HANDLER
export { handler as GET, handler as POST };

/**
 * https://github.com/vercel/next.js/discussions/58852
 */
