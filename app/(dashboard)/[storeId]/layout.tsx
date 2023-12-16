import getCurrentUser from '@/app/actions/getCurrentUser';
import Navbar from '@/components/ui/organism/navbar/navbar';
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

  // confirm again
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, user_id: currentUser.username },
  });

  // if the store not exist redirect
  if (!store) {
    redirect('/');
  }

  // if exist
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
