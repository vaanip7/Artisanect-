/** Catches requests to undefined routes. */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

/**
 * Centralised error handler — catches anything passed to next(err),
 * including rejected promises forwarded by asyncHandler. Translates
 * common Prisma error codes into clean, friendly responses instead of a
 * raw 500 with a stack trace leaking to the client.
 */
export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // P2002: unique constraint violation (e.g. an email or a duplicate
  // cart/wishlist row for the same user+product pair).
  if (err.code === "P2002") {
    const fields = err.meta?.target?.join(", ") || "value";
    return res.status(409).json({ success: false, message: `A record with that ${fields} already exists.` });
  }

  // P2025: the row a findUnique/update/delete expected to find doesn't exist.
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "The requested record was not found." });
  }

  // P2003: foreign key constraint failed (e.g. productId doesn't exist).
  if (err.code === "P2003") {
    return res.status(400).json({ success: false, message: "This action references a record that doesn't exist." });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
}
