import express from "express";
import { listCart, addCartItem, editCartItem, deleteCartItem } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart", listCart);
router.post("/cart", addCartItem);
router.put("/cart/:id", editCartItem);
router.delete("/cart/:id", deleteCartItem);

export default router;
