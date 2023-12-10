import { NextAuthOptions } from 'next-auth';
import { authProviders } from './authProviders';

/**
 * authConfig should be exported since we will use getServerSession that require this value in the argument
 */
export const authConfig: NextAuthOptions = {
  // contain logic authorization
  providers: authProviders,
  callbacks: {
    // jwt callback (adding id, username, firstname to JWT token)
    async jwt({ token, user, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          firstname: user.first_name,
        };
      }
      return token;
    },

    // session callback (adding username, firstname to session)
    async session({ session, token, user }) {
      if (session) {
        session.user.username = token.username;
        session.user.firstname = token.firstname;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  // session strategy (saving the session on client side not server side)
  session: {
    strategy: 'jwt',
  },
  // this will config the custom landing page for sign-in
  // This is not required, but by adding signIn: '/login'
  // into our pages option, the user will be redirected to our
  // custom login page, rather than the NextAuth.js default page.
  pages: {
    signIn: '/sign-in',
  },
};
