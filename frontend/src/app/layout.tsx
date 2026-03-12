import type { Metadata } from 'next';
import { Inter, Tajawal, Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800', '900'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Dmagni (دمجني) — AI Virtual Try-On',
  description:
    'Experience the future of fashion. Upload your photo and a garment to see a realistic virtual try-on powered by AI.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${tajawal.variable} ${cairo.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
