import { body, validationResult } from "express-validator";

/**
 * Validation rules for POST /api/auth/register
 */
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),

  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["CUSTOMER", "CRAFTER", "customer", "crafter"])
    .withMessage("Role must be either CUSTOMER or CRAFTER."),
];

/**
 * Validation rules for POST /api/auth/login
 */
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
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
      message: errors.array()[0].msg, // return the first error message
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
