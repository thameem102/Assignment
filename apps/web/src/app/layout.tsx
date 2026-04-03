import type { Metadata } from 'next';
import { Syne, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import ConditionalNavbar from '@/components/ConditionalNavbar';

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MicroApp — Dynamic Form',
  description: 'Microservice fullstack application with dynamic form engine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          <ConditionalNavbar />
          <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
