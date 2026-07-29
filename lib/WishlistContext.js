"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "./constants";
import { useCustomerAuth } from "./CustomerAuthContext";

const WISHLIST_KEY = "sadaar_wishlist";

function getWishlistIds() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setWishlistIds(ids) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

const WishlistContext = createContext({ wishlistIds: [], toggleWishlist: () => {} });

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { customerToken } = useCustomerAuth();
  const [wishlistIds, setWishlistIdsState] = useState([]);

  // Load the right wishlist source once mounted client-side: server-synced
  // if logged in, this device's localStorage otherwise.
  useEffect(() => {
    if (customerToken) {
      api("/customers/me/wishlist", {}, customerToken)
        .then((rows) => setWishlistIdsState(rows.map((p) => p.id)))
        .catch(() => {});
    } else {
      setWishlistIdsState(getWishlistIds());
    }
  }, [customerToken]);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIdsState((prev) => {
      const wasWishlisted = prev.includes(productId);
      const next = wasWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (customerToken) {
        const request = wasWishlisted
          ? api(`/customers/me/wishlist/${productId}`, { method: "DELETE" }, customerToken)
          : api("/customers/me/wishlist", { method: "POST", body: JSON.stringify({ productId }) }, customerToken);
        request.catch(() => {});
      } else {
        setWishlistIds(next);
      }
      return next;
    });
  }, [customerToken]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
