import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      setTotalAmount(0);
      setTotalItems(0);
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiRequest('/store/cart');
      if (res.success) {
        setCart(res.cart || { items: [] });
        setTotalAmount(res.totalAmount || 0);
        setTotalItems(res.totalItems || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch cart:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) return false;
    try {
      const res = await apiRequest('/store/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.success) {
        setCart(res.cart);
        setTotalAmount(res.totalAmount);
        setTotalItems(res.totalItems);
        return true;
      }
    } catch (err) {
      console.error('addToCart error:', err.message);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await apiRequest('/store/cart', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.success) {
        setCart(res.cart);
        setTotalAmount(res.totalAmount);
        setTotalItems(res.totalItems);
      }
    } catch (err) {
      console.error('updateQuantity error:', err.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await apiRequest(`/store/cart/${productId}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setCart(res.cart);
        setTotalAmount(res.totalAmount);
        setTotalItems(res.totalItems);
      }
    } catch (err) {
      console.error('removeFromCart error:', err.message);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
    setTotalAmount(0);
    setTotalItems(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalAmount,
        totalItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
