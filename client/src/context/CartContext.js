import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Fetch Cart from Database or LocalStorage on Login
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('ppn_token');
      if (token) {
        try {
          const { data } = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data && data.items) {
            setCart(data.items);
          } else {
            const localCart = JSON.parse(localStorage.getItem('ppn_cart')) || [];
            setCart(localCart);
          }
        } catch (err) {
          const localCart = JSON.parse(localStorage.getItem('ppn_cart')) || [];
          setCart(localCart);
        }
      } else {
        setCart([]);
      }
      setIsInitialLoad(false);
    };
    fetchCart();
  }, []);

  // 2. Sync Cart to Database & LocalStorage whenever it changes
  useEffect(() => {
    if (isInitialLoad) return;

    const token = localStorage.getItem('ppn_token');
    if (token) {
      localStorage.setItem('ppn_cart', JSON.stringify(cart));
      
      const syncTimeout = setTimeout(async () => {
        try {
          await axios.post('http://localhost:5000/api/cart/sync', { items: cart }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Database sync failed");
        }
      }, 1000);

      return () => clearTimeout(syncTimeout);
    } else {
      // If user logs out, clear the state
      if (!token && cart.length > 0) setCart([]);
    }
  }, [cart, isInitialLoad]);

  // Calculations
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ✅ Helper to update discount from Checkout.jsx
  const setDiscountData = (couponData) => {
    setAppliedCoupon(couponData);
  };

  // 3. Dynamic Apply Coupon with Backend Validation
  

 // Inside CartContext.js
const applyCoupon = async (code) => {
  if (!code) return false; // Return a simple boolean
  
  try {
    const { data } = await axios.post('http://localhost:5000/api/coupons/validate', { 
      code,
      cartTotal: subtotal 
    });
    
    setAppliedCoupon(data); 
    return true; // Simple success
  } catch (err) {
    console.error(err);
    return false; // Simple failure
  }
};

// Update this to NOT have a toast inside it
const removeCoupon = () => {
  setAppliedCoupon(null);
};
  // 4. Calculate Discount based on Model OfferTypes
  const getDiscount = () => {
    if (!appliedCoupon || cart.length === 0) return 0;

    // Handle BOGO (Buy One Get One - cheapest item free)
    if (appliedCoupon.offerType === 'BOGO') {
      const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
      if (totalItems < 2) return 0;
      // Get the price of the single cheapest item in the cart
      const prices = cart.map(i => i.price);
      return Math.min(...prices);
    }

    // Handle Percentage Discount (e.g., 10%)
    if (appliedCoupon.offerType === 'Percentage') {
      return (subtotal * appliedCoupon.discountValue) / 100;
    }

    // Handle Flat Discount (e.g., ₹100 off)
    if (appliedCoupon.offerType === 'Flat') {
      return appliedCoupon.discountValue;
    }

    return 0;
  };

  const addToCart = (product, quantity = 1, variant = null, size = null) => {
    const token = localStorage.getItem('ppn_token');
    if (!token) {
      toast.error("Please login to start shopping! 💅");
      return;
    }
    setCart(prev => {
      const key = `${product._id}-${variant?.color || ''}-${size || ''}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        toast.success('Cart updated!');
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success('Added to cart! 💅');
      return [...prev, { key, product, quantity, variant, size, price: product.price }];
    });
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(i => i.key !== key));
    toast.success('Removed from cart');
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('ppn_cart');
  };

  const discountAmount = getDiscount();
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  
  // Luxury branding: Tax is calculated on discounted price
  const tax = (subtotal - discountAmount) * 0.08;
  
  // Free shipping over 500 logic
  const shipping = (subtotal - discountAmount) >= 500 || cart.length === 0 ? 0 : 50; 
  
  const total = subtotal - discountAmount + tax + shipping;

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      applyCoupon, removeCoupon, setDiscountData, subtotal, itemCount, shipping, 
      discount: appliedCoupon ? appliedCoupon.discountValue : 0, 
      discountAmount, tax, total, appliedCoupon, setAppliedCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
};