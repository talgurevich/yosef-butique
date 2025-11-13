'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowRight, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

interface BannerData {
  id: string;
  message: string;
  is_active: boolean;
  gradient_from: string;
  gradient_to: string;
  text_color: string;
}

const GRADIENT_PRESETS = [
  { name: 'כחול סגול', from: '#3b82f6', to: '#8b5cf6' },
  { name: 'ירוק כחול', from: '#10b981', to: '#3b82f6' },
  { name: 'ורוד אדום', from: '#ec4899', to: '#ef4444' },
  { name: 'כתום צהוב', from: '#f59e0b', to: '#eab308' },
  { name: 'סגול ורוד', from: '#8b5cf6', to: '#ec4899' },
  { name: 'אפור כהה', from: '#374151', to: '#111827' },
];

export default function AdminBannerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<BannerData>({
    id: '',
    message: '',
    is_active: false,
    gradient_from: '#3b82f6',
    gradient_to: '#8b5cf6',
    text_color: '#ffffff',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchBanner();
    }
  }, [status, router]);

  const fetchBanner = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('banner')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.log('No banner found, will create new one');
        setLoading(false);
        return;
      }

      if (data) {
        setBanner(data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching banner:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!supabase) {
        alert('שגיאה בשמירה');
        setSaving(false);
        return;
      }

      if (banner.id) {
        // Update existing banner
        const { error } = await supabase
          .from('banner')
          .update({
            message: banner.message,
            is_active: banner.is_active,
            gradient_from: banner.gradient_from,
            gradient_to: banner.gradient_to,
            text_color: banner.text_color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', banner.id);

        if (error) throw error;
      } else {
        // Create new banner
        const { data, error } = await supabase
          .from('banner')
          .insert({
            message: banner.message,
            is_active: banner.is_active,
            gradient_from: banner.gradient_from,
            gradient_to: banner.gradient_to,
            text_color: banner.text_color,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setBanner(data);
      }

      alert('✅ הבאנר נשמר בהצלחה!');
      setSaving(false);
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert('❌ שגיאה בשמירה: ' + error.message);
      setSaving(false);
    }
  };

  const applyGradientPreset = (preset: { from: string; to: string }) => {
    setBanner({
      ...banner,
      gradient_from: preset.from,
      gradient_to: preset.to,
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowRight />
              חזרה
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">ניהול באנר</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">הגדרות באנר</h2>

            {/* Active Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700 font-semibold">סטטוס באנר</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={banner.is_active}
                    onChange={(e) => setBanner({ ...banner, is_active: e.target.checked })}
                    className="sr-only"
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition-colors ${
                      banner.is_active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute right-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                        banner.is_active ? 'translate-x-6' : ''
                      }`}
                    ></div>
                  </div>
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {banner.is_active ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <FaEye /> הבאנר מוצג באתר
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-gray-600">
                    <FaEyeSlash /> הבאנר מוסתר
                  </span>
                )}
              </p>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                הודעה
              </label>
              <textarea
                value={banner.message}
                onChange={(e) => setBanner({ ...banner, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="הכניסו את הודעת הבאנר..."
              />
            </div>

            {/* Gradient Presets */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                צבעי גרדיאנט מוכנים
              </label>
              <div className="grid grid-cols-3 gap-3">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyGradientPreset(preset)}
                    className="h-12 rounded-lg border-2 border-gray-200 hover:border-primary-500 transition-colors"
                    style={{
                      background: `linear-gradient(to right, ${preset.from}, ${preset.to})`,
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Gradient Colors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  צבע התחלה
                </label>
                <input
                  type="color"
                  value={banner.gradient_from}
                  onChange={(e) => setBanner({ ...banner, gradient_from: e.target.value })}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={banner.gradient_from}
                  onChange={(e) => setBanner({ ...banner, gradient_from: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  צבע סיום
                </label>
                <input
                  type="color"
                  value={banner.gradient_to}
                  onChange={(e) => setBanner({ ...banner, gradient_to: e.target.value })}
                  className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={banner.gradient_to}
                  onChange={(e) => setBanner({ ...banner, gradient_to: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                צבע טקסט
              </label>
              <input
                type="color"
                value={banner.text_color}
                onChange={(e) => setBanner({ ...banner, text_color: e.target.value })}
                className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={banner.text_color}
                onChange={(e) => setBanner({ ...banner, text_color: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !banner.message}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {saving ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">תצוגה מקדימה</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-4 text-center">
                כך הבאנר ייראה באתר:
              </p>

              {banner.message ? (
                <div
                  className="relative w-full py-3 px-4 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${banner.gradient_from}, ${banner.gradient_to})`,
                    color: banner.text_color,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-sm md:text-base font-medium">
                        {banner.message}
                      </p>
                    </div>
                    <button
                      className="flex-shrink-0 p-1 hover:opacity-80 transition-opacity"
                      aria-label="סגור באנר"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  הכניסו הודעה כדי לראות תצוגה מקדימה
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 טיפים</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• הבאנר יופיע בראש האתר מעל ההדר</li>
                <li>• משתמשים יכולים לסגור את הבאנר בלחיצה על X</li>
                <li>• הבאנר יוסתר עד שתשנה את התוכן או המזהה</li>
                <li>• השתמש באימוג׳י להודעות מושכות יותר 🎉</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
