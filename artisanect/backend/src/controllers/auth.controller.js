import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Strip the password hash before sending any user object to the client. */
function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

/**
 * Sign a JWT for the given user.
 * Sub-claim carries the user's UUID so we can reload the user on every
 * authenticated request without embedding any mutable state in the token.
 */
function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/**
 * POST /api/auth/register
 * Create a new customer or crafter account.
 *
 * Body: { name, email, password, role: "CUSTOMER"|"CRAFTER", craft? }
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, craft } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "name, email, password and role are all required.",
    });
  }

  const validRoles = ["CUSTOMER", "CRAFTER"];
  const normalizedRole = String(role).toUpperCase();
  if (!validRoles.includes(normalizedRole)) {
    return res.status(400).json({
      success: false,
      message: `role must be one of: ${validRoles.join(", ")}.`,
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "password must be at least 6 characters.",
    });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: hashed,
      role: normalizedRole,
      craft: craft ? String(craft).trim() : null,
    },
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: { user: safeUser(user), token },
  });
});

/**
 * POST /api/auth/login
 * Authenticate with email + password. Returns a JWT and the user profile.
 *
 * Body: { email, password }
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required.",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  });

  // Use a constant-time compare even on the "not found" path to prevent
  // timing attacks that reveal whether an email address is registered.
  const dummyHash = "$2a$12$invalidhashtopreventtimingattack";
  const passwordMatch = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash).then(() => false);

  if (!user || !passwordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = signToken(user);

  res.json({
    success: true,
    message: "Logged in successfully.",
    data: { user: safeUser(user), token },
  });
});

/**
 * GET /api/auth/me
 * Return the profile of the currently authenticated user.
 * Requires: requireAuth middleware (sets req.user).
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: safeUser(req.user) },
  });
});

/**
 * PUT /api/auth/me
 * Update the authenticated user's own profile (name, craft only —
 * password changes require a dedicated flow to prompt the old password).
 *
 * Body: { name?, craft? }
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, craft } = req.body;
  const data = {};
  if (name) data.name = String(name).trim();
  if (craft !== undefined) data.craft = craft ? String(craft).trim() : null;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update (name, craft).",
    });
  }

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data,
  });

  res.json({ success: true, data: { user: safeUser(updated) } });
});
