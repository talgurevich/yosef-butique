'use client';

import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaTruck, FaSpinner } from 'react-icons/fa';

type DeliveryTier = {
  maxDistance: number; // in km, null for unlimited
  price: number;
  label: string;
};

const DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 10, price: 30, label: 'עד 10 ק״מ' },
  { maxDistance: 30, price: 50, label: '10-30 ק״מ' },
  { maxDistance: 50, price: 80, label: '30-50 ק״מ' },
  { maxDistance: Infinity, price: 120, label: 'מעל 50 ק״מ' },
];

const BUSINESS_ADDRESS = 'השקד משק 47, מושב בית עזרא, ישראל';
const FREE_DELIVERY_THRESHOLD = 500;

type DeliveryCalculatorProps = {
  cartTotal: number;
  onDeliveryChange: (cost: number, distance: number | null, address: string) => void;
};

export default function DeliveryCalculator({ cartTotal, onDeliveryChange }: DeliveryCalculatorProps) {
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Check if already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=he`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('שגיאה בטעינת Google Maps');
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'il' },
        fields: ['formatted_address', 'geometry'],
      });

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      setAddress(place.formatted_address);
      calculateDistance(place.formatted_address);
    }
  };

  const calculateDistance = async (destinationAddress: string) => {
    if (!window.google?.maps) {
      setError('Google Maps לא נטען כראוי');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const service = new google.maps.DistanceMatrixService();

      const response = await service.getDistanceMatrix({
        origins: [BUSINESS_ADDRESS],
        destinations: [destinationAddress],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      if (response.rows[0]?.elements[0]?.status === 'OK') {
        const distanceInMeters = response.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;

        setDistance(distanceInKm);

        // Calculate delivery cost based on tiers
        const tier = DELIVERY_TIERS.find(t => distanceInKm <= t.maxDistance);
        const baseCost = tier?.price || DELIVERY_TIERS[DELIVERY_TIERS.length - 1].price;

        // Free delivery for orders over threshold
        const finalCost = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : baseCost;

        setDeliveryCost(finalCost);
        onDeliveryChange(finalCost, distanceInKm, destinationAddress);
      } else {
        setError('לא ניתן לחשב מרחק לכתובת זו');
        setDistance(null);
        setDeliveryCost(null);
        onDeliveryChange(0, null, '');
      }
    } catch (err: any) {
      console.error('Distance calculation error:', err);
      setError('שגיאה בחישוב מרחק');
      setDistance(null);
      setDeliveryCost(null);
      onDeliveryChange(0, null, '');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCalculate = () => {
    if (address.trim()) {
      calculateDistance(address);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaTruck />
        חישוב משלוח
      </h3>

      {/* Address Input */}
      <div className="space-y-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualCalculate()}
            placeholder="הכנס כתובת למשלוח..."
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={loading || !isLoaded}
          />
          <FaMapMarkerAlt className="absolute right-3 top-3 text-gray-400" />
        </div>

        {!isLoaded && !error && (
          <p className="text-xs text-gray-500">טוען Google Maps...</p>
        )}

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        {/* Calculate Button (for manual entry) */}
        <button
          onClick={handleManualCalculate}
          disabled={loading || !address.trim() || !isLoaded}
          className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              מחשב...
            </>
          ) : (
            <>
              <FaTruck />
              חשב עלות משלוח
            </>
          )}
        </button>

        {/* Results */}
        {distance !== null && deliveryCost !== null && (
          <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">מרחק:</span>
              <span className="font-semibold">{distance.toFixed(1)} ק״מ</span>
            </div>

            {cartTotal >= FREE_DELIVERY_THRESHOLD && deliveryCost === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-sm font-semibold text-green-800 text-center">
                  🎉 משלוח חינם!
                </p>
                <p className="text-xs text-green-600 text-center">
                  הזמנות מעל {formatPrice(FREE_DELIVERY_THRESHOLD)}
                </p>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">עלות משלוח:</span>
                <span className="font-semibold text-primary-600">{formatPrice(deliveryCost)}</span>
              </div>
            )}
          </div>
        )}

        {/* Delivery Tiers Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-800 mb-2">מחירון משלוחים:</p>
          <div className="space-y-1">
            {DELIVERY_TIERS.map((tier, idx) => (
              <div key={idx} className="flex justify-between text-xs text-blue-700">
                <span>{tier.label}</span>
                <span>{formatPrice(tier.price)}</span>
              </div>
            ))}
            <div className="border-t border-blue-300 pt-1 mt-2">
              <p className="text-xs text-blue-800 font-semibold">
                משלוח חינם מעל {formatPrice(FREE_DELIVERY_THRESHOLD)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
