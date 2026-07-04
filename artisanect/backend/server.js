import "dotenv/config";
import express from "express";
import cors from "cors";

import { prisma } from "./src/lib/prisma.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";

import authRoutes     from "./src/routes/auth.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import cartRoutes     from "./src/routes/cart.routes.js";
import craftersRoutes from "./src/routes/crafters.routes.js";

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Core middleware ───────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

// 10 MB limit to accommodate base64-encoded product images uploaded by crafters
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/", (_req, res) =>
  res.json({ success: true, message: "Artisanect API is running. 🎨" })
);

app.use("/api/auth",     authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/crafters", craftersRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Boot ─────────────────────────────────────────────────────────────────────

async function start() {
  try {
    // Quick connectivity check — $queryRaw does a round-trip to the DB and
    // throws immediately if the connection string or credentials are wrong.
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅  Database connected.");
  } catch (err) {
    console.error("❌  Database connection failed:", err.message);
    console.error("    Make sure DATABASE_URL in backend/.env points to a running PostgreSQL instance");
    console.error("    and that you have run:  npx prisma migrate deploy && npx prisma db seed");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀  Artisanect backend listening on http://localhost:${PORT}`);
  });
}

start();
