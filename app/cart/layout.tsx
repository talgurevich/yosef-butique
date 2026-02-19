import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'סל קניות',
  description: 'סל הקניות שלך בשטיחי בוטיק יוסף',
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
