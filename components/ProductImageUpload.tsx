'use client';

import { useState } from 'react';
import { FaUpload, FaTrash, FaImage, FaStar } from 'react-icons/fa';
import { supabase, ProductImage } from '@/lib/supabase';

type ProductImageUploadProps = {
  productId: string | null;
  existingImages?: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
};

export default function ProductImageUpload({
  productId,
  existingImages = [],
  onImagesChange,
}: ProductImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
  };

  const uploadFiles = async (files: File[]) => {
    if (!productId) {
      alert('נא לשמור את המוצר תחילה לפני העלאת תמונות');
      return;
    }

    setUploading(true);
    const newImages: ProductImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(((i + 1) / files.length) * 100);

        // Upload via API route (server-side with service role key)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId);
        formData.append('sortOrder', (images.length + newImages.length).toString());

        const response = await fetch('/api/upload-product-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          console.error('Upload error:', result.error);
          alert(`שגיאה בהעלאת ${file.name}: ${result.error}`);
          continue;
        }

        newImages.push(result.data);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      if (newImages.length > 0) {
        alert(`${newImages.length} תמונות הועלו בהצלחה!`);
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert(`שגיאה: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (image: ProductImage) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      // Delete via API route (server-side with service role key)
      const response = await fetch('/api/delete-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: image.id,
          imageUrl: image.image_url,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to delete image');
      }

      const updatedImages = images.filter((img) => img.id !== image.id);
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      alert('התמונה נמחקה בהצלחה');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      alert(`שגיאה במחיקת התמונה: ${error.message}`);
    }
  };

  const setPrimaryImage = async (image: ProductImage) => {
    try {
      // Update all images via API route: set the selected one to sort_order 0, others increment
      const updates = images.map(async (img, index) => {
        const newSortOrder = img.id === image.id ? 0 : index + 1;

        const response = await fetch('/api/update-product-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageId: img.id,
            sortOrder: newSortOrder,
          }),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          throw new Error(result.error || 'Failed to update image');
        }
      });

      await Promise.all(updates);

      // Re-sort local state
      const updatedImages = [...images].sort((a, b) =>
        a.id === image.id ? -1 : b.id === image.id ? 1 : 0
      );
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      alert('התמונה הראשית עודכנה');
    } catch (error: any) {
      console.error('Error setting primary image:', error);
      alert(`שגיאה: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-600 transition-colors">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={!productId || uploading}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${!productId || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-700 font-semibold mb-2">
            לחץ להעלאת תמונות או גרור לכאן
          </p>
          <p className="text-gray-500 text-sm">
            {productId
              ? 'תומך ב-JPG, PNG, GIF עד 5MB'
              : 'נא לשמור את המוצר תחילה'}
          </p>
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-800">מעלה תמונות...</span>
            <span className="text-sm text-blue-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Existing Images */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">
            תמונות ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-600 transition-all"
              >
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-terracotta text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10">
                    <FaStar />
                    ראשי
                  </div>
                )}

                {/* Image */}
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Product image'}
                  className="w-full h-40 object-cover"
                />

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {index !== 0 && (
                    <button
                      onClick={() => setPrimaryImage(image)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="הגדר כתמונה ראשית"
                    >
                      <FaStar />
                    </button>
                  )}
                  <button
                    onClick={() => deleteImage(image)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="מחק תמונה"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && productId && (
        <div className="text-center py-8 text-gray-500">
          <FaImage className="mx-auto text-4xl mb-2" />
          <p>טרם הועלו תמונות למוצר זה</p>
        </div>
      )}
    </div>
  );
}
