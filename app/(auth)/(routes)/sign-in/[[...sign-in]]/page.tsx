import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/ui/organism/loginForm/loginForm';
import getCurrentUser from '@/app/actions/getCurrentUser';

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  // if not authorize redirect
  if (currentUser?.username) {
    redirect('/');
  }

  return (
    <>
      <LoginForm />
    </>
  );
}
