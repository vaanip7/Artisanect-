import { body, validationResult } from "express-validator";

/**
 * Validation rules for POST /api/ai/generate-description
 */
export const generateDescriptionValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ max: 120 })
    .withMessage("Product name must be under 120 characters."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("material")
    .trim()
    .notEmpty()
    .withMessage("Material is required."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number."),

  body("tags")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Tags must be a comma-separated string."),
];

/**
 * Validation rules for POST /api/ai/chat
 */
export const chatValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("A message is required.")
    .isLength({ max: 1000 })
    .withMessage("Message must be under 1000 characters."),

  body("history")
    .optional()
    .isArray({ max: 20 })
    .withMessage("History must be an array of at most 20 prior turns."),
];

/**
 * Validation rules for POST /api/ai/search
 */
export const aiSearchValidation = [
  body("query")
    .trim()
    .notEmpty()
    .withMessage("A search query is required.")
    .isLength({ max: 200 })
    .withMessage("Search query must be under 200 characters."),
];

/**
 * Middleware — reads express-validator results and returns 400 if any rule failed.
 * Call this AFTER the validation rule array in the route definition.
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
