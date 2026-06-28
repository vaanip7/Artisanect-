import express from "express";
import {
  listProducts,
  listCategories,
  searchProductsHandler,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  dashboardStats,
} from "../controllers/products.controller.js";

const router = express.Router();

// NOTE: literal sub-paths must be declared before /:id so Express doesn't
// treat "search"/"categories" as an :id param.
router.get("/products/search", searchProductsHandler);
router.get("/products/categories", listCategories);
router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.post("/products", addProduct);
router.put("/products/:id", editProduct);
router.delete("/products/:id", removeProduct);

router.get("/stats", dashboardStats);

export default router;
