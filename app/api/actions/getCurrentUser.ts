import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prismadb from '@/lib/prismadb';

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prismadb?.user.findUnique({
      where: {
        username: session.user.username as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (err: any) {
    return null;
  }
}
