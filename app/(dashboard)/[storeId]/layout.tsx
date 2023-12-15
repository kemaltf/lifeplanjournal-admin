import getCurrentUser from '@/app/actions/getCurrentUser';
import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: { storeId: string } }) {
  // check whether the user has already logged in
  // Check authorization
  const currentUser = await getCurrentUser();

  // if not authorize response 401
  if (!currentUser?.username) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, user_id: currentUser.username },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <div>This will be a navbar</div>
      {children}
    </>
  );
}
