import { redirect } from 'next/navigation';
import StoreSwitcher from '../../molecules/store-switcher';
import { UserNav } from '../../molecules/user-nav';
import { MainNav } from './main-nav';
import prismadb from '@/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export default async function Navbar() {
  const currentUser = await getCurrentUser();

  // if not authorize redirect
  if (!currentUser?.username) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      user_id: currentUser.username,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6"></MainNav>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
