import getCurrentUser from '@/app/actions/getCurrentUser';
import { SettingForm } from '@/components/ui/organism/settingsForm/settings-forms';
import prismadb from '@/lib/prismadb';
import { redirect } from 'next/navigation';

interface SettingPageProps {
  params: {
    storeId: string;
  };
}

const SettingPage: React.FC<SettingPageProps> = async ({ params }) => {
  const currentUser = await getCurrentUser();

  // if not authorize redirect
  if (!currentUser?.username) {
    redirect('/');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      user_id: currentUser.username,
    },
  });

  //  if the store not correct we need  to redirect  back to the root  page to protect this page
  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store}></SettingForm>
      </div>
    </div>
  );
};

export default SettingPage;
