import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { generateDescription, chat, aiSearch } from "../controllers/ai.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  generateDescriptionValidation,
  chatValidation,
  aiSearchValidation,
  handleValidationErrors,
} from "../validations/aiValidation.js";

const router = Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────
// AI calls hit a paid, external API — rate limit generously but firmly to
// protect the Gemini quota/bill from abuse or runaway frontend loops.

/** Chat + search: 20 requests / minute / IP. */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a moment and try again.",
  },
});

/** Description generation: 10 requests / minute / IP — slightly stricter
 * since it's a heavier structured-output prompt. */
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many generation requests. Please wait a moment and try again.",
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/ai/generate-description
 * Crafter-only — powers the "✨ Generate with AI" button on Upload Product.
 */
router.post(
  "/generate-description",
  requireAuth,
  requireRole("crafter"),
  generateLimiter,
  generateDescriptionValidation,
  handleValidationErrors,
  generateDescription
);

/**
 * POST /api/ai/chat
 * Open to any visitor (guest or logged in) — the assistant only needs to
 * answer general questions about handmade products, artisans, and shopping.
 */
router.post(
  "/chat",
  aiLimiter,
  chatValidation,
  handleValidationErrors,
  chat
);

/**
 * POST /api/ai/search
 * Open to any visitor — powers the natural-language search bar on Shop.
 */
router.post(
  "/search",
  aiLimiter,
  aiSearchValidation,
  handleValidationErrors,
  aiSearch
);

export default router;
