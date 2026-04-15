'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowUp, FaArrowDown, FaTimes, FaSave, FaImage } from 'react-icons/fa';
import { adminFetch } from '@/lib/admin-api';

interface HeroSlide {
  id: string;
  image_url: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  link: string;
  link_text: string;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
  accent_color: string;
  sort_order: number;
  is_active: boolean;
  promo_enabled: boolean;
  promo_text: string;
  promo_subtitle: string;
  promo_description: string;
  promo_disclaimer: string;
  promo_code: string;
}

const COLOR_PRESETS = [
  { name: 'זהוב', from: 'from-yellow-400', via: 'via-yellow-300', to: 'to-yellow-500', accent: 'text-yellow-400' },
  { name: 'ירוק', from: 'from-green-400', via: 'via-green-300', to: 'to-green-500', accent: 'text-green-400' },
  { name: 'כחול', from: 'from-blue-400', via: 'via-blue-300', to: 'to-blue-500', accent: 'text-blue-400' },
  { name: 'אדום', from: 'from-red-400', via: 'via-red-300', to: 'to-red-500', accent: 'text-red-400' },
  { name: 'סגול', from: 'from-purple-400', via: 'via-purple-300', to: 'to-purple-500', accent: 'text-purple-400' },
];

const emptyForm = {
  image_url: '',
  badge: '',
  title: '',
  subtitle: '',
  description: '',
  highlight: '',
  link: '',
  link_text: '',
  gradient_from: 'from-yellow-400',
  gradient_via: 'via-yellow-300',
  gradient_to: 'to-yellow-500',
  accent_color: 'text-yellow-400',
  sort_order: 0,
  is_active: true,
  promo_enabled: false,
  promo_text: '',
  promo_subtitle: '',
  promo_description: '',
  promo_disclaimer: '',
  promo_code: '',
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data } = await adminFetch('hero_slides', {
        params: { order_by: 'sort_order' },
      });
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      alert('שגיאה בטעינת השקופיות');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[number]) => {
    setFormData((prev) => ({
      ...prev,
      gradient_from: preset.from,
      gradient_via: preset.via,
      gradient_to: preset.to,
      accent_color: preset.accent,
    }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSlide(null);
    setFormData(emptyForm);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      image_url: slide.image_url || '',
      badge: slide.badge || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      highlight: slide.highlight || '',
      link: slide.link || '',
      link_text: slide.link_text || '',
      gradient_from: slide.gradient_from || 'from-yellow-400',
      gradient_via: slide.gradient_via || 'via-yellow-300',
      gradient_to: slide.gradient_to || 'to-yellow-500',
      accent_color: slide.accent_color || 'text-yellow-400',
      sort_order: slide.sort_order ?? 0,
      is_active: slide.is_active ?? true,
      promo_enabled: slide.promo_enabled ?? false,
      promo_text: slide.promo_text || '',
      promo_subtitle: slide.promo_subtitle || '',
      promo_description: slide.promo_description || '',
      promo_disclaimer: slide.promo_disclaimer || '',
      promo_code: slide.promo_code || '',
    });
    setPreviewUrl(slide.image_url || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSlide && !selectedFile && !formData.image_url) {
      alert('אנא בחר תמונה');
      return;
    }

    if (!formData.title.trim()) {
      alert('אנא הזן כותרת');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        uploadFormData.append('folder', 'hero');

        const uploadRes = await fetch('/api/upload-gallery-image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || 'Upload failed');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const slideData = {
        image_url: imageUrl,
        badge: formData.badge || null,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        highlight: formData.highlight || null,
        link: formData.link || null,
        link_text: formData.link_text || null,
        gradient_from: formData.gradient_from,
        gradient_via: formData.gradient_via,
        gradient_to: formData.gradient_to,
        accent_color: formData.accent_color,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
        promo_enabled: formData.promo_enabled,
        promo_text: formData.promo_text || null,
        promo_subtitle: formData.promo_subtitle || null,
        promo_description: formData.promo_description || null,
        promo_disclaimer: formData.promo_disclaimer || null,
        promo_code: formData.promo_code || null,
      };

      if (editingSlide) {
        await adminFetch('hero_slides', {
          method: 'PUT',
          data: { id: editingSlide.id, ...slideData },
        });
        alert('השקופית עודכנה בהצלחה');
      } else {
        await adminFetch('hero_slides', {
          method: 'POST',
          data: slideData,
        });
        alert('השקופית נוספה בהצלחה');
      }

      resetForm();
      fetchSlides();
    } catch (error: any) {
      console.error('Error saving slide:', error);
      alert('שגיאה בשמירת השקופית: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק שקופית זו?')) return;

    try {
      await adminFetch('hero_slides', {
        method: 'DELETE',
        params: { id },
      });
      setSlides(slides.filter((s) => s.id !== id));
      alert('השקופית נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('שגיאה במחיקת השקופית');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await adminFetch('hero_slides', {
        method: 'PUT',
        data: { id: slide.id, is_active: !slide.is_active },
      });
      setSlides(
        slides.map((s) =>
          s.id === slide.id ? { ...s, is_active: !s.is_active } : s
        )
      );
    } catch (error) {
      console.error('Error toggling active:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= slides.length) return;

    const current = slides[index];
    const other = slides[swapIndex];

    try {
      await adminFetch('hero_slides', {
        method: 'PUT',
        data: { id: current.id, sort_order: other.sort_order },
      });
      await adminFetch('hero_slides', {
        method: 'PUT',
        data: { id: other.id, sort_order: current.sort_order },
      });

      const updated = [...slides];
      updated[index] = { ...current, sort_order: other.sort_order };
      updated[swapIndex] = { ...other, sort_order: current.sort_order };
      updated.sort((a, b) => a.sort_order - b.sort_order);
      setSlides(updated);
    } catch (error) {
      console.error('Error reordering slides:', error);
      alert('שגיאה בשינוי הסדר');
    }
  };

  const currentPreset = COLOR_PRESETS.find(
    (p) =>
      p.from === formData.gradient_from &&
      p.via === formData.gradient_via &&
      p.to === formData.gradient_to
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול באנר ראשי</h1>
          <p className="text-gray-600 mt-2">
            נהל את התמונות והטקסטים המתחלפים בראש העמוד הראשי
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setFormData((prev) => ({
              ...prev,
              sort_order: slides.length > 0 ? Math.max(...slides.map((s) => s.sort_order)) + 1 : 1,
            }));
            setShowForm(true);
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          הוסף שקופית חדשה
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editingSlide ? 'עריכת שקופית' : 'שקופית חדשה'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תמונה *
              </label>
              <div className="flex items-start gap-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-[200px] h-auto rounded-lg object-cover border"
                  />
                )}
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <FaImage className="text-gray-400" />
                    <span className="text-gray-600">
                      {selectedFile ? selectedFile.name : 'בחר תמונה להעלאה'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Text Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תג (badge)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="למשל: חדש, מבצע"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  placeholder="כותרת ראשית"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כותרת משנית</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="כותרת משנית"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">מילה מודגשת</label>
                <input
                  type="text"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="מילה שתודגש בצבע"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="טקסט תיאור"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">קישור (URL)</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="/products או כתובת מלאה"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טקסט כפתור</label>
                <input
                  type="text"
                  value={formData.link_text}
                  onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="למשל: לצפייה בקולקציה"
                />
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ערכת צבעים</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleColorPreset(preset)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                      currentPreset?.name === preset.name
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full ml-2 bg-gradient-to-l ${preset.from} ${preset.via} ${preset.to}`}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order & Active */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">סדר תצוגה</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  פעיל
                </label>
              </div>
            </div>

            {/* Promo Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="promo_enabled"
                  checked={formData.promo_enabled}
                  onChange={(e) => setFormData({ ...formData, promo_enabled: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="promo_enabled" className="text-lg font-semibold text-gray-800">
                  הצג מבצע על הבאנר
                </label>
              </div>

              {formData.promo_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">טקסט גדול (למשל: 10%)</label>
                    <input
                      type="text"
                      value={formData.promo_text}
                      onChange={(e) => setFormData({ ...formData, promo_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="10%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">כותרת משנה (למשל: הנחה)</label>
                    <input
                      type="text"
                      value={formData.promo_subtitle}
                      onChange={(e) => setFormData({ ...formData, promo_subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="הנחה"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                    <input
                      type="text"
                      value={formData.promo_description}
                      onChange={(e) => setFormData({ ...formData, promo_description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="על כל המוצרים באתר"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">קוד הנחה</label>
                    <input
                      type="text"
                      value={formData.promo_code}
                      onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="SAVE10"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">כיתוב קטן / תנאים</label>
                    <input
                      type="text"
                      value={formData.promo_disclaimer}
                      onChange={(e) => setFormData({ ...formData, promo_disclaimer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="ההנחה לזמן מוגבל וניתנה להפסיק בכל עת | ט.ל.ח"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                <FaSave />
                {uploading ? 'שומר...' : editingSlide ? 'עדכן שקופית' : 'הוסף שקופית'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-500">טוען שקופיות...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaImage size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">אין שקופיות עדיין</p>
            <p className="text-sm mt-1">לחץ על &quot;הוסף שקופית חדשה&quot; כדי להתחיל</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  slide.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-[200px] h-[112px] object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-[200px] h-[112px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaImage className="text-gray-300" size={32} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                  )}
                  {slide.badge && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      {slide.badge}
                    </span>
                  )}
                </div>

                {/* Sort Order */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="הזז למעלה"
                  >
                    <FaArrowUp />
                  </button>
                  <span className="text-sm font-mono text-gray-500">{slide.sort_order}</span>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="הזז למטה"
                  >
                    <FaArrowDown />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.is_active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={slide.is_active ? 'פעיל - לחץ לכיבוי' : 'לא פעיל - לחץ להפעלה'}
                  >
                    {slide.is_active ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ערוך"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
