import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Re-use the same product formatter as the main products controller. */
function formatProduct(p) {
  return {
    id:               p.id,
    title:            p.title,
    category:         p.category,
    description:      p.description,
    price:            p.price,
    rating:           p.rating,
    stock:            p.stock,
    image:            p.image,
    images:           p.images.length ? p.images : [p.image],
    materials:        p.materials,
    tags:             p.tags,
    dimensions:       p.dimensions ?? "",
    deliveryEstimate: p.deliveryEstimate ?? "5–7 business days",
    featured:         p.featured,
    artisanName:      p.crafter?.name ?? "Artisanect Maker",
    crafterId:        p.crafterId,
    createdAt:        p.createdAt,
    updatedAt:        p.updatedAt,
  };
}

const WITH_CRAFTER = { crafter: { select: { id: true, name: true } } };

/**
 * GET /api/crafters/products
 * Returns all products belonging to the authenticated crafter.
 */
export const getCrafterProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where:   { crafterId: req.user.id },
    include: WITH_CRAFTER,
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: products.map(formatProduct) });
});

/**
 * POST /api/crafters/products
 * Upload / create a new product for the authenticated crafter.
 * This is a convenience alias of POST /api/products that skips the
 * role-check in the products route (the crafter route already has it).
 */
export const uploadProduct = asyncHandler(async (req, res) => {
  const {
    title, category, description, price, stock,
    image, images, materials, tags, dimensions, deliveryEstimate, featured,
  } = req.body;

  if (!title || !category || !description || price == null || !image) {
    return res.status(400).json({
      success: false,
      message: "title, category, description, price and image are required.",
    });
  }

  const product = await prisma.product.create({
    data: {
      title:            String(title).trim(),
      category:         String(category).trim(),
      description:      String(description).trim(),
      price:            Number(price),
      stock:            Number(stock) || 0,
      image:            String(image),
      images:           Array.isArray(images) && images.length ? images : [String(image)],
      materials:        Array.isArray(materials) ? materials : [],
      tags:             Array.isArray(tags)      ? tags      : [],
      dimensions:       dimensions       ? String(dimensions)       : null,
      deliveryEstimate: deliveryEstimate ? String(deliveryEstimate) : null,
      featured:         Boolean(featured),
      crafterId:        req.user.id,
    },
    include: WITH_CRAFTER,
  });

  res.status(201).json({ success: true, data: formatProduct(product) });
});

/**
 * GET /api/crafters/orders
 * Returns a realistic-looking list of incoming orders for the crafter's
 * products. This is still simulated data (a real order system is a Week 6+
 * feature) but the data is now consistent with the seeded product catalog
 * instead of being totally random.
 */
export const getCrafterOrders = asyncHandler(async (req, res) => {
  // Pull actual product IDs belonging to this crafter so the order list
  // is plausibly linked to real products.
  const crafterProducts = await prisma.product.findMany({
    where:  { crafterId: req.user.id },
    select: { id: true, title: true, price: true },
    take:   5,
  });

  const customerNames = [
    "Aarav Mehta", "Priya Sharma", "Rohit Gupta", "Sneha Patel",
    "Amit Joshi", "Divya Nair", "Vijay Reddy", "Kavya Iyer",
  ];
  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

  const orders = crafterProducts.flatMap((p, pi) =>
    Array.from({ length: 2 }).map((_, i) => ({
      id:          `ORD-${String(Date.now() - pi * 86400000 - i * 3600000).slice(-6)}`,
      product:     p.title,
      productId:   p.id,
      customer:    customerNames[(pi * 2 + i) % customerNames.length],
      quantity:    (i + 1),
      total:       p.price * (i + 1),
      status:      statuses[(pi + i) % statuses.length],
      orderedAt:   new Date(Date.now() - (pi * 2 + i) * 86400000).toISOString(),
    }))
  );

  res.json({ success: true, data: orders });
});

/**
 * GET /api/crafters/stats
 * Aggregate stats for the crafter's dashboard.
 */
export const getCrafterStats = asyncHandler(async (req, res) => {
  const [productCount, totalStockResult] = await Promise.all([
    prisma.product.count({ where: { crafterId: req.user.id } }),
    prisma.product.aggregate({
      where: { crafterId: req.user.id },
      _sum:  { stock: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts: productCount,
      totalStock:    totalStockResult._sum.stock ?? 0,
      totalOrders:   productCount * 4,      // simulated until order system is built
      revenue:       productCount * 2800,   // simulated average
    },
  });
});
