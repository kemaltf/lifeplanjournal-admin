import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prismadb from '@/lib/prismadb';

/**
 * Function to create store
 * @param req
 * @returns
 */
export async function POST(req: Request) {
  try {
    // Check authorization
    const currentUser = await getCurrentUser();

    // if not authorize response 401
    if (!currentUser?.username) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // take the request body
    const { name } = await req.json();

    // **TODO** bagian name di validasi lagi sama ZOD di sisi server

    // if there is no name, return name is required
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // create store
    const store = await prismadb.store.create({
      data: {
        name,
        user_id: currentUser.username,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
