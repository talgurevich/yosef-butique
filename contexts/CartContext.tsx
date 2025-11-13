'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantSize: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug: string;
};

export type AppliedCoupon = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discountAmount: number;
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
  getDeliveryCost: () => number;
  getFinalTotal: () => number;
  getCartItemsCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [deliveryCost, setDeliveryCostState] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

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
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) => i.variantId === item.variantId
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity || 1;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
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

  const getDeliveryCost = () => {
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
        getDeliveryCost,
        getFinalTotal,
        getCartItemsCount,
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
