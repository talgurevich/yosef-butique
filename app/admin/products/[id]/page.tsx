'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowRight, FaPlus, FaTrash, FaChevronDown } from 'react-icons/fa';
import { Product, ProductVariant, Category, ProductImage, Color, Shape, Space, ProductType, PlantType, PlantSize } from '@/lib/supabase';
import { adminFetch } from '@/lib/admin-api';
import { normalizeSize } from '@/lib/sizeNormalize';
import ProductImageUpload from '@/components/ProductImageUpload';
import SizeCombobox from '@/components/admin/SizeCombobox';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>('');

  // Plant dimensions
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>([]);
  const [plantSizes, setPlantSizes] = useState<PlantSize[]>([]);
  const [selectedPlantSizes, setSelectedPlantSizes] = useState<string[]>([]);
  const [existingSizes, setExistingSizes] = useState<string[]>([]);
  const [collapsedColors, setCollapsedColors] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    is_featured: false,
    is_active: true,
    has_variants: false,
  });

  useEffect(() => {
    fetchProductTypes();
    fetchProduct();
    fetchVariants();
    fetchCategories();
    fetchProductCategories();
    fetchColors();
    fetchShapes();
    fetchSpaces();
    fetchProductColors();
    fetchProductShapes();
    fetchProductSpaces();
    fetchPlantTypes();
    fetchPlantSizes();
    fetchProductPlantTypes();
    fetchProductPlantSizes();
    fetchProductImages();
    fetchExistingSizes();
  }, [productId]);

  const fetchProductTypes = async () => {
    try {
      const { data } = await adminFetch<{ data: ProductType[] }>('product_types', {
        params: { filter_column: 'is_active', filter_value: 'true' },
      });
      setProductTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching product types:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await adminFetch<{ data: Product[] }>('products', {
        params: { filter_column: 'id', filter_value: productId },
      });

      const product = data[0];
      setProduct(product);
      setSelectedProductType(product.product_type_id || '');
      setFormData({
        name: product.name,
        description: product.description || '',
        material: product.material || '',
        price: product.price?.toString() || '',
        compare_at_price: product.compare_at_price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        is_featured: product.is_featured,
        is_active: product.is_active,
        has_variants: product.has_variants || false,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('שגיאה בטעינת המוצר');
    } finally {
      setLoading(false);
    }
  };

  const fetchVariants = async () => {
    try {
      const { data } = await adminFetch<{ data: ProductVariant[] }>('product_variants', {
        params: { filter_column: 'product_id', filter_value: productId, order_by: 'sort_order' },
      });
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await adminFetch<{ data: Category[] }>('categories', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const { data } = await adminFetch<{ data: { category_id: string }[] }>('product_categories', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'category_id' },
      });
      setSelectedCategories(data?.map((pc) => pc.category_id) || []);
    } catch (error: any) {
      console.error('Error fetching product categories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const { data } = await adminFetch<{ data: Color[] }>('colors', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setColors(data || []);
    } catch (error: any) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchShapes = async () => {
    try {
      const { data } = await adminFetch<{ data: Shape[] }>('shapes', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setShapes(data || []);
    } catch (error: any) {
      console.error('Error fetching shapes:', error);
    }
  };

  const fetchProductColors = async () => {
    try {
      const { data } = await adminFetch<{ data: { color_id: string; sort_order: number }[] }>('product_colors', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'color_id, sort_order', order_by: 'sort_order' },
      });
      setSelectedColors(data?.map((pc) => pc.color_id) || []);
    } catch (error: any) {
      console.error('Error fetching product colors:', error);
    }
  };

  const fetchProductShapes = async () => {
    try {
      const { data } = await adminFetch<{ data: { shape_id: string }[] }>('product_shapes', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'shape_id' },
      });
      setSelectedShapes(data?.map((ps) => ps.shape_id) || []);
    } catch (error: any) {
      console.error('Error fetching product shapes:', error);
    }
  };

  const fetchSpaces = async () => {
    try {
      const { data } = await adminFetch<{ data: Space[] }>('spaces', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setSpaces(data || []);
    } catch (error: any) {
      console.error('Error fetching spaces:', error);
    }
  };

  const fetchProductSpaces = async () => {
    try {
      const { data } = await adminFetch<{ data: { space_id: string }[] }>('product_spaces', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'space_id' },
      });
      setSelectedSpaces(data?.map((ps) => ps.space_id) || []);
    } catch (error: any) {
      console.error('Error fetching product spaces:', error);
    }
  };

  const fetchPlantTypes = async () => {
    try {
      const { data } = await adminFetch<{ data: PlantType[] }>('plant_types', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setPlantTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching plant types:', error);
    }
  };

  const fetchPlantSizes = async () => {
    try {
      const { data } = await adminFetch<{ data: PlantSize[] }>('plant_sizes', {
        params: { filter_column: 'is_active', filter_value: 'true', order_by: 'sort_order' },
      });
      setPlantSizes(data || []);
    } catch (error: any) {
      console.error('Error fetching plant sizes:', error);
    }
  };

  const fetchProductPlantTypes = async () => {
    try {
      const { data } = await adminFetch<{ data: { plant_type_id: string }[] }>('product_plant_types', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'plant_type_id' },
      });
      setSelectedPlantTypes(data?.map((pt) => pt.plant_type_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant types:', error);
    }
  };

  const fetchProductPlantSizes = async () => {
    try {
      const { data } = await adminFetch<{ data: { plant_size_id: string }[] }>('product_plant_sizes', {
        params: { filter_column: 'product_id', filter_value: productId, select: 'plant_size_id' },
      });
      setSelectedPlantSizes(data?.map((ps) => ps.plant_size_id) || []);
    } catch (error: any) {
      console.error('Error fetching product plant sizes:', error);
    }
  };

  const fetchProductImages = async () => {
    try {
      const { data } = await adminFetch<{ data: ProductImage[] }>('product_images', {
        params: { filter_column: 'product_id', filter_value: productId, order_by: 'sort_order' },
      });
      setProductImages(data || []);
    } catch (error: any) {
      console.error('Error fetching product images:', error);
    }
  };

  const fetchExistingSizes = async () => {
    try {
      const res = await fetch('/api/products/attribute-reference');
      const data = await res.json();
      setExistingSizes(data.sizes || []);
    } catch (error) {
      console.error('Error fetching existing sizes:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleShape = (shapeId: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shapeId)
        ? prev.filter((id) => id !== shapeId)
        : [...prev, shapeId]
    );
  };

  const toggleSpace = (spaceId: string) => {
    setSelectedSpaces((prev) =>
      prev.includes(spaceId)
        ? prev.filter((id) => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const togglePlantType = (id: string) => {
    setSelectedPlantTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePlantSize = (id: string) => {
    setSelectedPlantSizes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // Prevent double submission
    setSaving(true);

    try {
      const isPlantProduct = productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants';

      // 1. Update product details
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        material: formData.material,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        has_variants: formData.has_variants,
      };

      await adminFetch('products', {
        method: 'PUT',
        data: { id: productId, ...updateData },
      });

      // 2. Sync category relationships
      await adminFetch('product_categories', {
        method: 'DELETE',
        params: { filter_column: 'product_id', filter_value: productId },
      });

      if (selectedCategories.length > 0) {
        const categoryRelations = selectedCategories.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }));
        await adminFetch('product_categories', { method: 'POST', data: categoryRelations });
      }

      // 3. Sync color relationships
      await adminFetch('product_colors', {
        method: 'DELETE',
        params: { filter_column: 'product_id', filter_value: productId },
      });

      if (selectedColors.length > 0) {
        const colorRelations = selectedColors.map((colorId, index) => ({
          product_id: productId,
          color_id: colorId,
          sort_order: index,
        }));
        await adminFetch('product_colors', { method: 'POST', data: colorRelations });
      }

      // 4. Sync shape relationships
      await adminFetch('product_shapes', {
        method: 'DELETE',
        params: { filter_column: 'product_id', filter_value: productId },
      });

      if (selectedShapes.length > 0) {
        const shapeRelations = selectedShapes.map((shapeId) => ({
          product_id: productId,
          shape_id: shapeId,
        }));
        await adminFetch('product_shapes', { method: 'POST', data: shapeRelations });
      }

      // 5. Sync space relationships
      await adminFetch('product_spaces', {
        method: 'DELETE',
        params: { filter_column: 'product_id', filter_value: productId },
      });

      if (selectedSpaces.length > 0) {
        const spaceRelations = selectedSpaces.map((spaceId) => ({
          product_id: productId,
          space_id: spaceId,
        }));
        await adminFetch('product_spaces', { method: 'POST', data: spaceRelations });
      }

      // 6. Sync plant dimensions (only if product type is plants)
      if (isPlantProduct) {
        // Sync plant types
        await adminFetch('product_plant_types', { method: 'DELETE', params: { filter_column: 'product_id', filter_value: productId } });
        if (selectedPlantTypes.length > 0) {
          const relations = selectedPlantTypes.map(id => ({
            product_id: productId,
            plant_type_id: id,
          }));
          await adminFetch('product_plant_types', { method: 'POST', data: relations });
        }

        // Sync plant sizes
        await adminFetch('product_plant_sizes', { method: 'DELETE', params: { filter_column: 'product_id', filter_value: productId } });
        if (selectedPlantSizes.length > 0) {
          const relations = selectedPlantSizes.map(id => ({
            product_id: productId,
            plant_size_id: id,
          }));
          await adminFetch('product_plant_sizes', { method: 'POST', data: relations });
        }

      }

      // 7. Save all variants
      if (variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];

          // Skip variants without required fields
          if (!variant.size || variant.price <= 0) {
            continue;
          }

          // Canonicalize the size so dimension-swapped duplicates (e.g. "330×240" vs
          // "240×330") collapse to one entry.
          const canonicalSize = normalizeSize(variant.size) || variant.size;

          // Auto-generate SKU if not present
          const sku = (!variant.sku || variant.sku.startsWith('VAR-'))
            ? `VAR-${Date.now()}-${i}`
            : variant.sku;

          if (variant.id.startsWith('temp-')) {
            // Check for existing variant with same (normalized) size + color to prevent duplicates
            const { data: allProductVariants } = await adminFetch<{ data: any[] }>('product_variants', {
              params: { filter_column: 'product_id', filter_value: productId, select: 'id,size,color_id' },
            });
            const existingVariants = (allProductVariants || []).filter(
              (v: any) => normalizeSize(v.size) === canonicalSize && (variant.color_id ? v.color_id === variant.color_id : v.color_id === null)
            );

            if (existingVariants.length > 0) {
              // Update the existing variant instead of creating a duplicate
              try {
                await adminFetch('product_variants', {
                  method: 'PUT',
                  data: {
                    id: existingVariants[0].id,
                    size: canonicalSize,
                    sku,
                    price: variant.price,
                    compare_at_price: variant.compare_at_price || null,
                    stock_quantity: variant.stock_quantity,
                    is_active: variant.is_active,
                    sort_order: i,
                  },
                });
              } catch (err) {
                console.error('Error updating duplicate variant:', err);
              }
            } else {
              // Create new variant
              try {
                await adminFetch('product_variants', {
                  method: 'POST',
                  data: [{
                    product_id: productId,
                    size: canonicalSize,
                    color_id: variant.color_id || null,
                    sku,
                    price: variant.price,
                    compare_at_price: variant.compare_at_price || null,
                    stock_quantity: variant.stock_quantity,
                    is_active: variant.is_active,
                    sort_order: i,
                  }],
                });
              } catch (err) {
                console.error('Error creating variant:', err);
              }
            }
          } else {
            // Update existing variant
            try {
              await adminFetch('product_variants', {
                method: 'PUT',
                data: {
                  id: variant.id,
                  size: canonicalSize,
                  color_id: variant.color_id || null,
                  sku,
                  price: variant.price,
                  compare_at_price: variant.compare_at_price || null,
                  stock_quantity: variant.stock_quantity,
                  is_active: variant.is_active,
                },
              });
            } catch (err) {
              console.error('Error updating variant:', err);
            }
          }
        }

        // Update has_variants flag
        await adminFetch('products', {
          method: 'PUT',
          data: { id: productId, has_variants: true },
        });
      }

      alert('המוצר עודכן בהצלחה!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`שגיאה בעדכון המוצר: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () => {
    const newVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      size: '',
      color_id: null,
      sku: `VAR-${Date.now()}`,
      price: 0,
      compare_at_price: 0,
      stock_quantity: 0,
      is_active: true,
      sort_order: variants.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVariants([...variants, newVariant as ProductVariant]);
  };

  const addVariantToColor = (colorId: string | null) => {
    const newVariant = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      size: '',
      color_id: colorId,
      sku: `VAR-${Date.now()}`,
      price: 0,
      compare_at_price: 0,
      stock_quantity: 0,
      is_active: true,
      sort_order: variants.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVariants([...variants, newVariant as ProductVariant]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const removeVariant = async (index: number) => {
    const variant = variants[index];

    if (variant.id.startsWith('temp-')) {
      // Just remove from state if not saved yet
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    if (!confirm('האם אתה בטוח שברצונך למחוק גודל זה?')) return;

    try {
      await adminFetch('product_variants', {
        method: 'DELETE',
        params: { id: variant.id },
      });

      setVariants(variants.filter((_, i) => i !== index));
      alert('הגודל נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert('שגיאה במחיקת הגודל');
    }
  };

  const generateVariants = () => {
    // Get unique sizes from existing variants
    const existingSizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));

    if (existingSizes.length === 0) {
      alert('יש להוסיף לפחות וריאנט אחד עם מידה לפני יצירת שילובים');
      return;
    }

    if (selectedColors.length === 0) {
      alert('יש לבחור צבעים למוצר לפני יצירת שילובים');
      return;
    }

    // Create a set of existing size+color combinations
    const existingCombinations = new Set(
      variants.map(v => `${v.size}|${v.color_id || ''}`)
    );

    // Find the first variant with price to use as template
    const templateVariant = variants.find(v => v.price > 0) || variants[0];

    // Generate missing combinations
    const newVariants: ProductVariant[] = [];
    existingSizes.forEach(size => {
      selectedColors.forEach(colorId => {
        const combinationKey = `${size}|${colorId}`;
        if (!existingCombinations.has(combinationKey)) {
          newVariants.push({
            id: `temp-${Date.now()}-${newVariants.length}`,
            product_id: productId,
            size,
            color_id: colorId,
            sku: `VAR-${Date.now()}-${newVariants.length}`,
            price: templateVariant?.price || 0,
            compare_at_price: templateVariant?.compare_at_price || 0,
            stock_quantity: 0,
            is_active: true,
            sort_order: variants.length + newVariants.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as ProductVariant);
        }
      });
    });

    if (newVariants.length === 0) {
      alert('כל השילובים כבר קיימים');
      return;
    }

    setVariants([...variants, ...newVariants]);
    alert(`נוספו ${newVariants.length} וריאנטים חדשים. לחץ "שמור" על כל וריאנט לשמירה.`);
  };

  const getColorName = (colorId: string | null) => {
    if (!colorId) return null;
    const color = colors.find(c => c.id === colorId);
    return color?.name || null;
  };

  const variantsByColor = useMemo(() => {
    const groups: { colorKey: string; colorId: string | null; colorName: string; items: { variant: ProductVariant; originalIndex: number }[] }[] = [];
    const groupMap = new Map<string, typeof groups[number]>();

    variants.forEach((variant, index) => {
      const colorId = variant.color_id || null;
      const colorKey = colorId || '__none__';

      if (!groupMap.has(colorKey)) {
        const group = {
          colorKey,
          colorId,
          colorName: colorId ? (colors.find(c => c.id === colorId)?.name || 'לא ידוע') : 'ללא צבע',
          items: [] as { variant: ProductVariant; originalIndex: number }[],
        };
        groupMap.set(colorKey, group);
        groups.push(group);
      }
      groupMap.get(colorKey)!.items.push({ variant, originalIndex: index });
    });

    return groups;
  }, [variants, colors]);

  const toggleColorCollapse = (colorKey: string) => {
    setCollapsedColors(prev => {
      const next = new Set(prev);
      if (next.has(colorKey)) {
        next.delete(colorKey);
      } else {
        next.add(colorKey);
      }
      return next;
    });
  };

  const saveVariant = async (index: number) => {
    const variant = variants[index];

    if (!variant.size || variant.price <= 0) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
    }

    // Canonicalize the size so dimension-swapped duplicates (e.g. "330×240" vs
    // "240×330") collapse to one entry.
    const canonicalSize = normalizeSize(variant.size) || variant.size;

    // Auto-generate SKU if not present
    if (!variant.sku || variant.sku.startsWith('VAR-')) {
      variant.sku = `VAR-${Date.now()}-${index}`;
    }

    try {
      if (variant.id.startsWith('temp-')) {
        // Check for existing variant with same (normalized) size + color to prevent duplicates
        const { data: allProductVariants } = await adminFetch<{ data: any[] }>('product_variants', {
          params: { filter_column: 'product_id', filter_value: productId, select: 'id,size,color_id' },
        });
        const existingVariants = (allProductVariants || []).filter(
          (v: any) => normalizeSize(v.size) === canonicalSize && (variant.color_id ? v.color_id === variant.color_id : v.color_id === null)
        );

        if (existingVariants.length > 0) {
          // Update the existing variant instead of creating a duplicate
          const { data } = await adminFetch<{ data: ProductVariant }>('product_variants', {
            method: 'PUT',
            data: {
              id: existingVariants[0].id,
              size: canonicalSize,
              sku: variant.sku,
              price: variant.price,
              compare_at_price: variant.compare_at_price || null,
              stock_quantity: variant.stock_quantity,
              is_active: variant.is_active,
              sort_order: variant.sort_order,
            },
          });

          const updated = [...variants];
          updated[index] = data;
          setVariants(updated);
        } else {
          // Create new variant
          const { data } = await adminFetch<{ data: ProductVariant }>('product_variants', {
            method: 'POST',
            data: [{
              product_id: productId,
              size: canonicalSize,
              color_id: variant.color_id || null,
              sku: variant.sku,
              price: variant.price,
              compare_at_price: variant.compare_at_price || null,
              stock_quantity: variant.stock_quantity,
              is_active: variant.is_active,
              sort_order: variant.sort_order,
            }],
          });

          const updated = [...variants];
          updated[index] = Array.isArray(data) ? data[0] : data;
          setVariants(updated);
        }
      } else {
        // Update existing variant
        await adminFetch('product_variants', {
          method: 'PUT',
          data: {
            id: variant.id,
            size: canonicalSize,
            color_id: variant.color_id || null,
            sku: variant.sku,
            price: variant.price,
            compare_at_price: variant.compare_at_price || null,
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
          },
        });
      }

      // Update has_variants flag on product
      try {
        await adminFetch('products', {
          method: 'PUT',
          data: { id: productId, has_variants: true },
        });
      } catch (err) {
        console.error('Error updating has_variants:', err);
      }

      // Update local state to reflect has_variants
      setFormData(prev => ({ ...prev, has_variants: true }));

      alert('הגודל נשמר בהצלחה! רענן את דף המוצר כדי לראות את השינויים.');

      // Refetch to ensure we have the latest data
      await fetchProduct();
      fetchVariants();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      alert(`שגיאה בשמירת הגודל: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <FaArrowRight className="ml-2" />
          חזרה לרשימת מוצרים
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">ערוך מוצר</h1>
        <p className="text-gray-600 mt-2">עדכן את פרטי המוצר וניהול מידות</p>
      </div>

      {/* Product Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type Display */}
        {selectedProductType && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            סוג מוצר
          </h2>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-lg font-bold text-gray-800">
              {productTypes.find(pt => pt.id === selectedProductType)?.name}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            <strong>💡 הערה:</strong> לא ניתן לשנות את סוג המוצר לאחר יצירתו.
          </p>
        </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            פרטי מוצר בסיסיים
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                שם המוצר <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                תיאור
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                חומר
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Carpet Dimensions - Only show if carpets product type is selected */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'carpets' && (
        <>
        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            סגנון
          </h2>

          {categories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-2">אין סגנונות זמינים</p>
              <Link
                href="/admin/categories"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                צור סגנון חדש
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> ניתן לבחור מספר סגנונות למוצר אחד.
            </p>
          </div>
        </div>

        {/* Shapes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            צורה
          </h2>

          {shapes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין צורות זמינות</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {shapes.map((shape) => (
                <label
                  key={shape.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedShapes.includes(shape.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedShapes.includes(shape.id)}
                    onChange={() => toggleShape(shape.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {shape.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> ניתן לבחור מספר צורות אם המוצר זמין במספר צורות.
            </p>
          </div>
        </div>

        {/* Colors Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            צבעים
          </h2>

          {colors.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין צבעים זמינים</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {colors.map((color) => (
                <label
                  key={color.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedColors.includes(color.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.id)}
                    onChange={() => toggleColor(color.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          {selectedColors.length > 1 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">סדר תצוגה (הצבע הראשון יוצג ראשון באתר):</p>
              <div className="space-y-2">
                {selectedColors.map((colorId, index) => {
                  const color = colors.find(c => c.id === colorId);
                  if (!color) return null;
                  return (
                    <div key={colorId} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                      {color.hex_code && (
                        <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: color.hex_code }} />
                      )}
                      <span className="flex-1 text-sm font-medium text-gray-700">{color.name}</span>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const newOrder = [...selectedColors];
                          [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                          setSelectedColors(newOrder);
                        }}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                        title="הזז למעלה"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={index === selectedColors.length - 1}
                        onClick={() => {
                          const newOrder = [...selectedColors];
                          [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                          setSelectedColors(newOrder);
                        }}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                        title="הזז למטה"
                      >
                        ▼
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> בחר את כל הצבעים שהמוצר זמין בהם. הצבע הראשון ברשימה יוצג ראשון בדף המוצר.
            </p>
          </div>
        </div>

        {/* Spaces Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            חלל
          </h2>

          {spaces.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">אין חללים זמינים</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {spaces.map((space) => (
                <label
                  key={space.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSpaces.includes(space.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSpaces.includes(space.id)}
                    onChange={() => toggleSpace(space.id)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="mr-3 text-gray-700 font-medium">
                    {space.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-sage-light bg-opacity-20 rounded-lg border border-sage">
            <p className="text-sm text-gray-700">
              <strong>💡 טיפ:</strong> בחר את החללים המתאימים למוצר זה.
            </p>
          </div>
        </div>
        </>
        )}

        {/* Plant Dimensions - Only show if plants product type is selected */}
        {selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants' && (
        <>
        {/* Plant Types Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">סוג צמח</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantTypes.map((plantType) => (
              <label
                key={plantType.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantTypes.includes(plantType.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantTypes.includes(plantType.id)}
                  onChange={() => togglePlantType(plantType.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantType.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Plant Sizes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">גודל</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {plantSizes.map((plantSize) => (
              <label
                key={plantSize.id}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlantSizes.includes(plantSize.id)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPlantSizes.includes(plantSize.id)}
                  onChange={() => togglePlantSize(plantSize.id)}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="mr-3 text-gray-700 font-medium">{plantSize.name}</span>
              </label>
            ))}
          </div>
        </div>

        </>
        )}

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">הגדרות</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="mr-3 text-gray-700">
                מוצר מומלץ (יוצג בעמוד הבית)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="mr-3 text-gray-700">
                מוצר פעיל (גלוי באתר)
              </span>
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">תמונות מוצר</h2>
          <ProductImageUpload
            productId={productId}
            existingImages={productImages}
            onImagesChange={(images) => setProductImages(images)}
            colors={colors.filter(c => selectedColors.includes(c.id))}
          />
        </div>
      </form>

      {/* Product Variants / Sizes */}
      {selectedProductType && (
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              מידות וצבעים
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              הוסף וריאנטים של מידה+צבע למוצר זה. לחץ על <strong>"שמור שינויים"</strong> בתחתית העמוד לשמירת כל השינויים.
            </p>
          </div>
          <div className="flex gap-2">
            {selectedColors.length > 0 && (
              <button
                onClick={generateVariants}
                className="bg-sage text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
              >
                <FaPlus />
                צור וריאנטים לכל השילובים
              </button>
            )}
            {(variants.length === 0 || (variantsByColor.length <= 1 && !variantsByColor[0]?.colorId)) && (
              <button
                onClick={addVariant}
                className="bg-terracotta text-white px-4 py-2 rounded-lg hover:bg-terracotta-dark transition-colors flex items-center gap-2"
              >
                <FaPlus />
                הוסף וריאנט
              </button>
            )}
          </div>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>טרם הוספו וריאנטים למוצר זה</p>
            <p className="text-sm mt-2">לחץ על "הוסף וריאנט" כדי להתחיל</p>
          </div>
        ) : variantsByColor.length <= 1 && !variantsByColor[0]?.colorId ? (
          /* Flat list when no colors are assigned */
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מידה <span className="text-red-500">*</span>
                    </label>
                    <SizeCombobox
                      value={variant.size}
                      onChange={(val) => updateVariant(index, 'size', val)}
                      sizes={existingSizes}
                      placeholder="160×230"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">צבע</label>
                    <select
                      value={variant.color_id || ''}
                      onChange={(e) => updateVariant(index, 'color_id', e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">ללא צבע</option>
                      {colors.map((color) => (
                        <option key={color.id} value={color.id}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      מחיר (₪) <span className="text-red-500">*</span>
                    </label>
                    <input type="number" value={variant.price} onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">מחיר השוואה (₪)</label>
                    <input type="number" value={variant.compare_at_price || ''} onChange={(e) => updateVariant(index, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : null)} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">מלאי</label>
                    <input type="number" value={variant.stock_quantity} onChange={(e) => updateVariant(index, 'stock_quantity', parseInt(e.target.value))} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => removeVariant(index)} type="button" className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors" title="מחק וריאנט">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grouped by color with collapsible sections */
          <div className="space-y-3">
            {variantsByColor.map((group) => {
              const isCollapsed = collapsedColors.has(group.colorKey);
              const prices = group.items.map(i => i.variant.price);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              return (
                <div key={group.colorKey} className="border border-gray-200 rounded-lg">
                  {/* Color Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleColorCollapse(group.colorKey)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaChevronDown
                        className={`text-gray-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                        size={12}
                      />
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {group.colorName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {group.items.length} {group.items.length === 1 ? 'וריאנט' : 'וריאנטים'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {prices.length > 0 && (
                        <span>
                          ₪{minPrice}
                          {minPrice !== maxPrice && <> - ₪{maxPrice}</>}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Variants within group */}
                  {!isCollapsed && (
                    <div className="divide-y divide-gray-100">
                      {group.items.map(({ variant, originalIndex }) => (
                        <div key={variant.id} className="px-4 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                מידה <span className="text-red-500">*</span>
                              </label>
                              <SizeCombobox
                                value={variant.size}
                                onChange={(val) => updateVariant(originalIndex, 'size', val)}
                                sizes={existingSizes}
                                placeholder="160×230"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">
                                מחיר (₪) <span className="text-red-500">*</span>
                              </label>
                              <input type="number" value={variant.price} onChange={(e) => updateVariant(originalIndex, 'price', parseFloat(e.target.value))} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">מחיר השוואה (₪)</label>
                              <input type="number" value={variant.compare_at_price || ''} onChange={(e) => updateVariant(originalIndex, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : null)} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-1">מלאי</label>
                              <input type="number" value={variant.stock_quantity} onChange={(e) => updateVariant(originalIndex, 'stock_quantity', parseInt(e.target.value))} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            </div>
                            <div className="flex items-end">
                              <button onClick={() => removeVariant(originalIndex)} type="button" className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors" title="מחק וריאנט">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Add Size button for this color group */}
                      <div className="px-4 py-3 bg-gray-50/50">
                        <button
                          type="button"
                          onClick={() => addVariantToColor(group.colorId)}
                          className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium"
                        >
                          <FaPlus size={10} />
                          הוסף מידה
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}


      {/* Actions - At the Bottom */}
      <div className="mt-8 flex justify-end gap-4">
        <Link
          href="/admin/products"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ביטול
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('form')?.requestSubmit();
          }}
          disabled={saving}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              שומר...
            </>
          ) : (
            <>
              <FaSave />
              שמור שינויים
            </>
          )}
        </button>
      </div>
    </div>
  );
}
