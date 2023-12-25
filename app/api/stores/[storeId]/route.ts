import getCurrentUser from '@/app/actions/getCurrentUser';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Check authorization
    const currentUser = await getCurrentUser();

    // if not authorize response 401
    if (!currentUser?.username) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
        user_id: currentUser.username,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// dont remove the first params (req) because it will make error when we deleting the second params
export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Check authorization
    const currentUser = await getCurrentUser();

    // if not authorize response 401
    if (!currentUser?.username) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await prismadb.store.delete({
      where: {
        id: params.storeId,
        user_id: currentUser.username,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
