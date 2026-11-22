"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext({ cart: [], addToCart: () => {}, updateQty: () => {}, removeItem: () => {}, clearCart: () => {} });

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Restore the saved cart after the first render (avoids a hydration mismatch).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sadaar_cart") || "[]");
      if (Array.isArray(saved) && saved.length) setCart(saved);
    } catch (e) {}
    setLoaded(true);
  }, []);

  // Save on every change, but only once the saved cart has been restored.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("sadaar_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart, loaded]);

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
