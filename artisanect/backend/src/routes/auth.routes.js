import { Router } from "express";
import { register, login, getMe, updateMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/register", register);
router.post("/login",    login);

// Protected — any logged-in user
router.get("/me",  requireAuth, getMe);
router.put("/me",  requireAuth, updateMe);

export default router;
