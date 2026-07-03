import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

/**
 * requireAuth
 * Verifies the `Authorization: Bearer <token>` header, loads the
 * corresponding user from the database, and attaches it to `req.user`
 * for downstream handlers. Responds 401 if the header is missing, the
 * token is invalid/expired, or the user it refers to no longer exists.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Session is no longer valid. Please log in again." });
    }

    req.user = user; // includes the hashed password — controllers must never echo req.user back directly
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session. Please log in again." });
  }
}

/**
 * requireRole
 * Must run after requireAuth. Responds 403 if the authenticated user's
 * role doesn't match the one required for this route (e.g. a customer
 * trying to hit a crafter-only endpoint).
 *
 * @param {"customer"|"crafter"} role
 */
export function requireRole(role) {
  const target = String(role).toUpperCase();
  return (req, res, next) => {
    if (!req.user || req.user.role !== target) {
      return res.status(403).json({
        success: false,
        message: `This action requires a ${target.toLowerCase()} account.`,
      });
    }
    next();
  };
}
