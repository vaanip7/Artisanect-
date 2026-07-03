/**
 * Artisanect Database Seed
 * ─────────────────────────
 * Run via:  npx prisma db seed
 *
 * What this does
 * ──────────────
 * 1. Wipes all existing data (in dependency order to respect FK constraints).
 * 2. Creates two primary demo accounts the evaluator can use immediately:
 *      Customer  →  customer@artisanect.com  /  Customer@123
 *      Crafter   →  crafter@artisanect.com   /  Crafter@123
 * 3. Creates one CRAFTER account per unique artisan name in products.json
 *    so product ownership is always accurate in the database.
 * 4. Seeds all 24 products from products.json, each linked to its named
 *    artisan's User row via crafterId.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const prisma     = new PrismaClient();

// ─── helpers ──────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

function slugEmail(name) {
  return name.toLowerCase().replace(/\s+/g, ".") + "@artisanect.com";
}

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Seeding Artisanect database …\n");

  // 1. Wipe in reverse-dependency order ──────────────────────────────────────
  console.log("  → Clearing existing data …");
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2. Load product seed data ─────────────────────────────────────────────────
  const productsJson = JSON.parse(
    readFileSync(path.join(__dirname, "seed-data", "products.json"), "utf-8")
  );

  // 3. Collect unique artisan names ───────────────────────────────────────────
  const artisanNames = [...new Set(productsJson.map((p) => p.artisanName))];
  console.log(`  → Found ${artisanNames.length} unique artisans: ${artisanNames.join(", ")}\n`);

  // 4. Create the primary demo customer ──────────────────────────────────────
  console.log("  → Creating demo customer account …");
  const demoCustomer = await prisma.user.create({
    data: {
      id:       "demo-customer",
      name:     "Asha Mehta",
      email:    "customer@artisanect.com",
      password: await hashPassword("Customer@123"),
      role:     "CUSTOMER",
    },
  });
  console.log(`     ✓ Customer  ${demoCustomer.email}  (id: ${demoCustomer.id})`);

  // 5. Create one CRAFTER account per unique artisan ─────────────────────────
  //    "Manoj Kumar" → gets the memorable demo crafter email/password.
  //    All others → ${slug}@artisanect.com with the same default password.
  console.log("  → Creating crafter accounts …");
  const crafterMap = new Map(); // artisanName → User

  for (const name of artisanNames) {
    const isMainDemo = name === "Manoj Kumar";
    const user = await prisma.user.create({
      data: {
        id:       isMainDemo ? "demo-crafter" : `artisan-${slugEmail(name).replace("@artisanect.com", "")}`,
        name,
        email:    isMainDemo ? "crafter@artisanect.com" : slugEmail(name),
        password: await hashPassword("Crafter@123"),
        role:     "CRAFTER",
        craft:    productsJson.find((p) => p.artisanName === name)?.category ?? null,
      },
    });
    crafterMap.set(name, user);
    const badge = isMainDemo ? " ← DEMO" : "";
    console.log(`     ✓ ${user.email}${badge}`);
  }

  // 6. Seed all 24 products ───────────────────────────────────────────────────
  console.log("\n  → Seeding 24 products …");
  let created = 0;

  for (const p of productsJson) {
    const crafter = crafterMap.get(p.artisanName);
    if (!crafter) {
      console.warn(`     ⚠ No crafter found for artisanName "${p.artisanName}" — skipping.`);
      continue;
    }

    await prisma.product.create({
      data: {
        // We supply `id` explicitly so product IDs remain stable between
        // seed runs and existing frontend links like /product/5 still work.
        id:               p.id,
        title:            p.title,
        category:         p.category,
        description:      p.description,
        price:            Number(p.price),
        rating:           Number(p.rating) || 0,
        stock:            Number(p.stock)  || 0,
        image:            p.image,
        images:           Array.isArray(p.images) && p.images.length ? p.images : [p.image],
        materials:        Array.isArray(p.materials) ? p.materials : [],
        tags:             Array.isArray(p.tags)      ? p.tags      : [],
        dimensions:       p.dimensions       || null,
        deliveryEstimate: p.deliveryEstimate || null,
        featured:         Boolean(p.featured),
        crafterId:        crafter.id,
      },
    });
    created++;
  }

  console.log(`     ✓ ${created} products inserted\n`);

  // 7. Seed a sample cart for the demo customer ──────────────────────────────
  console.log("  → Adding sample cart items for demo customer …");
  const sampleIds = [23, 16, 18]; // Candle, Clay Mug Set, Resin Earrings

  for (const pid of sampleIds) {
    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (product) {
      await prisma.cartItem.create({
        data: { userId: demoCustomer.id, productId: pid, quantity: 1 },
      });
      console.log(`     ✓ Added "${product.title}" to cart`);
    }
  }

  console.log("\n✅  Seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Demo credentials");
  console.log("  ─────────────────────────────────────────────────");
  console.log("  Customer:  customer@artisanect.com / Customer@123");
  console.log("  Crafter:   crafter@artisanect.com  / Crafter@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
