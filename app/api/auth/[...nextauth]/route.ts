import bcrypt from 'bcrypt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/lib/prismadb';

/**
 * authOptions should be exported since we will use getServerSession that require this value in the argument
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        // if empty credentials is accepted
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error('Username or password is empty');
        }

        const user = await prisma.user
          .findUnique({
            where: {
              username: credentials.username,
            },
          })
          .catch((error) => {
            console.error('Query Error:', error);
            throw error;
          });

        // user not found
        if (!user || !user?.hashed_password) {
          throw new Error('Invalid credentials');
        }

        // check password
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashed_password);

        // password is invalid
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // valid password
        return user;
      },
    }),
  ],
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
};

// pass the authOptions as an argument into NextAuth function
const handler = NextAuth(authOptions);

// WHAT IS THIS?
export { handler as GET, handler as POST };
