import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── helpers ──────────────────────────────────────────────────────────────────

function safeUser(user) {
  const { password, googleId, ...rest } = user;
  return rest;
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

/**
 * Register a new user.
 * Validation is handled upstream by express-validator (authValidation.js).
 * Returns 201 on success, 400 if the email is already taken.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, craft } = req.body;

  const normalizedRole = String(role).toUpperCase();

  // Check duplicate email
  const existing = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already exists." });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name:  String(name).trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role:  normalizedRole,
      craft: craft ? String(craft).trim() : null,
    },
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data:    { user: safeUser(user), token },
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

/**
 * Login with email + password.
 * Returns a JWT on success, 401 on bad credentials.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  // Constant-time comparison even when user doesn't exist
  const dummyHash = "$2a$12$invalidhashtopreventtimingattacks000000000000000000000";
  const passwordMatch = user && user.password
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash).then(() => false);

  if (!user || !passwordMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const token = signToken(user);

  res.json({
    success: true,
    message: "Logged in successfully.",
    data:    { user: safeUser(user), token },
  });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: safeUser(req.user) } });
});

// ─── PUT /api/auth/me ─────────────────────────────────────────────────────────

export const updateMe = asyncHandler(async (req, res) => {
  const { name, craft } = req.body;
  const data = {};
  if (name)             data.name  = String(name).trim();
  if (craft !== undefined) data.craft = craft ? String(craft).trim() : null;

  if (!Object.keys(data).length) {
    return res.status(400).json({ success: false, message: "Provide at least one field to update." });
  }

  const updated = await prisma.user.update({ where: { id: req.user.id }, data });
  res.json({ success: true, data: { user: safeUser(updated) } });
});

// ─── Google OAuth callback ────────────────────────────────────────────────────

/**
 * GET /api/auth/google/callback  (called by Passport after Google consent)
 *
 * By the time this runs, passport.authenticate('google') has already:
 *  - exchanged the code for a Google profile
 *  - run our GoogleStrategy verify callback which found/created the user
 *  - attached the user to req.user
 *
 * We sign a JWT and redirect to the frontend with it in the URL.
 * The frontend reads it from the query string and stores it in localStorage.
 */
export const googleCallback = asyncHandler(async (req, res) => {
  const user  = req.user;
  const token = signToken(user);

  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

  // Pass the token and a minimal user summary as URL params so the
  // React app can pick them up on the /auth/callback page.
  const params = new URLSearchParams({
    token,
    id:    user.id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  });

  res.redirect(`${frontendURL}/auth/callback?${params.toString()}`);
});
