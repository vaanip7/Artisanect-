/**
 * In-memory cart store. This is a demo/single-session cart (no real user
 * accounts yet), keyed by product id. A real per-user cart would live in a
 * database keyed by user id once authentication is real (Week 5+).
 */
let cartItems = [];

export function getCart() {
  return cartItems;
}

export function addToCart({ productId, title, price, image, quantity }) {
  const existing = cartItems.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity || 1;
    return existing;
  }
  const item = { productId, title, price, image, quantity: quantity || 1 };
  cartItems.push(item);
  return item;
}

export function updateCartItem(productId, quantity) {
  const item = cartItems.find((i) => i.productId === productId);
  if (!item) return null;
  item.quantity = quantity;
  return item;
}

export function removeFromCart(productId) {
  const index = cartItems.findIndex((i) => i.productId === productId);
  if (index === -1) return false;
  cartItems.splice(index, 1);
  return true;
}
