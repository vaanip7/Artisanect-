import React, { createContext, useContext, useEffect, useState } from "react";
import { showSuccessToast } from "../components/ui/index.js";

const WishlistContext = createContext(undefined);
const STORAGE_KEY = "artisanect-wishlist";

/**
 * WishlistProvider
 * Tracks wishlisted product ids, persisted to localStorage so the
 * wishlist survives a page refresh.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  /** Adds or removes a product id from the wishlist. */
  function toggleWishlist(product) {
    setIds((prev) => {
      const isWishlisted = prev.includes(product.id);
      if (isWishlisted) {
        showSuccessToast(`${product.title} removed from wishlist`);
        return prev.filter((id) => id !== product.id);
      }
      showSuccessToast(`${product.title} added to wishlist`);
      return [...prev, product.id];
    });
  }

  /** Whether a given product id is currently wishlisted. */
  function isWishlisted(id) {
    return ids.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ ids, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * useWishlist
 * Hook for accessing wishlist state and actions.
 * @returns {{ ids: number[], toggleWishlist: (product: object) => void, isWishlisted: (id: number) => boolean }}
 */
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
