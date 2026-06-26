import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fillyfy — Know exactly what to fill',
  description: 'AI-powered form field explanations. Understand any form field before you fill it.',
  openGraph: {
    title: 'Fillyfy — Know exactly what to fill',
    description: 'AI-powered form field explanations. Understand any form field before you fill it.',
    url: 'https://fillyfy.com',
    siteName: 'Fillyfy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fillyfy — Know exactly what to fill',
    description: 'AI-powered form field explanations.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
