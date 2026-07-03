import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCart,
  addToCart     as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
} from "../services/api.js";
import { showSuccessToast, showErrorToast } from "../components/ui/index.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(undefined);

/**
 * CartProvider
 *
 * Syncs the shopping cart with the backend on every meaningful auth-state
 * change (login / logout). When no user is authenticated the cart is
 * empty and all mutating actions are no-ops that surface a friendly
 * "please log in" message instead of a hard crash.
 *
 * Cart data now persists across browser refreshes because it lives in
 * the PostgreSQL database instead of in-memory — a key Week 5 upgrade.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [items,     setItems]     = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Re-fetch the cart from the backend whenever the logged-in user changes.
  // If the user logs out (user → null) we just empty the local state —
  // no network call needed because GET /api/cart would return 401 anyway.
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchCart()
      .then((data) => { if (isMounted) setItems(data); })
      .catch(() => { /* fail silently — cart starts empty if the fetch fails */ })
      .finally(() => { if (isMounted) setIsLoading(false); });

    return () => { isMounted = false; };
  }, [isAuthenticated, user?.id]);

  /** Adds a product to the cart (or increases quantity if already there). */
  async function addItem(product, quantity = 1) {
    if (!isAuthenticated) {
      showErrorToast("Please log in to add items to your cart.");
      return;
    }
    try {
      const item = await apiAddToCart(product.id, quantity);
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === product.id);
        return exists
          ? prev.map((i) => (i.productId === product.id ? item : i))
          : [...prev, item];
      });
      showSuccessToast(`${product.title} added to cart`);
    } catch (err) {
      showErrorToast(err.message || "Could not add item to cart.");
    }
  }

  /** Removes a product from the cart entirely. */
  async function removeItem(productId) {
    try {
      await apiRemoveFromCart(productId);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showSuccessToast("Item removed from cart");
    } catch (err) {
      showErrorToast(err.message || "Could not remove item from cart.");
    }
  }

  /** Sets the quantity of a cart item; removes it if quantity drops to 0. */
  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeItem(productId);
    try {
      const updated = await apiUpdateCartItem(productId, quantity);
      setItems((prev) => prev.map((i) => (i.productId === productId ? updated : i)));
    } catch (err) {
      showErrorToast(err.message || "Could not update quantity.");
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isLoading, addItem, removeItem, updateQuantity, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
