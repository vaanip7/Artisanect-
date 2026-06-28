import { getCart, addToCart, updateCartItem, removeFromCart } from "../data/cart.js";

/** GET /api/cart — list current cart items */
export function listCart(req, res) {
  res.status(200).json({ success: true, data: getCart() });
}

/** POST /api/cart — add an item to the cart */
export function addCartItem(req, res) {
  const { productId, title, price, image, quantity } = req.body;

  if (!productId || !title || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "Fields 'productId', 'title', and 'price' are required.",
    });
  }

  const item = addToCart({ productId, title, price, image, quantity });
  res.status(201).json({ success: true, data: item });
}

/** PUT /api/cart/:id — update the quantity of a cart item (id = productId) */
export function editCartItem(req, res) {
  const productId = Number(req.params.id);
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ success: false, message: "A valid 'quantity' (>= 1) is required." });
  }

  const updated = updateCartItem(productId, quantity);
  if (!updated) {
    return res.status(404).json({ success: false, message: `Cart item ${productId} not found.` });
  }
  res.status(200).json({ success: true, data: updated });
}

/** DELETE /api/cart/:id — remove an item from the cart (id = productId) */
export function deleteCartItem(req, res) {
  const productId = Number(req.params.id);
  const deleted = removeFromCart(productId);
  if (!deleted) {
    return res.status(404).json({ success: false, message: `Cart item ${productId} not found.` });
  }
  res.status(204).send();
}
