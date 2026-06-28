import { getProductsByCrafter, createProduct } from "../data/products.js";

// Demo-only: there's no real multi-account auth yet, so every "crafter"
// session is treated as this one dummy crafter id.
const DEMO_CRAFTER_ID = "demo-crafter";

/** GET /api/crafters/products — products belonging to the logged-in crafter */
export function listCrafterProducts(req, res) {
  const data = getProductsByCrafter(DEMO_CRAFTER_ID);
  res.status(200).json({ success: true, data });
}

/** POST /api/crafters/products — crafter uploads a new product */
export function addCrafterProduct(req, res) {
  const { title, category, price } = req.body;

  if (!title || !category || !price) {
    return res.status(400).json({
      success: false,
      message: "Fields 'title', 'category', and 'price' are required.",
    });
  }

  const product = createProduct({
    ...req.body,
    price: Number(req.body.price),
    crafterId: DEMO_CRAFTER_ID,
  });

  res.status(201).json({ success: true, data: product });
}
