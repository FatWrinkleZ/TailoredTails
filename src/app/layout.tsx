import { AuthContextProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TopBar } from '@/components/TopBar';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TailoredTails - Find Your Perfect Dog Match',
  description: 'Match with shelter dogs based on your lifestyle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider>
          <AuthContextProvider>
            <TopBar />
            {children}
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}