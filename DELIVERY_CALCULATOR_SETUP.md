# Delivery Calculator Setup Guide

The delivery calculator uses Google Maps APIs to calculate distance-based delivery costs.

## Features

- ✅ Google Places Autocomplete for address input
- ✅ Distance calculation from business address (בית עזרא)
- ✅ Tiered pricing based on distance
- ✅ Free delivery for orders over ₪500
- ✅ Persistent delivery data across page refreshes

## Delivery Pricing Tiers

Current default tiers:
- **0-10 km**: ₪30
- **10-30 km**: ₪50
- **30-50 km**: ₪80
- **50+ km**: ₪120

**Free delivery** for orders over ₪500 (regardless of distance)

## Google Maps API Setup

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Distance Matrix API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Restrict Your API Key (Important for Security)

1. Click on your API key in the Credentials page
2. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
     - `https://*.vercel.app/*` (if using Vercel)
3. Under **API restrictions**:
   - Select **Restrict key**
   - Choose only these APIs:
     - Maps JavaScript API
     - Places API
     - Distance Matrix API
4. Save changes

### 3. Add API Key to Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
```

**Important**: The prefix `NEXT_PUBLIC_` is required because the API is used in client-side code.

### 4. Set Up Billing

Google Maps APIs require a billing account:
- Go to **Billing** in Google Cloud Console
- Add a payment method
- Google provides $200 free credits per month
- Typical usage for a small e-commerce site should stay within free tier

## Usage Costs Estimate

Based on Google Maps pricing (as of 2024):
- **Places Autocomplete**: $2.83 per 1,000 requests (first request)
- **Places Autocomplete**: $0.283 per 1,000 requests (per session)
- **Distance Matrix**: $5 per 1,000 elements

**Example**: 100 deliveries per month = ~$1-2 (well within free tier)

## Customizing Delivery Tiers

To modify delivery pricing, edit `components/DeliveryCalculator.tsx`:

```typescript
const DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 10, price: 30, label: 'עד 10 ק״מ' },
  { maxDistance: 30, price: 50, label: '10-30 ק״מ' },
  { maxDistance: 50, price: 80, label: '30-50 ק״מ' },
  { maxDistance: Infinity, price: 120, label: 'מעל 50 ק״מ' },
];
```

## Changing Business Address

To change the origin point for distance calculations, edit:

```typescript
const BUSINESS_ADDRESS = 'השקד משק 47, מושב בית עזרא, ישראל';
```

## Testing

1. Go to `/cart` with items in your cart
2. Enter an address in Israel
3. Click "חשב עלות משלוח" (Calculate Delivery Cost)
4. Distance and delivery cost will be displayed
5. Delivery cost automatically includes in final total

## Troubleshooting

**"Google Maps API key not configured"**
- Make sure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is in your `.env.local`
- Restart your dev server after adding the key

**"שגיאה בטעינת Google Maps"**
- Check that all three APIs are enabled in Google Cloud Console
- Verify API key restrictions aren't too strict

**"לא ניתן לחשב מרחק לכתובת זו"**
- The address might be outside Israel (component restricted to IL)
- Try a more specific address

## Future Enhancements

Potential improvements (not yet implemented):
- Admin panel to manage delivery tiers
- Per-zone pricing (instead of distance-based)
- Integration with shipping providers APIs
- Delivery time estimates
- Multiple pickup locations support
