import { ClerkProvider } from '@clerk/nextjs';
import { Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fillyfy — Never wonder what a form is asking again',
  description: 'AI-powered Chrome extension that explains confusing form fields. Click any field and instantly understand what to enter, common mistakes, and what documents you need.',
  openGraph: {
    title: 'Fillyfy — Never wonder what a form is asking again',
    description: 'AI-powered Chrome extension that explains confusing form fields. Click any field and instantly understand what to enter, common mistakes, and what documents you need.',
    url: 'https://fillyfy.com',
    siteName: 'Fillyfy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fillyfy — Never wonder what a form is asking again',
    description: 'AI-powered Chrome extension that explains confusing form fields.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${instrumentSerif.variable} ${plusJakartaSans.variable}`}>
        <body className="font-body bg-white text-[#0F172A] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
