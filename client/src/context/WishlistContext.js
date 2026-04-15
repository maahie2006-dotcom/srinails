import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ppn_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ppn_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) { toast.success('Removed from wishlist'); return prev.filter(p => p._id !== product._id); }
      toast.success('Added to wishlist! 🤍');
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some(p => p._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
