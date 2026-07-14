import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import { prisma }      from "./src/lib/prisma.js";
import passportConfig  from "./src/config/passport.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";

import authRoutes     from "./src/routes/auth.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import cartRoutes     from "./src/routes/cart.routes.js";
import craftersRoutes from "./src/routes/crafters.routes.js";

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In development: allow localhost:5173
// In production:  allow only FRONTEND_URL from .env
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed.`));
    },
    credentials: true,
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Session (required by Passport even with JWT) ─────────────────────────────
app.use(
  session({
    secret:            process.env.SESSION_SECRET || "artisanect_session_secret",
    resave:            false,
    saveUninitialized: false,
    cookie: {
      secure:   process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge:   24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ─── Passport ─────────────────────────────────────────────────────────────────
app.use(passportConfig.initialize());
app.use(passportConfig.session());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (_req, res) =>
  res.json({ success: true, message: "Artisanect API v3 — Week 6 🎨" })
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
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅  Database connected.");
  } catch (err) {
    console.error("❌  Database connection failed:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀  Artisanect backend on http://localhost:${PORT}`);
    console.log(`🔑  Google OAuth: http://localhost:${PORT}/api/auth/google`);
  });
}

start();
