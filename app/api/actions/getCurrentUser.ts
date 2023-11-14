import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';

export async function getSession() {
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
