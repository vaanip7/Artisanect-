import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./src/routes/products.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import crafterRoutes from "./src/routes/crafters.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import { notFoundHandler, errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Artisanect API is running." });
});

app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", crafterRoutes);
app.use("/api", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Artisanect backend listening on http://localhost:${PORT}`);
});
