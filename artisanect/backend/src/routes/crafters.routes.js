import { Router } from "express";
import {
  getCrafterProducts,
  uploadProduct,
  getCrafterOrders,
  getCrafterStats,
} from "../controllers/crafters.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// All crafter routes require a CRAFTER-role account
router.use(requireAuth, requireRole("crafter"));

router.get("/products",     getCrafterProducts);
router.post("/products",    uploadProduct);
router.get("/orders",       getCrafterOrders);
router.get("/stats",        getCrafterStats);

export default router;
