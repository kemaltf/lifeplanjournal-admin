import { Inter } from 'next/font/google';
// Toaster is main function is to provide quick feedback
// to users about success, errors, or other important information.
import { ToasterProvider } from '@/providers/toast-provider';

// To make getting session of the user faster we get the current user in Layout component
import getCurrentUser from './actions/getCurrentUser';
import { ModalProvider } from '@/providers/modal-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Life Plan Journal Admin Dashboard',
  description: 'Life Plan Journal Admin Dashboard',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // get the current user
  // this is usefull when we want to see current user inside the navbar
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <ModalProvider />
        {children}
      </body>
    </html>
  );
}
