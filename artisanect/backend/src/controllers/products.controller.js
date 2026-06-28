import {
  getAllProducts,
  getCategories,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
} from "../data/products.js";

/** GET /api/products — list all products (optionally filter by ?category=) */
export function listProducts(req, res) {
  const { category } = req.query;
  let data = getAllProducts();
  if (category) {
    data = data.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  res.status(200).json({ success: true, data });
}

/** GET /api/products/categories — distinct list of categories */
export function listCategories(req, res) {
  res.status(200).json({ success: true, data: getCategories() });
}

/** GET /api/products/search?q=... — search products by title/category/description/artisan */
export function searchProductsHandler(req, res) {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ success: false, message: "Query parameter 'q' is required." });
  }
  res.status(200).json({ success: true, data: searchProducts(q) });
}

/** GET /api/products/:id — get a single product */
export function getProduct(req, res) {
  const id = Number(req.params.id);
  const product = getProductById(id);
  if (!product) {
    return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
  }
  res.status(200).json({ success: true, data: product });
}

/** POST /api/products — create a new product */
export function addProduct(req, res) {
  const { title, category, price } = req.body;

  if (!title || !category || !price) {
    return res.status(400).json({
      success: false,
      message: "Fields 'title', 'category', and 'price' are required.",
    });
  }

  const product = createProduct({ ...req.body, price: Number(req.body.price) });
  res.status(201).json({ success: true, data: product });
}

/** PUT /api/products/:id — update an existing product */
export function editProduct(req, res) {
  const id = Number(req.params.id);
  const updated = updateProduct(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
  }
  res.status(200).json({ success: true, data: updated });
}

/** DELETE /api/products/:id — delete a product */
export function removeProduct(req, res) {
  const id = Number(req.params.id);
  const deleted = deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: `Product with id ${id} not found.` });
  }
  res.status(204).send();
}

/** GET /api/stats — seller dashboard summary stats */
export function dashboardStats(req, res) {
  res.status(200).json({ success: true, data: getStats() });
}
