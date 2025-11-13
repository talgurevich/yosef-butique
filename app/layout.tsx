import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
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
  title: "שטיחי בוטיק יוסף | Boutique Joseph Carpets",
  description: "שטיחים איכותיים לכל בית - מבחר רחב של שטיחים מודרניים, קלאסיים ומעוצבים",
  keywords: "שטיחים, שטיחי בוטיק, שטיחים מעוצבים, שטיחים מודרניים, שטיחי יוסף",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${alef.variable} ${rubik.variable}`}>
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
