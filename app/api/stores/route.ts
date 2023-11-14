import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import getCurrentUser from '@/app/api/actions/getCurrentUser';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.username) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

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
