/**
 * In server-side scenarios like Route Handlers,
 * React Server Components, API routes, or getServerSideProps,
 * prefer getServerSession over getSession for session retrieval.
 * This function is beneficial, especially when NextAuth.js
 * is integrated with a database, significantly improving
 * response times by avoiding unnecessary API Route calls.
 */
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';

/**
 * getSession fucntion is a helper, so we don't need to pass the
 * authOptions around when we call getServerSession.
 */
export async function getSession() {
  // we have to pass the authOptions to getServerSession
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    // take the session value
    const session = await getSession();
    if (!session?.user?.username) {
      return null;
    }

    // check if the user is exist in the database
    const currentUser = await prismadb?.user.findUnique({
      where: {
        username: session.user?.username,
      },
    });

    // if the user not exist
    if (!currentUser) {
      return null;
    }

    // if exist we return the user data
    return currentUser;
  } catch (err: any) {
    return null;
  }
}
