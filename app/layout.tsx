import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import StructuredData from "@/components/StructuredData";
import { Alef, Rubik } from 'next/font/google';

const alef = Alef({
  subsets: ['hebrew'],
  weight: ['400', '700'],
  variable: '--font-alef',
});

const rubik = Rubik({
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yossef-boutique.co.il'),
  title: {
    default: "שטיחי בוטיק יוסף | שטיחים איכותיים לבית",
    template: "%s | שטיחי בוטיק יוסף",
  },
  description: "שטיחים איכותיים לכל בית - מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים. משלוח מהיר לכל הארץ, החזרות בחינם תוך 14 יום",
  keywords: ["שטיחים", "שטיחי בוטיק", "שטיחים מעוצבים", "שטיחים מודרניים", "שטיחים לסלון", "שטיחים לחדר שינה", "עציצים", "צמחי בית"],
  authors: [{ name: "יוסף בוטיק" }],
  creator: "יוסף בוטיק",
  publisher: "יוסף בוטיק",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://yossef-boutique.co.il',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://yossef-boutique.co.il',
    siteName: 'שטיחי בוטיק יוסף',
    title: 'שטיחי בוטיק יוסף | שטיחים איכותיים לבית',
    description: 'שטיחים איכותיים לכל בית - מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים. משלוח מהיר לכל הארץ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'שטיחי בוטיק יוסף',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שטיחי בוטיק יוסף | שטיחים איכותיים לבית',
    description: 'שטיחים איכותיים לכל בית - מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${alef.variable} ${rubik.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="antialiased font-body">
        <AuthSessionProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
