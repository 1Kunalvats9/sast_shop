'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload;
    case 'ADD_TO_CART':
      // Create a unique identifier for products with variants
      const getItemId = (item) => {
        if (item.selectedSize || item.selectedColor) {
          return `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
        }
        return item._id;
      };

      const newItemId = getItemId(action.payload);
      const existingItemIndex = state.findIndex(item => getItemId(item) === newItemId);
      
      if (existingItemIndex > -1) {
        const updatedCart = [...state];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'UPDATE_QUANTITY':
      return state.map(item => {
        const itemId = item.selectedSize || item.selectedColor 
          ? `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`
          : item._id;
        return itemId === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item;
      });
    case 'REMOVE_FROM_CART':
      return state.filter(item => {
        const itemId = item.selectedSize || item.selectedColor 
          ? `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`
          : item._id;
        return itemId !== action.payload;
      });
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
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