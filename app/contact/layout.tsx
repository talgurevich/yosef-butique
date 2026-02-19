import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'צור קשר',
  description: 'צרו קשר עם שטיחי בוטיק יוסף. טלפון: 051-509-2208, WhatsApp, אימייל. כתובת: השקד משק 47, מושב בית עזרא. זמינים בימים א-ה 9:00-18:00.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'צור קשר | שטיחי בוטיק יוסף',
    description: 'צרו קשר עם שטיחי בוטיק יוסף. טלפון: 051-509-2208. כתובת: השקד משק 47, מושב בית עזרא.',
    type: 'website',
    locale: 'he_IL',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
