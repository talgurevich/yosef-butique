'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminFetch } from '@/lib/admin-api';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [gradientFrom, setGradientFrom] = useState('#3b82f6');
  const [gradientTo, setGradientTo] = useState('#8b5cf6');
  const [textColor, setTextColor] = useState('#ffffff');

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data } = await adminFetch('banner', { params: { order_by: 'created_at' } });

      if (data && data.length > 0) {
        // Use the first banner record
        const b = data[0];
        setBannerId(b.id);
        setMessage(b.message || '');
        setIsActive(b.is_active);
        setGradientFrom(b.gradient_from || '#3b82f6');
        setGradientTo(b.gradient_to || '#8b5cf6');
        setTextColor(b.text_color || '#ffffff');
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const bannerData = {
        message,
        is_active: isActive,
        gradient_from: gradientFrom,
        gradient_to: gradientTo,
        text_color: textColor,
        updated_at: new Date().toISOString(),
      };

      if (bannerId) {
        await adminFetch('banner', {
          method: 'PUT',
          data: { id: bannerId, ...bannerData },
        });
      } else {
        const { data } = await adminFetch('banner', {
          method: 'POST',
          data: bannerData,
        });
        if (data && Array.isArray(data) && data.length > 0) {
          setBannerId(data[0].id);
        }
      }

      alert('הבאנר נשמר בהצלחה!');
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert('שגיאה בשמירה: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ניהול באנר עליון</h1>
        <p className="text-gray-600 mt-2">הבאנר מופיע בראש האתר מעל התפריט</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 font-semibold block">סטטוס</span>
              <span className="text-sm text-gray-500">
                {isActive ? (
                  <span className="flex items-center gap-1 text-green-600"><FaEye /> מוצג באתר</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500"><FaEyeSlash /> מוסתר</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200 ${
                  isActive ? 'left-1' : 'left-7'
                }`}
              />
            </button>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">הודעה</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="הכניסו את הודעת הבאנר..."
            />
          </div>

          {/* Gradient Presets */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">צבעי רקע</label>
            <div className="grid grid-cols-3 gap-3">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => { setGradientFrom(preset.from); setGradientTo(preset.to); }}
                  className="h-12 rounded-lg border-2 border-gray-200 hover:border-primary-500 transition-colors"
                  style={{ background: `linear-gradient(to right, ${preset.from}, ${preset.to})` }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">צבע התחלה</label>
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) => setGradientFrom(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">צבע סיום</label>
              <input
                type="color"
                value={gradientTo}
                onChange={(e) => setGradientTo(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">צבע טקסט</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !message.trim()}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">תצוגה מקדימה</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {message.trim() ? (
              <div
                className="relative w-full py-3 px-4 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                  color: textColor,
                }}
              >
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium">{message}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                הכניסו הודעה כדי לראות תצוגה מקדימה
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">טיפים</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>הבאנר מופיע בראש האתר מעל התפריט</li>
              <li>משתמשים יכולים לסגור אותו בלחיצה על X</li>
              <li>עדכון ההודעה יציג מחדש את הבאנר גם למי שסגר</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
