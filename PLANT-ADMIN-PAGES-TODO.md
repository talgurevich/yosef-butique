# Plant Admin Pages - Implementation Guide

I've created `/admin/plant-types/page.tsx` as a template.

## Remaining 4 Pages to Create:

Copy the plant-types page and modify for each of these:

### 1. `/app/admin/plant-sizes/page.tsx`
- Change table name: `plant_types` → `plant_sizes`
- Change type: `PlantType` → `PlantSize`
- Update Hebrew text: "סוגי צמחים" → "גדלי צמחים"
- Update Hebrew text: "סוג צמח" → "גודל"

### 2. `/app/admin/plant-light-requirements/page.tsx`
- Change table name: `plant_types` → `plant_light_requirements`
- Change type: `PlantType` → `PlantLightRequirement`
- Update Hebrew text: "סוגי צמחים" → "דרישות אור"
- Update Hebrew text: "סוג צמח" → "דרישת אור"

### 3. `/app/admin/plant-care-levels/page.tsx`
- Change table name: `plant_types` → `plant_care_levels`
- Change type: `PlantType` → `PlantCareLevel`
- Update Hebrew text: "סוגי צמחים" → "רמות טיפול"
- Update Hebrew text: "סוג צמח" → "רמת טיפול"

### 4. `/app/admin/plant-pet-safety/page.tsx`
- Change table name: `plant_types` → `plant_pet_safety`
- Change type: `PlantType` → `PlantPetSafety`
- Update Hebrew text: "סוגי צמחים" → "בטיחות לחיות"
- Update Hebrew text: "סוג צמח" → "בטיחות"

## Admin Navigation Updates Needed

Add to `/app/admin/layout.tsx` in the navigation:

```tsx
{/* Plant Dimensions Section */}
<div className="mt-6 pt-6 border-t border-gray-800">
  <p className="px-6 text-xs text-gray-500 uppercase mb-3">עציצים</p>

  <Link href="/admin/plant-types" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
    <FaSeedling className="ml-3" />
    סוגי צמחים
  </Link>

  <Link href="/admin/plant-sizes" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
    <FaRulerVertical className="ml-3" />
    גדלים
  </Link>

  <Link href="/admin/plant-light-requirements" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
    <FaSun className="ml-3" />
    דרישות אור
  </Link>

  <Link href="/admin/plant-care-levels" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
    <FaHandHoldingHeart className="ml-3" />
    רמות טיפול
  </Link>

  <Link href="/admin/plant-pet-safety" className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
    <FaPaw className="ml-3" />
    בטיחות לחיות
  </Link>
</div>
```

Add to imports:
```tsx
import { ..., FaSeedling, FaRulerVertical, FaSun, FaHandHoldingHeart, FaPaw } from 'react-icons/fa';
```
