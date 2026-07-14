import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
