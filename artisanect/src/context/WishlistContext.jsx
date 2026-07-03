import React, { createContext, useContext, useEffect, useState } from "react";
import { showSuccessToast } from "../components/ui/index.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(undefined);

function storageKey(userId) {
  return userId ? `artisanect-wishlist-${userId}` : "artisanect-wishlist-guest";
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const key = storageKey(user?.id);

  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  });

  // When user changes (login/logout) reload the correct wishlist
  useEffect(() => {
    try { setIds(JSON.parse(localStorage.getItem(storageKey(user?.id))) || []); } catch { setIds([]); }
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(ids));
  }, [ids, key]);

  function toggleWishlist(product) {
    setIds(prev => {
      if (prev.includes(product.id)) {
        showSuccessToast(`${product.title} removed from wishlist`);
        return prev.filter(id => id !== product.id);
      }
      showSuccessToast(`${product.title} added to wishlist`);
      return [...prev, product.id];
    });
  }

  function isWishlisted(id) { return ids.includes(id); }

  return (
    <WishlistContext.Provider value={{ ids, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (ctx === undefined) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
