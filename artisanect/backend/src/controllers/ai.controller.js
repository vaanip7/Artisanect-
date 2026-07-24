import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../lib/prisma.js";
import {
  generateProductCopy,
  chatReply,
  extractSearchIntent,
} from "../services/gemini.service.js";

/** Same product shape used by products.controller.js so the frontend
 * gets identically-shaped results whether it hits /products/search or
 * /ai/search. */
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

const WITH_CRAFTER = { crafter: { select: { id: true, name: true } } };

/**
 * POST /api/ai/generate-description
 * Body: { name, category, material, price, tags? }
 * Returns AI-generated title, description, and selling highlights for a
 * crafter's product listing. Used by the "✨ Generate with AI" button on
 * the Upload Product page.
 */
export const generateDescription = asyncHandler(async (req, res) => {
  const { name, category, material, price, tags } = req.body;

  const copy = await generateProductCopy({ name, category, material, price, tags });

  res.status(200).json({ success: true, data: copy });
});

/**
 * POST /api/ai/chat
 * Body: { message, history?: [{ role: "user"|"assistant", content }] }
 * Returns a single assistant reply, scoped to Artisanect-relevant topics.
 */
export const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const reply = await chatReply(message, Array.isArray(history) ? history : []);

  res.status(200).json({ success: true, data: { reply } });
});

/**
 * POST /api/ai/search
 * Body: { query }
 * Converts a natural-language query into optimized keywords via Gemini,
 * then reuses the same Prisma product search the keyword-search endpoint
 * uses, optionally applying a price ceiling parsed from the query.
 */
export const aiSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  const { keywords, maxPrice } = await extractSearchIntent(query);

  const words = keywords.split(/\s+/).filter(Boolean);

  const where = {
    OR: [
      { title: { contains: keywords, mode: "insensitive" } },
      { description: { contains: keywords, mode: "insensitive" } },
      { category: { contains: keywords, mode: "insensitive" } },
      { crafter: { name: { contains: keywords, mode: "insensitive" } } },
      // The DB search is literal substring matching, but Gemini often
      // returns multi-word keyword phrases (e.g. "eco-friendly decor")
      // that won't appear verbatim in any single field. Also match each
      // individual word against title, description, and category so a
      // product whose description says "Eco-friendly..." still matches
      // a "eco-friendly decor" query even though the exact phrase doesn't
      // appear anywhere.
      ...words.flatMap((word) => [
        { title: { contains: word, mode: "insensitive" } },
        { description: { contains: word, mode: "insensitive" } },
        { category: { contains: word, mode: "insensitive" } },
      ]),
    ],
  };

  let products = await prisma.product.findMany({
    where,
    include: WITH_CRAFTER,
    orderBy: { createdAt: "desc" },
  });

  if (maxPrice != null) {
    products = products.filter((p) => Number(p.price) <= maxPrice);
  }

  res.status(200).json({
    success: true,
    data: products.map(formatProduct),
    meta: { interpretedKeywords: keywords, maxPrice },
  });
});
