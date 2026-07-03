import { Router } from "express";
import {
  getProducts,
  getCategories,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Public read routes — no auth required
router.get("/",              getProducts);
router.get("/categories",    getCategories);
router.get("/search",        searchProducts);
router.get("/:id",           getProductById);

// Crafter-only write routes
router.post("/",    requireAuth, requireRole("crafter"), createProduct);
router.put("/:id",  requireAuth, requireRole("crafter"), updateProduct);
router.delete("/:id", requireAuth, requireRole("crafter"), deleteProduct);

export default router;
