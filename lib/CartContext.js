"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext({ cart: [], addToCart: () => {}, updateQty: () => {}, removeItem: () => {}, clearCart: () => {} });

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product, variant, qty) => {
    setCart((prev) => [...prev, { product, variant, qty }]);
  }, []);

  const updateQty = useCallback((index, delta) => {
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item)));
  }, []);

  const removeItem = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
