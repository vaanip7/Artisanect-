import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Shape a Prisma CartItem + product into what the frontend CartContext expects. */
function formatCartItem(item) {
  return {
    productId: item.productId,
    title:     item.product.title,
    price:     item.product.price,
    image:     item.product.image,
    stock:     item.product.stock,
    quantity:  item.quantity,
  };
}

/** Prisma include to pull the product fields needed by the frontend. */
const WITH_PRODUCT = {
  product: { select: { title: true, price: true, image: true, stock: true } },
};

/**
 * GET /api/cart
 * Returns all cart items for the authenticated user.
 */
export const getCart = asyncHandler(async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where:   { userId: req.user.id },
    include: WITH_PRODUCT,
    orderBy: { createdAt: "asc" },
  });
  res.json({ success: true, data: items.map(formatCartItem) });
});

/**
 * POST /api/cart
 * Add a product to the cart, or increment its quantity if it's already there.
 *
 * Body: { productId, quantity? }
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "productId is required." });
  }

  const pid = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1);

  // Make sure the product actually exists before creating a cart row.
  const product = await prisma.product.findUnique({ where: { id: pid } });
  if (!product) {
    return res.status(404).json({ success: false, message: `Product ${pid} not found.` });
  }

  // upsert: if a row for (user, product) already exists → add to the quantity;
  // if not → create it with the requested quantity.
  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: pid } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data:  { quantity: existing.quantity + qty },
        include: WITH_PRODUCT,
      })
    : await prisma.cartItem.create({
        data:    { userId: req.user.id, productId: pid, quantity: qty },
        include: WITH_PRODUCT,
      });

  res.status(201).json({ success: true, data: formatCartItem(item) });
});

/**
 * PUT /api/cart/:productId
 * Set the quantity for a cart line item.
 * Removing a product from the cart should go through DELETE instead.
 *
 * Body: { quantity }
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const pid = Number(req.params.productId);
  const qty = Number(req.body.quantity);

  if (isNaN(pid) || isNaN(qty) || qty < 1) {
    return res.status(400).json({
      success: false,
      message: "productId must be a number and quantity must be ≥ 1.",
    });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: pid } },
  });

  if (!existing) {
    return res.status(404).json({ success: false, message: `Product ${pid} is not in your cart.` });
  }

  const updated = await prisma.cartItem.update({
    where:   { id: existing.id },
    data:    { quantity: qty },
    include: WITH_PRODUCT,
  });

  res.json({ success: true, data: formatCartItem(updated) });
});

/**
 * DELETE /api/cart/:productId
 * Remove a single product from the cart.
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const pid = Number(req.params.productId);
  if (isNaN(pid)) {
    return res.status(400).json({ success: false, message: "productId must be a number." });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: pid } },
  });

  if (!existing) {
    return res.status(404).json({ success: false, message: `Product ${pid} is not in your cart.` });
  }

  await prisma.cartItem.delete({ where: { id: existing.id } });
  res.json({ success: true, message: `Product ${pid} removed from cart.` });
});

/**
 * DELETE /api/cart
 * Clear the entire cart for the authenticated user.
 */
export const clearCart = asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, message: "Cart cleared." });
});
