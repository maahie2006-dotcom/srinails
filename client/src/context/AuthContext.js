import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ppn_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/me')
        .then(res => {
          setUser(res.data);
          
          if (res.data.cart) localStorage.setItem('ppn_cart', JSON.stringify(res.data.cart));
          if (res.data.wishlist) localStorage.setItem('ppn_wishlist', JSON.stringify(res.data.wishlist));
        })
        .catch(() => {
          handleStorageCleanup();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleStorageCleanup = () => {
    localStorage.removeItem('ppn_token');
    localStorage.removeItem('ppn_cart');
    localStorage.removeItem('ppn_wishlist');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    
    
    localStorage.setItem('ppn_token', data.token);
    
    
    if (data.user.cart) {
      localStorage.setItem('ppn_cart', JSON.stringify(data.user.cart));
    }
    if (data.user.wishlist) {
      localStorage.setItem('ppn_wishlist', JSON.stringify(data.user.wishlist));
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);

    
    window.location.href = '/account'; 
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    localStorage.setItem('ppn_token', data.token);
    
    
    localStorage.setItem('ppn_cart', JSON.stringify([]));
    localStorage.setItem('ppn_wishlist', JSON.stringify([]));

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    
    window.location.href = '/account';
    return data.user;
  };

  const logout = () => {
    handleStorageCleanup();
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};