import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prismadb';
import bcrypt from 'bcrypt';
import { signInSchema } from '@/lib/definitions';

export const authProviders = [
  Credentials({
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

    async authorize(credentials, request) {
      const parsedCredentials = signInSchema.safeParse(credentials);

      // if empty credentials is accepted
      if (!credentials || !credentials.username || !credentials.password || !parsedCredentials.success) {
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
        //return null;
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
];
