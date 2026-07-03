import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Every cart operation requires authentication — the user's ID
// is taken from the JWT, not from the request body, so one user can
// never read or modify another user's cart.
router.use(requireAuth);

router.get("/",              getCart);
router.post("/",             addToCart);
router.put("/:productId",    updateCartItem);
router.delete("/clear",      clearCart);
router.delete("/:productId", removeFromCart);

export default router;
