import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import { RootLayoutContent } from '@/components/root-layout-content'
import { ReduxProvider } from '@/providers/ReduxProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial']
});

const kanit = Kanit({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'Anumaan',
  description: 'Market predictions platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kanit.variable}`}>
      <ReduxProvider>
        <RootLayoutContent className={`${inter.className} antialiased`}>
          {children}
        </RootLayoutContent>
      </ReduxProvider>
    </html>
  );
}
