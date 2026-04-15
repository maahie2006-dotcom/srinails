import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ppn_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ppn_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, variant = null, size = null) => {
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

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, itemCount, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};
