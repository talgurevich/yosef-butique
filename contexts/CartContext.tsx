'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

export type CartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  variantColor?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug: string;
};

export type AppliedCoupon = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  discountAmount: number;
  applies_to_all?: boolean;
  appliedToProductIds?: string[];
};

type CartContextType = {
  cartItems: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  deliveryCost: number;
  deliveryDistance: number | null;
  deliveryAddress: string;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  setDelivery: (cost: number, distance: number | null, address: string) => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  isProductDiscounted: (productId: string) => boolean;
  getDeliveryCost: () => number;
  getFinalTotal: () => number;
  getCartItemsCount: () => number;
  cancelAbandonTimer: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [deliveryCost, setDeliveryCostState] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const abandonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ABANDON_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

  const cancelAbandonTimer = useCallback(() => {
    if (abandonTimerRef.current) {
      clearTimeout(abandonTimerRef.current);
      abandonTimerRef.current = null;
    }
    localStorage.removeItem('cart_created_at');
  }, []);

  const fireAbandonNotification = useCallback((items: CartItem[], total: number, minutesIdle: number) => {
    fetch('/api/slack/cart-abandoned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productName: i.productName, variantSize: i.variantSize, price: i.price, quantity: i.quantity })),
        total,
        minutesIdle,
      }),
    }).catch(() => {});
  }, []);

  const startAbandonTimer = useCallback((delayMs: number) => {
    if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);
    abandonTimerRef.current = setTimeout(() => {
      // Read latest cart from localStorage since state may be stale in the closure
      try {
        const saved = localStorage.getItem('cart');
        const items: CartItem[] = saved ? JSON.parse(saved) : [];
        if (items.length > 0) {
          const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
          const createdAt = localStorage.getItem('cart_created_at');
          const minutesIdle = createdAt ? Math.round((Date.now() - Number(createdAt)) / 60000) : 30;
          fireAbandonNotification(items, total, minutesIdle);
        }
      } catch {}
      localStorage.removeItem('cart_created_at');
    }, delayMs);
  }, [fireAbandonNotification]);

  // Load cart, coupon, and delivery from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCoupon = localStorage.getItem('appliedCoupon');
    const savedDelivery = localStorage.getItem('deliveryData');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error('Error loading coupon from localStorage:', error);
      }
    }

    if (savedDelivery) {
      try {
        const delivery = JSON.parse(savedDelivery);
        setDeliveryCostState(delivery.cost || 0);
        setDeliveryDistance(delivery.distance || null);
        setDeliveryAddress(delivery.address || '');
      } catch (error) {
        console.error('Error loading delivery from localStorage:', error);
      }
    }

    setIsLoaded(true);
  }, []);

  // Resume abandon timer on mount if cart is non-empty
  useEffect(() => {
    if (!isLoaded) return;
    const createdAt = localStorage.getItem('cart_created_at');
    if (cartItems.length > 0 && createdAt) {
      const elapsed = Date.now() - Number(createdAt);
      const remaining = ABANDON_TIMEOUT_MS - elapsed;
      if (remaining <= 0) {
        // Already expired — fire immediately
        const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const minutesIdle = Math.round(elapsed / 60000);
        fireAbandonNotification(cartItems, total, minutesIdle);
        localStorage.removeItem('cart_created_at');
      } else {
        startAbandonTimer(remaining);
      }
    }
    return () => {
      if (abandonTimerRef.current) clearTimeout(abandonTimerRef.current);
    };
    // Only run once after load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      if (appliedCoupon) {
        localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('appliedCoupon');
      }
    }
  }, [appliedCoupon, isLoaded]);

  // Save delivery data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const deliveryData = {
        cost: deliveryCost,
        distance: deliveryDistance,
        address: deliveryAddress,
      };
      localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
    }
  }, [deliveryCost, deliveryDistance, deliveryAddress, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems((prevItems) => {
      const wasEmpty = prevItems.length === 0;

      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.variantId === item.variantId
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity || 1;
      } else {
        // Add new item
        newItems = [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }

      // If cart went from empty to non-empty, fire cart-created and start abandon timer
      if (wasEmpty && newItems.length > 0) {
        const total = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        localStorage.setItem('cart_created_at', String(Date.now()));
        fetch('/api/slack/cart-created', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: newItems.map((i) => ({ productName: i.productName, variantSize: i.variantSize, price: i.price, quantity: i.quantity })),
            total,
          }),
        }).catch(() => {});
        startAbandonTimer(ABANDON_TIMEOUT_MS);
      }

      return newItems;
    });
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    cancelAbandonTimer();
    setCartItems([]);
    setAppliedCoupon(null);
    setDeliveryCostState(0);
    setDeliveryDistance(null);
    setDeliveryAddress('');
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const setDelivery = (cost: number, distance: number | null, address: string) => {
    setDeliveryCostState(cost);
    setDeliveryDistance(distance);
    setDeliveryAddress(address);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount;
  };

  const isProductDiscounted = (productId: string) => {
    if (!appliedCoupon) return false;
    if (appliedCoupon.discount_type === 'free_shipping') return false;
    if (appliedCoupon.applies_to_all !== false) return false; // sitewide → no per-line tag
    return (appliedCoupon.appliedToProductIds || []).includes(productId);
  };

  const getDeliveryCost = () => {
    if (appliedCoupon?.discount_type === 'free_shipping') return 0;
    return deliveryCost;
  };

  const getFinalTotal = () => {
    const total = getCartTotal();
    const discount = getDiscountAmount();
    const delivery = getDeliveryCost();
    return Math.max(0, total - discount + delivery);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        appliedCoupon,
        deliveryCost,
        deliveryDistance,
        deliveryAddress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setDelivery,
        getCartTotal,
        getDiscountAmount,
        isProductDiscounted,
        getDeliveryCost,
        getFinalTotal,
        getCartItemsCount,
        cancelAbandonTimer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
