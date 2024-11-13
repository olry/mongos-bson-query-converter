import { TITLE } from '@/constants';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: TITLE,
  description:
    'Convert mongo shell queries to BSON structs for mongo-go-driver usage in Golang, and vice versa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased heropattern-circuitboard-neutral-400/10 dark:heropattern-circuitboard-neutral-700/10 transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <GoogleAnalytics gaId="G-08T4H0TVCX" />
      </body>
    </html>
  );
}
