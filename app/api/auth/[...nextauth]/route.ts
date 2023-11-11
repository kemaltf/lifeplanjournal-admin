import prisma from '@/lib/prismadb';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const authOptions: NextAuthOptions = {
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
        // "Why do we use 'findFirst' instead of 'findUnique' because Prisma's 'findUnique' requires a unique 'where' argument. In your Prisma model schema, you use UUID as the ID, so when you try to find a user based on the username, Prisma expects you to also provide the ID.
        const user = await prisma.user
          .findFirst({
            where: {
              username: credentials.username,
            },
          })
          .catch((error) => {
            console.error('Query Error:', error);
            throw error;
          });
        if (!user || !user?.hashed_password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashed_password);

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
