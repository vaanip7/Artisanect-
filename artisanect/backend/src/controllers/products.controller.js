import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Shape the raw Prisma product record into the object the frontend expects.
 * Crucially: `artisanName` is derived from the joined `crafter.name` field
 * so the frontend ProductCard and ProductDetails don't need to change.
 *
 * @param {object} p - Prisma product with crafter included
 * @returns {object}
 */
function formatProduct(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    price: p.price,
    rating: p.rating,
    stock: p.stock,
    image: p.image,
    images: p.images.length ? p.images : [p.image],
    materials: p.materials,
    tags: p.tags,
    dimensions: p.dimensions ?? "",
    deliveryEstimate: p.deliveryEstimate ?? "5–7 business days",
    featured: p.featured,
    artisanName: p.crafter?.name ?? "Artisanect Maker",
    crafterId: p.crafterId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

/** Prisma include fragment reused across queries that need artisanName. */
const WITH_CRAFTER = { crafter: { select: { id: true, name: true } } };

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

/**
 * GET /api/products
 * Returns the full catalog, optionally filtered by category.
 * Query: ?category=Pottery&featured=true
 */
export const getProducts = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.category) where.category = req.query.category;
  if (req.query.featured === "true") where.featured = true;

  const products = await prisma.product.findMany({
    where,
    include: WITH_CRAFTER,
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: products.map(formatProduct) });
});

/**
 * GET /api/products/categories
 * Returns a deduplicated, sorted list of category strings.
 */
export const getCategories = asyncHandler(async (req, res) => {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  res.json({ success: true, data: rows.map((r) => r.category) });
});

/**
 * GET /api/products/search?q=clay
 * Full-text-style search across title, description, category, artisan name.
 */
export const searchProducts = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ success: false, message: "q query parameter is required." });
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { crafter: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: WITH_CRAFTER,
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, data: products.map(formatProduct) });
});

/**
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Product id must be a number." });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: WITH_CRAFTER,
  });

  if (!product) {
    return res.status(404).json({ success: false, message: `Product ${id} not found.` });
  }

  res.json({ success: true, data: formatProduct(product) });
});

// ─────────────────────────────────────────────
// WRITE (CRAFTER-ONLY via routes middleware)
// ─────────────────────────────────────────────

/**
 * POST /api/products
 * Create a new product. Only the authenticated crafter's own ID is used —
 * the client cannot spoof crafterId.
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, category, description, price, stock, image, images,
          materials, tags, dimensions, deliveryEstimate, featured } = req.body;

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
 * PUT /api/products/:id
 * Update an existing product.
 * A crafter can only update their own products.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Product id must be a number." });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ success: false, message: `Product ${id} not found.` });
  }
  if (existing.crafterId !== req.user.id) {
    return res.status(403).json({ success: false, message: "You can only edit your own products." });
  }

  const { title, category, description, price, stock, image, images,
          materials, tags, dimensions, deliveryEstimate, featured } = req.body;

  const data = {};
  if (title        !== undefined) data.title            = String(title).trim();
  if (category     !== undefined) data.category         = String(category).trim();
  if (description  !== undefined) data.description      = String(description).trim();
  if (price        !== undefined) data.price            = Number(price);
  if (stock        !== undefined) data.stock            = Number(stock);
  if (image        !== undefined) data.image            = String(image);
  if (images       !== undefined) data.images           = Array.isArray(images) ? images : [String(image || existing.image)];
  if (materials    !== undefined) data.materials        = Array.isArray(materials) ? materials : [];
  if (tags         !== undefined) data.tags             = Array.isArray(tags)      ? tags      : [];
  if (dimensions   !== undefined) data.dimensions       = dimensions   ? String(dimensions)   : null;
  if (deliveryEstimate !== undefined) data.deliveryEstimate = deliveryEstimate ? String(deliveryEstimate) : null;
  if (featured     !== undefined) data.featured         = Boolean(featured);

  const updated = await prisma.product.update({
    where: { id },
    data,
    include: WITH_CRAFTER,
  });

  res.json({ success: true, data: formatProduct(updated) });
});

/**
 * DELETE /api/products/:id
 * A crafter can only delete their own products.
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Product id must be a number." });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ success: false, message: `Product ${id} not found.` });
  }
  if (existing.crafterId !== req.user.id) {
    return res.status(403).json({ success: false, message: "You can only delete your own products." });
  }

  await prisma.product.delete({ where: { id } });
  res.json({ success: true, message: `Product ${id} deleted.` });
});
