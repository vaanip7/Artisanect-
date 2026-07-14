import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import passport from "passport";

import {
  register,
  login,
  getMe,
  updateMe,
  googleCallback,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} from "../validations/authValidation.js";

const router = Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────

/**
 * Applied to login + register — 5 attempts per 15 minutes per IP.
 * This slows down brute-force and credential-stuffing attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});

// ─── Public routes ────────────────────────────────────────────────────────────

// Register: validate input → check rate limit → create user
router.post(
  "/register",
  authLimiter,
  registerValidation,
  handleValidationErrors,
  register
);

// Login: validate input → check rate limit → authenticate
router.post(
  "/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  login
);

// ─── Google OAuth ─────────────────────────────────────────────────────────────

// Step 1 — redirect user to Google consent screen
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2 — Google redirects back here after user consents
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed`,
    session: false,
  }),
  googleCallback
);

// ─── Protected routes ─────────────────────────────────────────────────────────

router.get("/me",  requireAuth, getMe);
router.put("/me",  requireAuth, updateMe);

export default router;
