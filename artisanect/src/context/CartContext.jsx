import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, addCartItem, updateCartItem, removeCartItem } from "../services/api.js";
import { showSuccessToast, showErrorToast } from "../components/ui/index.js";

const CartContext = createContext(undefined);

/**
 * CartProvider
 * Holds the shopping cart for the session. State updates optimistically
 * in the UI while syncing each change to the backend `/api/cart`
 * endpoints, with a Toast confirming success or surfacing failure.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchCart()
      .then((data) => {
        if (isMounted) setItems(data);
      })
      .catch(() => {
        /* fail silently on initial load — cart just starts empty */
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /** Adds a product to the cart (or increases its quantity if already present). */
  async function addItem(product, quantity = 1) {
    try {
      const item = await addCartItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      });
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === product.id);
        return exists ? prev.map((i) => (i.productId === product.id ? item : i)) : [...prev, item];
      });
      showSuccessToast(`${product.title} added to cart`);
    } catch (err) {
      showErrorToast("Could not add item to cart.");
    }
  }

  /** Removes a product from the cart entirely. */
  async function removeItem(productId) {
    try {
      await removeCartItem(productId);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showSuccessToast("Item removed from cart");
    } catch (err) {
      showErrorToast("Could not remove item from cart.");
    }
  }

  /** Updates the quantity of a cart item; removes it if quantity drops below 1. */
  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeItem(productId);
    try {
      const updated = await updateCartItem(productId, quantity);
      setItems((prev) => prev.map((i) => (i.productId === productId ? updated : i)));
    } catch (err) {
      showErrorToast("Could not update quantity.");
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

/**
 * useCart
 * Hook for accessing cart state and actions.
 * @returns {{ items: object[], isLoading: boolean, addItem: Function, removeItem: Function, updateQuantity: Function, total: number, count: number }}
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
