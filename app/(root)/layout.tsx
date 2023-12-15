import getCurrentUser from '@/app/actions/getCurrentUser';
import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  // check whether the user has already logged in
  // Check authorization
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  // if not authorize redirect
  if (!currentUser?.username) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      user_id: currentUser.username,
    },
  });
  console.log(store);
  // If store exist redirect to dashboard
  if (store) {
    redirect(`/${store.id}`);
  }

  // if store does not exist printout the register
  return <>{children}</>;
}
