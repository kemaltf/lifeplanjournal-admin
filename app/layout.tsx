import { ModalProvider } from '@/providers/modal-provider';
import './globals.css';
import { Inter } from 'next/font/google';
import getCurrentUser from './api/actions/getCurrentUser';

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
        <ModalProvider />
        {children}
      </body>
    </html>
  );
}
