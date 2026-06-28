import express from "express";
import { listCrafterProducts, addCrafterProduct } from "../controllers/crafters.controller.js";

const router = express.Router();

router.get("/crafters/products", listCrafterProducts);
router.post("/crafters/products", addCrafterProduct);

export default router;
