'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { supabase, GalleryImage, Product } from '@/lib/supabase';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    testimonial: '',
    product_id: '',
    is_featured: false,
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchImages();
    fetchProducts();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_gallery')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('שגיאה בטעינת התמונות');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingImage && !selectedFile) {
      alert('אנא בחר תמונה');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingImage?.image_url || '';

      // Upload new image if selected
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedFile);
        formDataUpload.append('folder', 'gallery');

        const uploadRes = await fetch('/api/upload-gallery-image', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || 'Upload failed');
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (editingImage) {
        // Update existing image
        const { error } = await supabase
          .from('customer_gallery')
          .update({
            customer_name: formData.customer_name || null,
            testimonial: formData.testimonial || null,
            product_id: formData.product_id || null,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
            image_url: imageUrl,
          })
          .eq('id', editingImage.id);

        if (error) throw error;
        alert('התמונה עודכנה בהצלחה');
      } else {
        // Insert new image
        const { error } = await supabase.from('customer_gallery').insert([
          {
            image_url: imageUrl,
            customer_name: formData.customer_name || null,
            testimonial: formData.testimonial || null,
            product_id: formData.product_id || null,
            is_featured: formData.is_featured,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        alert('התמונה נוספה בהצלחה');
      }

      resetForm();
      fetchImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      alert('שגיאה בשמירת התמונה: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      customer_name: image.customer_name || '',
      testimonial: image.testimonial || '',
      product_id: image.product_id || '',
      is_featured: image.is_featured,
      is_active: image.is_active,
    });
    setPreviewUrl(image.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('customer_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // TODO: Delete from storage
      // You may want to call an API route to delete the image from storage

      setImages(images.filter((img) => img.id !== id));
      alert('התמונה נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('שגיאה במחיקת התמונה');
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_gallery')
        .update({ is_featured: !currentValue })
        .eq('id', id);

      if (error) throw error;

      setImages(
        images.map((img) =>
          img.id === id ? { ...img, is_featured: !currentValue } : img
        )
      );
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_gallery')
        .update({ is_active: !currentValue })
        .eq('id', id);

      if (error) throw error;

      setImages(
        images.map((img) =>
          img.id === id ? { ...img, is_active: !currentValue } : img
        )
      );
    } catch (error) {
      console.error('Error toggling active:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({
      customer_name: '',
      testimonial: '',
      product_id: '',
      is_featured: false,
      is_active: true,
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">גלריית לקוחות</h1>
          <p className="text-gray-600 mt-2">
            סך הכל {images.length} תמונות בגלריה
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          הוסף תמונה
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">טוען תמונות...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="p-12 text-center">
            <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-4">אין תמונות בגלריה</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              הוסף תמונה ראשונה
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.image_url}
                    alt={image.customer_name || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleEdit(image)}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                      title="ערוך"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => toggleFeatured(image.id, image.is_featured)}
                      className={`p-3 rounded-lg transition-colors ${
                        image.is_featured
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                      title={image.is_featured ? 'הסר מבולטים' : 'סמן כבולט'}
                    >
                      <FaStar />
                    </button>
                    <button
                      onClick={() => toggleActive(image.id, image.is_active)}
                      className={`p-3 rounded-lg transition-colors ${
                        image.is_active
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                      title={image.is_active ? 'הסתר' : 'הצג'}
                    >
                      {image.is_active ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => handleDelete(image.id, image.image_url)}
                      className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
                      title="מחק"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {image.is_featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        <FaStar className="inline" /> מומלץ
                      </span>
                    )}
                    {!image.is_active && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        מוסתר
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  {image.customer_name && (
                    <p className="font-semibold text-gray-800 mb-1">
                      {image.customer_name}
                    </p>
                  )}
                  {image.testimonial && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {image.testimonial}
                    </p>
                  )}
                  {image.product_id && (
                    <p className="text-xs text-primary-600">
                      קשור למוצר
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingImage ? 'ערוך תמונה' : 'הוסף תמונה חדשה'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    תמונה {!editingImage && '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    שם הלקוח
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="לדוגמה: יוסי כהן"
                  />
                </div>

                {/* Testimonial */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    המלצה / תגובה
                  </label>
                  <textarea
                    value={formData.testimonial}
                    onChange={(e) =>
                      setFormData({ ...formData, testimonial: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="לדוגמה: שטיח מעולה, איכות מעולה!"
                  />
                </div>

                {/* Product Association */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    קשור למוצר
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData({ ...formData, product_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">ללא קישור למוצר</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="text-gray-700">סמן כתמונה מומלצת</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="text-gray-700">פעיל (מוצג באתר)</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'שומר...' : editingImage ? 'עדכן' : 'הוסף'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={uploading}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
