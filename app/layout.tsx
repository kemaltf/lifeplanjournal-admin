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
  const currentUser = await getCurrentUser();
  console.log('-', currentUser);
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider />
        {children}
      </body>
    </html>
  );
}
