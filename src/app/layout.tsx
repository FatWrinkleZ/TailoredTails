import { AuthContextProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider'; //Andres: added ThemeProvider
import { Inter } from 'next/font/google';
import './globals.css';

// Load the Inter font with 'latin' subset
const inter = Inter({ subsets: ['latin'] });

// Metadata for the application
export const metadata = {
  title: 'Next.js + Firebase Starter',
  description: 'Template to use Next.js with Firebase',
};

// Root layout component for the application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
