'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/inventory');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/admin/inventory' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            שטיחי בוטיק יוסף
          </h1>
          <p className="text-gray-600">לוח בקרה למנהל</p>
        </div>

        {/* Login Card */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              התחברות
            </h2>
            <p className="text-gray-600 text-sm">
              התחבר עם חשבון Google שלך כדי לגשת למערכת הניהול
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            <FaGoogle className="text-xl text-red-500" />
            <span>המשך עם Google</span>
          </button>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              🔒 אזור זה מיועד למנהלי המערכת בלבד
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← חזרה לאתר
          </a>
        </div>
      </div>
    </div>
  );
}
