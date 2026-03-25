'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaUpload, FaTrash, FaImage, FaStar, FaGripVertical } from 'react-icons/fa';
import { supabase, ProductImage, Color } from '@/lib/supabase';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';

type ProductImageUploadProps = {
  productId: string | null;
  existingImages?: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
  colors?: Color[];
};

type Bucket = {
  id: string;
  name: string;
  hex_code?: string;
  images: ProductImage[];
};

function DraggableImageCard({
  image,
  isPrimary,
  onDelete,
  onSetPrimary,
}: {
  image: ProductImage;
  isPrimary: boolean;
  onDelete: (image: ProductImage) => void;
  onSetPrimary: (image: ProductImage) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: image.id,
    data: { image },
  });

  const style: React.CSSProperties = {
    ...(transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {}),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border-2 rounded-lg overflow-hidden transition-all ${
        isPrimary ? 'border-terracotta shadow-md' : 'border-gray-200 hover:border-primary-400'
      } ${isDragging ? 'z-50' : ''}`}
    >
      {/* Primary Badge */}
      {isPrimary && (
        <div className="absolute top-2 right-2 bg-terracotta text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10 shadow-lg">
          <FaStar />
          תמונה ראשית
        </div>
      )}

      {/* Drag handle + Image */}
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing relative">
        <div className="absolute top-2 left-2 bg-black bg-opacity-40 text-white p-1.5 rounded z-10">
          <FaGripVertical className="text-xs" />
        </div>
        <img
          src={image.image_url}
          alt={image.alt_text || 'Product image'}
          className="w-full h-32 object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 p-2 flex gap-2">
        {!isPrimary && (
          <button
            onClick={() => onSetPrimary(image)}
            className="flex-1 bg-terracotta bg-opacity-10 text-terracotta px-3 py-2 rounded-lg hover:bg-terracotta hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-1"
            title="הגדר כתמונה ראשית"
          >
            <FaStar className="text-xs" />
            הגדר כראשית
          </button>
        )}
        {isPrimary && (
          <div className="flex-1 bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 cursor-not-allowed">
            <FaStar className="text-xs" />
            תמונה ראשית
          </div>
        )}
        <button
          onClick={() => onDelete(image)}
          className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
          title="מחק תמונה"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>
    </div>
  );
}

function ColorBucket({
  bucket,
  primaryImageId,
  onDelete,
  onSetPrimary,
}: {
  bucket: Bucket;
  primaryImageId: string | null;
  onDelete: (image: ProductImage) => void;
  onSetPrimary: (image: ProductImage) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: bucket.id });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 rounded-lg p-4 transition-colors ${
        isOver ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {/* Bucket Header */}
      <div className="flex items-center gap-2 mb-3">
        {bucket.hex_code ? (
          <span
            className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: bucket.hex_code }}
          />
        ) : (
          <span className="w-5 h-5 rounded-full border-2 border-dashed border-gray-400 flex-shrink-0" />
        )}
        <h4 className="font-semibold text-gray-700">{bucket.name}</h4>
        <span className="text-sm text-gray-400">({bucket.images.length})</span>
      </div>

      {/* Images Grid */}
      {bucket.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {bucket.images.map((image) => (
            <DraggableImageCard
              key={image.id}
              image={image}
              isPrimary={image.id === primaryImageId}
              onDelete={onDelete}
              onSetPrimary={onSetPrimary}
            />
          ))}
        </div>
      ) : (
        <div className={`min-h-[80px] flex items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'border-primary-400 text-primary-500' : 'border-gray-300 text-gray-400'
        }`}>
          <p className="text-sm">גרור תמונות לכאן</p>
        </div>
      )}
    </div>
  );
}

export default function ProductImageUpload({
  productId,
  existingImages = [],
  onImagesChange,
  colors = [],
}: ProductImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [activeImage, setActiveImage] = useState<ProductImage | null>(null);

  // Sync images when existingImages prop changes
  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  // dnd-kit sensors — require 8px movement to start drag (prevents accidental drags)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Group images into color buckets
  const buckets = useMemo<Bucket[]>(() => {
    const colorIds = new Set(colors.map(c => c.id));

    // General bucket: images with no color or orphaned color
    const general = images
      .filter(img => img.color_id === null || !colorIds.has(img.color_id))
      .sort((a, b) => a.sort_order - b.sort_order);

    // One bucket per assigned color
    const colorBuckets = colors.map(color => ({
      id: color.id,
      name: color.name,
      hex_code: color.hex_code,
      images: images
        .filter(img => img.color_id === color.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

    return [
      { id: 'general', name: 'כללי', hex_code: undefined, images: general },
      ...colorBuckets,
    ];
  }, [images, colors]);

  // Primary image = lowest sort_order across all images
  const primaryImageId = useMemo(() => {
    if (images.length === 0) return null;
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return sorted[0].id;
  }, [images]);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
  };

  // File drag-and-drop handlers (native HTML, for uploading files from desktop)
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId || uploading) return;
    setIsFileDragging(true);
  }, [productId, uploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragging(false);

    if (!productId || uploading) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('נא לגרור קבצי תמונה בלבד');
      return;
    }

    await uploadFiles(imageFiles);
  };

  const deleteImage = async (image: ProductImage) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return;

    try {
      const response = await fetch('/api/delete-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id, imageUrl: image.image_url }),
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
      const updates = images.map(async (img, index) => {
        const newSortOrder = img.id === image.id ? 0 : index + 1;

        const response = await fetch('/api/update-product-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: img.id, sortOrder: newSortOrder }),
        });

        const result = await response.json();
        if (!response.ok || result.error) {
          throw new Error(result.error || 'Failed to update image');
        }
      });

      await Promise.all(updates);

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

  const updateImageColor = async (image: ProductImage, colorId: string | null) => {
    try {
      const response = await fetch('/api/update-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: image.id, colorId }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to update image color');
      }

      const updatedImages = images.map((img) =>
        img.id === image.id ? { ...img, color_id: colorId } : img
      );
      setImages(updatedImages);
      if (onImagesChange) {
        onImagesChange(updatedImages);
      }
    } catch (error: any) {
      console.error('Error updating image color:', error);
      alert(`שגיאה בעדכון צבע התמונה: ${error.message}`);
    }
  };

  // dnd-kit handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedImage = images.find(img => img.id === active.id);
    setActiveImage(draggedImage || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveImage(null);

    if (!over) return;

    const draggedImage = images.find(img => img.id === active.id);
    if (!draggedImage) return;

    const targetBucketId = over.id as string;
    const currentBucketId = draggedImage.color_id || 'general';

    // Also check if dropped on an image — find that image's bucket
    const droppedOnImage = images.find(img => img.id === over.id);
    const resolvedBucketId = droppedOnImage
      ? (droppedOnImage.color_id || 'general')
      : targetBucketId;

    if (currentBucketId === resolvedBucketId) return;

    const newColorId = resolvedBucketId === 'general' ? null : resolvedBucketId;

    // Optimistic update
    const updatedImages = images.map(img =>
      img.id === draggedImage.id ? { ...img, color_id: newColorId } : img
    );
    setImages(updatedImages);
    if (onImagesChange) {
      onImagesChange(updatedImages);
    }

    // Persist to DB
    try {
      const response = await fetch('/api/update-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: draggedImage.id, colorId: newColorId }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        // Rollback on failure
        setImages(images);
        if (onImagesChange) {
          onImagesChange(images);
        }
        alert(`שגיאה בעדכון צבע התמונה: ${result.error}`);
      }
    } catch (error: any) {
      // Rollback on failure
      setImages(images);
      if (onImagesChange) {
        onImagesChange(images);
      }
      alert(`שגיאה בעדכון צבע התמונה: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area — native HTML drag-and-drop for file uploads */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isFileDragging
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-primary-600'
        } ${!productId || uploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          className={`cursor-pointer block ${!productId || uploading ? 'cursor-not-allowed' : ''}`}
        >
          <FaUpload className={`mx-auto text-4xl mb-4 ${isFileDragging ? 'text-primary-600' : 'text-gray-400'}`} />
          <p className="text-gray-700 font-semibold mb-2">
            {isFileDragging ? 'שחרר כדי להעלות' : 'לחץ להעלאת תמונות או גרור לכאן'}
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

      {/* Color Buckets with Drag-and-Drop */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            תמונות ({images.length})
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            גרור תמונות בין הצבעים כדי לשייך אותן. תמונות &quot;כללי&quot; יוצגו בכל בחירת צבע.
          </p>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-4">
              {buckets.map((bucket) => (
                <ColorBucket
                  key={bucket.id}
                  bucket={bucket}
                  primaryImageId={primaryImageId}
                  onDelete={deleteImage}
                  onSetPrimary={setPrimaryImage}
                />
              ))}
            </div>

            <DragOverlay>
              {activeImage ? (
                <div className="border-2 border-primary-500 rounded-lg overflow-hidden shadow-xl w-40 rotate-3">
                  <img
                    src={activeImage.image_url}
                    alt={activeImage.alt_text || 'Product image'}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
