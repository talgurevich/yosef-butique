# Product Types Implementation - Complete Guide

## Status

✅ **Completed:**
- SQL migration for product types and plant dimensions
- TypeScript types added to `/lib/supabase.ts`
- Template admin page created: `/app/admin/plant-types/page.tsx`
- State variables added to new product form

🔄 **In Progress:**
- Product form updates (both new and edit)

## Critical Implementation Steps

### 1. Add Fetch Functions (New Product Page)

Add to `useEffect` after line 68:
```tsx
useEffect(() => {
  fetchProductTypes();
  // Existing fetches...
}, []);

const fetchProductTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('is_active', true);
    if (error) throw error;
    setProductTypes(data || []);

    // Auto-select carpets by default
    if (data && data.length > 0) {
      const carpetsType = data.find(pt => pt.slug === 'carpets');
      if (carpetsType) {
        setSelectedProductType(carpetsType.id);
      }
    }
  } catch (error: any) {
    console.error('Error fetching product types:', error);
  }
};

// Add similar fetch functions for all 5 plant dimensions:
// - fetchPlantTypes()
// - fetchPlantSizes()
// - fetchPlantLightRequirements()
// - fetchPlantCareLevels()
// - fetchPlantPetSafety()
```

### 2. Add Toggle Functions for Plant Dimensions

Add after line 145:
```tsx
const togglePlantType = (id: string) => {
  setSelectedPlantTypes(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
};

// Add similar toggle functions for:
// - togglePlantSize
// - togglePlantLightRequirement
// - togglePlantCareLevel
// - togglePlantPetSafety
```

### 3. Add Product Type Selector in Form

Add BEFORE line 336 (before Basic Details section):
```tsx
{/* Product Type Selector */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-6">
    סוג מוצר <span className="text-red-500">*</span>
  </h2>

  <div className="grid grid-cols-2 gap-4">
    {productTypes.map((type) => (
      <label
        key={type.id}
        className={`flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors ${
          selectedProductType === type.id
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300'
        }`}
      >
        <input
          type="radio"
          name="product_type"
          value={type.id}
          checked={selectedProductType === type.id}
          onChange={() => setSelectedProductType(type.id)}
          className="sr-only"
        />
        <span className="text-xl font-bold text-gray-800">{type.name}</span>
      </label>
    ))}
  </div>

  {!selectedProductType && (
    <p className="mt-4 text-red-600 text-sm">נא לבחור סוג מוצר</p>
  )}
</div>
```

### 4. Wrap Carpet Dimensions in Conditional

Find the sections starting at line 374 (Categories), 424 (Colors), 472 (Shapes), 544 (Spaces).

Wrap ALL OF THEM in:
```tsx
{selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'carpets' && (
  <>
    {/* All carpet dimension sections here */}
  </>
)}
```

### 5. Add Plant Dimensions Sections

Add AFTER the carpet dimensions conditional:
```tsx
{selectedProductType && productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants' && (
  <>
    {/* Plant Types Section - copy pattern from Colors section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">סוג צמח</h2>
      {/* Multi-select checkboxes for plantTypes */}
    </div>

    {/* Plant Sizes Section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">גודל</h2>
      {/* Multi-select checkboxes for plantSizes */}
    </div>

    {/* Plant Light Requirements Section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">דרישות אור</h2>
      {/* Multi-select checkboxes for plantLightRequirements */}
    </div>

    {/* Plant Care Levels Section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">רמת טיפול</h2>
      {/* Multi-select checkboxes for plantCareLevels */}
    </div>

    {/* Plant Pet Safety Section */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">בטיחות לחיות מחמד</h2>
      {/* Radio buttons for plantPetSafety (only one selection) */}
    </div>
  </>
)}
```

### 6. Update handleSubmit to Save Plant Dimensions

Add after line 323 (after saving carpet dimensions):
```tsx
// Save plant dimensions (only if product type is plants)
if (productTypes.find(pt => pt.id === selectedProductType)?.slug === 'plants') {

  // 7. Plant types
  if (selectedPlantTypes.length > 0) {
    const relations = selectedPlantTypes.map(id => ({
      product_id: productData.id,
      plant_type_id: id,
    }));
    const { error } = await supabase.from('product_plant_types').insert(relations);
    if (error) throw error;
  }

  // 8. Plant sizes
  if (selectedPlantSizes.length > 0) {
    const relations = selectedPlantSizes.map(id => ({
      product_id: productData.id,
      plant_size_id: id,
    }));
    const { error } = await supabase.from('product_plant_sizes').insert(relations);
    if (error) throw error;
  }

  // 9. Plant light requirements
  if (selectedPlantLightRequirements.length > 0) {
    const relations = selectedPlantLightRequirements.map(id => ({
      product_id: productData.id,
      plant_light_requirement_id: id,
    }));
    const { error } = await supabase.from('product_plant_light_requirements').insert(relations);
    if (error) throw error;
  }

  // 10. Plant care levels
  if (selectedPlantCareLevels.length > 0) {
    const relations = selectedPlantCareLevels.map(id => ({
      product_id: productData.id,
      plant_care_level_id: id,
    }));
    const { error } = await supabase.from('product_plant_care_levels').insert(relations);
    if (error) throw error;
  }

  // 11. Plant pet safety
  if (selectedPlantPetSafety.length > 0) {
    const relations = selectedPlantPetSafety.map(id => ({
      product_id: productData.id,
      plant_pet_safety_id: id,
    }));
    const { error } = await supabase.from('product_plant_pet_safety').insert(relations);
    if (error) throw error;
  }
}
```

### 7. Update Product Insert to Include product_type_id

Find line 164 where product is inserted, add:
```tsx
product_type_id: selectedProductType,
```

## Same Changes Needed for Edit Product Page

Apply all the same changes to `/app/admin/products/[id]/page.tsx`:
1. Add state for product types and plant dimensions
2. Fetch product type and all plant dimensions
3. Fetch existing plant dimension relationships
4. Add product type display (read-only or editable)
5. Conditional rendering of dimensions
6. Update save logic to sync plant dimensions

## Testing Checklist

- [ ] Can create carpet product with all carpet dimensions
- [ ] Can create plant product with all plant dimensions
- [ ] Carpet dimensions hidden when plant selected
- [ ] Plant dimensions hidden when carpet selected
- [ ] Product type can't be changed after creation (recommended)
- [ ] All plant dimension relationships save correctly

## Notes

- Product type should probably be **read-only after creation** to avoid data integrity issues
- Consider adding product type filter to products list page
- May need to update product display/detail pages for plants vs carpets
