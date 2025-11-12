import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";

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
    <html lang="he" dir="rtl">
      <body className="antialiased">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
